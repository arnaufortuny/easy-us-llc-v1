import type { Express, Request, Response } from "express";
import { isAdmin } from "../lib/custom-auth";
import { storage } from "../storage";
import { db } from "../db";
import { z } from "zod";
import { eq, desc, sql, inArray, and } from "drizzle-orm";
import {
  orders as ordersTable,
  users as usersTable,
  llcApplications as llcApplicationsTable,
  applicationDocuments as applicationDocumentsTable,
  orderEvents,
  messages as messagesTable,
  messageReplies,
  userNotifications,
  maintenanceApplications,
  discountCodes,
} from "@shared/schema";
import { logAudit } from "../lib/security";
import { asyncHandler, logActivity, STATUS_LABELS, DOC_TYPE_LABELS, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB } from "./helpers";
import {
  sendEmail,
  sendTrustpilotEmail,
  getOrderUpdateTemplate,
  getAccountDeactivatedTemplate,
  getAccountVipTemplate,
  getAccountReactivatedTemplate,
  getAdminNoteTemplate,
  getPaymentRequestTemplate,
  getDocumentUploadedTemplate,
  getOrderEventTemplate,
  getMessageReplyTemplate,
} from "../lib/email";
import { updateApplicationDeadlines } from "../calendar-service";

export function registerAdminRoutes(app: Express): void {
  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      const allOrders = await storage.getAllOrders();
      res.json(allOrders);
    } catch (error) {
      console.error("Admin orders error:", error);
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);
    const { status } = z.object({ status: z.string() }).parse(req.body);
    
    const [updatedOrder] = await db.update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, orderId))
      .returning();
    
    logAudit({ 
      action: 'order_status_change', 
      userId: (req as any).session?.userId, 
      targetId: String(orderId),
      details: { newStatus: status } 
    });
    
    const order = await storage.getOrder(orderId);
    if (order?.user?.email) {
      const statusLabel = STATUS_LABELS[status] || status.replace(/_/g, " ");

      if (status === 'completed' && order.userId) {
        await db.update(usersTable)
          .set({ accountStatus: 'vip' })
          .where(eq(usersTable.id, order.userId));
        
        const orderCode = order.application?.requestCode || order.maintenanceApplication?.requestCode || order.invoiceNumber || `#${order.id}`;
        sendTrustpilotEmail({
          to: order.user.email,
          name: order.user.firstName || "Cliente",
          orderNumber: orderCode
        }).catch(() => {});
      }

      if (status === 'filed' && order.application) {
        const formationDate = new Date();
        const state = order.application.state || "new_mexico";
        await updateApplicationDeadlines(order.application.id, formationDate, state);
      }

      const orderCode = order.application?.requestCode || order.maintenanceApplication?.requestCode || order.invoiceNumber || `#${order.id}`;
      await db.insert(userNotifications).values({
        userId: order.userId,
        orderId: order.id,
        orderCode,
        title: `Actualización de pedido: ${statusLabel}`,
        message: `Tu pedido ${orderCode} ha cambiado a: ${statusLabel}.${status === 'completed' ? ' ¡Enhorabuena, ahora eres cliente VIP!' : ''}`,
        type: 'update',
        isRead: false
      });

      await db.insert(orderEvents).values({
        orderId: order.id,
        eventType: statusLabel,
        description: `El estado del pedido ha sido actualizado a ${statusLabel}.`,
        createdBy: (req as any).session.userId
      });

      sendEmail({
        to: order.user.email,
        subject: `Actualización de estado - Pedido ${order.invoiceNumber || `#${order.id}`}`,
        html: getOrderUpdateTemplate(
          order.user.firstName || "Cliente",
          order.invoiceNumber || `#${order.id}`,
          status,
          `Tu pedido ha pasado a estado: ${STATUS_LABELS[status] || status}. Puedes ver los detalles en tu panel de control.`
        )
      }).catch(() => {});
    }
    res.json(updatedOrder);
  }));

  app.patch("/api/admin/orders/:id/payment-link", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);
    const { paymentLink, paymentStatus, paymentDueDate } = z.object({
      paymentLink: z.string().url().optional().nullable(),
      paymentStatus: z.enum(['pending', 'paid', 'overdue', 'cancelled']).optional(),
      paymentDueDate: z.string().optional().nullable()
    }).parse(req.body);

    const updateData: Record<string, unknown> = {};
    if (paymentLink !== undefined) updateData.paymentLink = paymentLink;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (paymentDueDate !== undefined) updateData.paymentDueDate = paymentDueDate ? new Date(paymentDueDate) : null;
    if (paymentStatus === 'paid') updateData.paidAt = new Date();

    const [updatedOrder] = await db.update(ordersTable)
      .set(updateData)
      .where(eq(ordersTable.id, orderId))
      .returning();

    if (!updatedOrder) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }

    logAudit({
      action: 'payment_link_update',
      userId: (req as any).session?.userId,
      targetId: String(orderId),
      details: { paymentLink, paymentStatus }
    });

    res.json(updatedOrder);
  }));

  app.delete("/api/admin/orders/:id", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const orderId = Number(req.params.id);
    
    const order = await storage.getOrder(orderId);
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    
    await db.transaction(async (tx) => {
      await tx.delete(orderEvents).where(eq(orderEvents.orderId, orderId));
      await tx.delete(applicationDocumentsTable).where(eq(applicationDocumentsTable.orderId, orderId));
      
      if (order.userId) {
        await tx.delete(userNotifications).where(
          and(
            eq(userNotifications.userId, order.userId),
            sql`${userNotifications.message} LIKE ${'%' + (order.invoiceNumber || `#${orderId}`) + '%'}`
          )
        );
      }
      
      if (order.application?.id) {
        await tx.delete(llcApplicationsTable).where(eq(llcApplicationsTable.id, order.application.id));
      }
      
      await tx.delete(ordersTable).where(eq(ordersTable.id, orderId));
    });
    
    res.json({ success: true, message: "Pedido eliminado correctamente" });
  }));

  app.patch("/api/admin/llc/:appId/dates", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const appId = Number(req.params.appId);
    const { field, value } = z.object({ 
      field: z.enum(['llcCreatedDate', 'agentRenewalDate', 'irs1120DueDate', 'irs5472DueDate', 'annualReportDueDate']),
      value: z.string()
    }).parse(req.body);
    
    const dateValue = value ? new Date(value) : null;
    const updateData: Record<string, Date | null> = {};
    updateData[field] = dateValue;
    
    if (field === 'llcCreatedDate' && dateValue) {
      const creationDate = new Date(dateValue);
      const creationYear = creationDate.getFullYear();
      const nextYear = creationYear + 1;
      
      const agentRenewal = new Date(creationDate);
      agentRenewal.setFullYear(agentRenewal.getFullYear() + 1);
      updateData.agentRenewalDate = agentRenewal;
      
      updateData.irs1120DueDate = new Date(nextYear, 2, 15);
      updateData.irs5472DueDate = new Date(nextYear, 3, 15);
      
      const [app] = await db.select({ state: llcApplicationsTable.state })
        .from(llcApplicationsTable)
        .where(eq(llcApplicationsTable.id, appId))
        .limit(1);
      
      if (app?.state) {
        if (app.state === 'Wyoming') {
          const wyomingDate = new Date(creationDate);
          wyomingDate.setFullYear(wyomingDate.getFullYear() + 1);
          wyomingDate.setDate(1);
          updateData.annualReportDueDate = wyomingDate;
        } else if (app.state === 'Delaware') {
          updateData.annualReportDueDate = new Date(nextYear, 2, 1);
        }
      }
    }
    
    await db.update(llcApplicationsTable)
      .set(updateData)
      .where(eq(llcApplicationsTable.id, appId));
    
    res.json({ success: true });
  }));

  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.patch("/api/admin/users/:id", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const updateSchema = z.object({
      firstName: z.string().min(1).max(100).optional(),
      lastName: z.string().min(1).max(100).optional(),
      email: z.string().email().optional(),
      phone: z.string().max(30).optional().nullable(),
      address: z.string().optional().nullable(),
      streetType: z.string().optional().nullable(),
      city: z.string().optional().nullable(),
      province: z.string().optional().nullable(),
      postalCode: z.string().optional().nullable(),
      country: z.string().optional().nullable(),
      idNumber: z.string().optional().nullable(),
      idType: z.enum(['dni', 'nie', 'passport']).optional().nullable(),
      birthDate: z.string().optional().nullable(),
      businessActivity: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      isAdmin: z.boolean().optional(),
      accountStatus: z.enum(['active', 'pending', 'deactivated', 'vip']).optional(),
      internalNotes: z.string().optional().nullable()
    });
    const data = updateSchema.parse(req.body);
    
    const [updated] = await db.update(usersTable).set({
      ...data,
      updatedAt: new Date()
    }).where(eq(usersTable.id, userId)).returning();

    logAudit({ 
      action: 'admin_user_update', 
      userId: (req as any).session?.userId, 
      targetId: userId,
      details: { changes: Object.keys(data) } 
    });

    if (data.accountStatus) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (user && user.email) {
        if (data.accountStatus === 'deactivated') {
          await sendEmail({
            to: user.email,
            subject: "Notificación de estado de cuenta",
            html: getAccountDeactivatedTemplate(user.firstName || "Cliente")
          }).catch(() => {});
          await db.insert(userNotifications).values({
            userId,
            title: "Cuenta desactivada",
            message: "Tu cuenta ha sido desactivada. Contacta con soporte si tienes dudas.",
            type: 'action_required',
            isRead: false
          });
        } else if (data.accountStatus === 'vip') {
          await sendEmail({
            to: user.email,
            subject: "Tu cuenta ha sido actualizada a estado VIP",
            html: getAccountVipTemplate(user.firstName || "Cliente")
          }).catch(() => {});
          await db.insert(userNotifications).values({
            userId,
            title: "Estado VIP activado",
            message: "Tu cuenta ha sido actualizada al estado VIP con beneficios prioritarios.",
            type: 'update',
            isRead: false
          });
        } else if (data.accountStatus === 'active') {
          await sendEmail({
            to: user.email,
            subject: "Tu cuenta ha sido reactivada",
            html: getAccountReactivatedTemplate(user.firstName || "Cliente")
          }).catch(() => {});
          await db.insert(userNotifications).values({
            userId,
            title: "Cuenta reactivada",
            message: "Tu cuenta ha sido reactivada y ya puedes acceder a todos los servicios.",
            type: 'update',
            isRead: false
          });
        }
      }
    }

    if (data.accountStatus || data.isActive !== undefined) {
      logActivity("Cambio Crítico de Cuenta", { 
        userId, 
        "Nuevo Estado": data.accountStatus, 
        "Activo": data.isActive,
        adminId: (req as any).session.userId 
      }, req);
    }

    res.json(updated);
  }));

  app.delete("/api/admin/users/:id", isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      
      const userOrders = await db.select({ id: ordersTable.id }).from(ordersTable).where(eq(ordersTable.userId, userId));
      const orderIds = userOrders.map(o => o.id);
      
      const userApps = orderIds.length > 0 
        ? await db.select({ id: llcApplicationsTable.id }).from(llcApplicationsTable).where(inArray(llcApplicationsTable.orderId, orderIds))
        : [];
      const appIds = userApps.map(a => a.id);
      
      if (orderIds.length > 0) {
        await db.delete(applicationDocumentsTable).where(inArray(applicationDocumentsTable.orderId, orderIds));
      }
      if (appIds.length > 0) {
        await db.delete(applicationDocumentsTable).where(inArray(applicationDocumentsTable.applicationId, appIds));
      }
      
      if (orderIds.length > 0) {
        await db.delete(orderEvents).where(inArray(orderEvents.orderId, orderIds));
      }
      
      await db.delete(userNotifications).where(eq(userNotifications.userId, userId));
      
      const userMessages = await db.select({ id: messagesTable.id }).from(messagesTable).where(eq(messagesTable.userId, userId));
      const messageIds = userMessages.map(m => m.id);
      if (messageIds.length > 0) {
        await db.delete(messageReplies).where(inArray(messageReplies.messageId, messageIds));
      }
      await db.delete(messagesTable).where(eq(messagesTable.userId, userId));
      
      if (orderIds.length > 0) {
        await db.delete(maintenanceApplications).where(inArray(maintenanceApplications.orderId, orderIds));
      }
      
      if (orderIds.length > 0) {
        await db.delete(llcApplicationsTable).where(inArray(llcApplicationsTable.orderId, orderIds));
      }
      
      await db.delete(ordersTable).where(eq(ordersTable.userId, userId));
      await db.delete(usersTable).where(eq(usersTable.id, userId));
      
      logAudit({ 
        action: 'admin_user_update', 
        userId: (req as any).session?.userId, 
        targetId: userId,
        details: { action: 'cascade_delete', deletedOrders: orderIds.length, deletedApps: appIds.length } 
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error al eliminar usuario" });
    }
  });

  app.post("/api/admin/users/create", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      password: z.string().min(6)
    });
    const { firstName, lastName, email, phone, password } = schema.parse(req.body);
    
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }
    
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { generateUniqueClientId } = await import("../lib/auth-service");
    const clientId = await generateUniqueClientId();
    
    const [newUser] = await db.insert(usersTable).values({
      email,
      passwordHash: hashedPassword,
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
      clientId,
      emailVerified: true,
      accountStatus: 'active'
    }).returning();
    
    res.json(newUser);
  }));

  app.get("/api/admin/messages", isAdmin, async (req, res) => {
    try {
      const allMessages = await storage.getAllMessages();
      res.json(allMessages);
    } catch (error) {
      res.status(500).json({ message: "Error" });
    }
  });

  app.patch("/api/admin/messages/:id/read", isAdmin, async (req, res) => {
    try {
      const updated = await storage.updateMessageStatus(Number(req.params.id), 'read');
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al marcar mensaje como leído" });
    }
  });

  app.patch("/api/admin/messages/:id/archive", isAdmin, async (req, res) => {
    try {
      const updated = await storage.updateMessageStatus(Number(req.params.id), 'archived');
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error al archivar mensaje" });
    }
  });

  app.delete("/api/admin/messages/:id", isAdmin, async (req, res) => {
    try {
      const msgId = Number(req.params.id);
      await db.delete(messageReplies).where(eq(messageReplies.messageId, msgId));
      await db.delete(messagesTable).where(eq(messagesTable.id, msgId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar mensaje" });
    }
  });

  app.post("/api/admin/documents", isAdmin, async (req, res) => {
    try {
      const { orderId, fileName, fileUrl, documentType, applicationId } = req.body;
      const [doc] = await db.insert(applicationDocumentsTable).values({
        orderId,
        applicationId,
        fileName,
        fileType: "application/pdf",
        fileUrl,
        documentType: documentType || "official_filing",
        reviewStatus: "approved",
        uploadedBy: (req as any).session.userId
      }).returning();
      
      res.json(doc);
    } catch (error) {
      console.error("Upload doc error:", error);
      res.status(500).json({ message: "Error uploading document" });
    }
  });

  app.post("/api/admin/documents/upload", isAdmin, async (req: any, res) => {
    try {
      const busboy = (await import('busboy')).default;
      const bb = busboy({ 
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE_BYTES }
      });
      
      let fileName = '';
      let fileBuffer: Buffer | null = null;
      let fileTruncated = false;
      let documentType = 'other';
      let orderId = '';
      
      bb.on('field', (name: string, val: string) => {
        if (name === 'documentType') documentType = val;
        if (name === 'orderId') orderId = val;
      });
      
      bb.on('file', (name: string, file: any, info: any) => {
        fileName = info.filename || `documento_${Date.now()}`;
        const chunks: Buffer[] = [];
        file.on('data', (data: Buffer) => chunks.push(data));
        file.on('limit', () => { fileTruncated = true; });
        file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
      });

      bb.on('finish', async () => {
        if (fileTruncated) {
          return res.status(413).json({ message: `El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB` });
        }
        
        if (!fileBuffer || !orderId) {
          return res.status(400).json({ message: "Faltan datos requeridos" });
        }

        const fs = await import('fs/promises');
        const path = await import('path');
        const uploadDir = path.join(process.cwd(), 'uploads', 'admin-docs');
        await fs.mkdir(uploadDir, { recursive: true });
        
        const safeFileName = `admin_${orderId}_${Date.now()}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadDir, safeFileName);
        await fs.writeFile(filePath, fileBuffer);
        
        const ext = fileName.toLowerCase().split('.').pop() || '';
        const mimeTypes: Record<string, string> = {
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png'
        };
        const fileType = mimeTypes[ext] || 'application/octet-stream';
        
        const [llcApp] = await db.select().from(llcApplicationsTable).where(eq(llcApplicationsTable.orderId, Number(orderId))).limit(1);
        
        const [doc] = await db.insert(applicationDocumentsTable).values({
          orderId: Number(orderId),
          applicationId: llcApp?.id || null,
          fileName: DOC_TYPE_LABELS[documentType] || fileName,
          fileType,
          fileUrl: `/uploads/admin-docs/${safeFileName}`,
          documentType: documentType,
          reviewStatus: 'approved',
          uploadedBy: req.session.userId
        }).returning();

        const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, Number(orderId))).limit(1);
        if (order?.userId) {
          const orderCode = llcApp?.requestCode || order.invoiceNumber || `#${order.id}`;
          const docLabel = DOC_TYPE_LABELS[documentType] || 'Documento';
          
          await db.insert(userNotifications).values({
            userId: order.userId,
            orderId: Number(orderId),
            orderCode,
            title: 'Nuevo documento disponible',
            message: `Se ha añadido el documento "${docLabel}" a tu expediente.`,
            type: 'info',
            isRead: false
          });
          
          const [user] = await db.select().from(usersTable).where(eq(usersTable.id, order.userId)).limit(1);
          if (user?.email) {
            sendEmail({
              to: user.email,
              subject: `Nuevo documento disponible - ${orderCode}`,
              html: getDocumentUploadedTemplate(user.firstName || 'Cliente', docLabel, orderCode)
            }).catch(() => {});
          }
        }
        
        res.json(doc);
      });

      req.pipe(bb);
    } catch (error) {
      console.error("Admin upload doc error:", error);
      res.status(500).json({ message: "Error uploading document" });
    }
  });

  app.get("/api/admin/documents", isAdmin, async (req, res) => {
    try {
      const docs = await db.select().from(applicationDocumentsTable)
        .leftJoin(ordersTable, eq(applicationDocumentsTable.orderId, ordersTable.id))
        .leftJoin(usersTable, eq(ordersTable.userId, usersTable.id))
        .leftJoin(llcApplicationsTable, eq(applicationDocumentsTable.applicationId, llcApplicationsTable.id))
        .orderBy(desc(applicationDocumentsTable.uploadedAt));
      res.json(docs.map(d => ({
        ...d.application_documents,
        order: d.orders,
        user: d.users ? { id: d.users.id, firstName: d.users.firstName, lastName: d.users.lastName, email: d.users.email } : null,
        application: d.llc_applications ? { companyName: d.llc_applications.companyName, state: d.llc_applications.state } : null
      })));
    } catch (error) {
      console.error("Admin documents error:", error);
      res.status(500).json({ message: "Error fetching documents" });
    }
  });

  app.patch("/api/admin/documents/:id/review", isAdmin, async (req, res) => {
    try {
      const docId = Number(req.params.id);
      const { reviewStatus } = z.object({ reviewStatus: z.enum(["pending", "approved", "rejected", "action_required"]) }).parse(req.body);
      
      const [updated] = await db.update(applicationDocumentsTable)
        .set({ reviewStatus })
        .where(eq(applicationDocumentsTable.id, docId))
        .returning();
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating document review status" });
    }
  });

  app.post("/api/admin/send-note", isAdmin, async (req, res) => {
    try {
      const { userId, title, message, type } = z.object({
        userId: z.string(),
        title: z.string().min(1, "Título requerido"),
        message: z.string().min(1, "Mensaje requerido"),
        type: z.enum(['update', 'info', 'action_required'])
      }).parse(req.body);

      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const { generateUniqueTicketId } = await import("../lib/id-generator");
      const ticketId = await generateUniqueTicketId();

      await db.insert(userNotifications).values({
        userId,
        title,
        message,
        type,
        ticketId,
        isRead: false
      });

      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `${title} - Ticket #${ticketId}`,
          html: getAdminNoteTemplate(user.firstName || 'Cliente', title, message, ticketId)
        });
      }

      res.json({ success: true, emailSent: !!user.email, ticketId });
    } catch (error) {
      console.error("Error sending note:", error);
      res.status(500).json({ message: "Error al enviar nota" });
    }
  });

  app.post("/api/admin/send-payment-link", isAdmin, async (req, res) => {
    try {
      const { userId, paymentLink, message, amount } = z.object({
        userId: z.string(),
        paymentLink: z.string().url(),
        message: z.string(),
        amount: z.string().optional()
      }).parse(req.body);

      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
      if (!user || !user.email) return res.status(404).json({ message: "Usuario o email no encontrado" });

      await sendEmail({
        to: user.email,
        subject: "Pago pendiente - Easy US LLC",
        html: getPaymentRequestTemplate(user.firstName || 'Cliente', message, paymentLink, amount)
      });

      await db.insert(userNotifications).values({
        userId,
        title: "Pago Pendiente Solicitado",
        message: `Se ha enviado un enlace de pago por ${amount || 'el trámite'}. Revisa tu email.`,
        type: 'action_required',
        isRead: false
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Send payment link error:", error);
      res.status(500).json({ message: "Error al enviar enlace de pago" });
    }
  });

  app.post("/api/admin/orders/:id/events", isAdmin, async (req: any, res) => {
    try {
      const orderId = Number(req.params.id);
      const { eventType, description } = req.body;
      
      const [event] = await db.insert(orderEvents).values({
        orderId,
        eventType,
        description,
        createdBy: req.session.userId,
      }).returning();
      
      const order = await storage.getOrder(orderId);
      if (order) {
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, order.userId)).limit(1);
        if (user?.email) {
          sendEmail({
            to: user.email,
            subject: "Actualización de tu pedido",
            html: getOrderEventTemplate(user.firstName || 'Cliente', String(orderId), eventType, description)
          }).catch(() => {});
        }
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error creating order event:", error);
      res.status(500).json({ message: "Error al crear evento" });
    }
  });

  app.post("/api/admin/applications/:id/set-formation-date", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const { formationDate, state } = z.object({
        formationDate: z.string(),
        state: z.string().optional()
      }).parse(req.body);

      const [app] = await db.select().from(llcApplicationsTable).where(eq(llcApplicationsTable.id, applicationId)).limit(1);
      if (!app) {
        return res.status(404).json({ message: "Aplicación no encontrada" });
      }

      const deadlines = await updateApplicationDeadlines(
        applicationId, 
        new Date(formationDate), 
        state || app.state || "new_mexico"
      );

      res.json({ 
        success: true, 
        message: "Fechas de cumplimiento calculadas exitosamente",
        deadlines 
      });
    } catch (error) {
      console.error("Error setting formation date:", error);
      res.status(500).json({ message: "Error al establecer fecha de constitución" });
    }
  });

  app.get("/api/admin/discount-codes", isAdmin, async (req, res) => {
    try {
      const codes = await db.select().from(discountCodes).orderBy(desc(discountCodes.createdAt));
      res.json(codes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching discount codes" });
    }
  });

  app.post("/api/admin/discount-codes", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const schema = z.object({
      code: z.string().min(3).max(50),
      description: z.string().optional(),
      discountType: z.enum(['percentage', 'fixed']),
      discountValue: z.number().min(1),
      minOrderAmount: z.number().optional(),
      maxUses: z.number().optional().nullable(),
      validFrom: z.string().optional(),
      validUntil: z.string().optional().nullable(),
      isActive: z.boolean().optional()
    });
    const data = schema.parse(req.body);
    
    const [newCode] = await db.insert(discountCodes).values({
      code: data.code.toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount || 0,
      maxUses: data.maxUses,
      validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      isActive: data.isActive ?? true
    }).returning();
    
    res.json(newCode);
  }));

  app.patch("/api/admin/discount-codes/:id", isAdmin, asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const schema = z.object({
      code: z.string().min(3).max(50).optional(),
      description: z.string().optional().nullable(),
      discountType: z.enum(['percentage', 'fixed']).optional(),
      discountValue: z.number().min(1).optional(),
      minOrderAmount: z.number().optional(),
      maxUses: z.number().optional().nullable(),
      validFrom: z.string().optional(),
      validUntil: z.string().optional().nullable(),
      isActive: z.boolean().optional()
    });
    const data = schema.parse(req.body);
    
    const updateData: any = { ...data };
    if (data.code) updateData.code = data.code.toUpperCase();
    if (data.validFrom) updateData.validFrom = new Date(data.validFrom);
    if (data.validUntil) updateData.validUntil = new Date(data.validUntil);
    
    const [updated] = await db.update(discountCodes)
      .set(updateData)
      .where(eq(discountCodes.id, id))
      .returning();
    
    res.json(updated);
  }));

  app.delete("/api/admin/discount-codes/:id", isAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      await db.delete(discountCodes).where(eq(discountCodes.id, id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error deleting discount code" });
    }
  });

  app.post("/api/seed-admin", isAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      const adminEmail = email || process.env.ADMIN_EMAIL || "afortuny07@gmail.com";
      
      const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail)).limit(1);
      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      
      await db.update(usersTable).set({ isAdmin: true, accountStatus: 'active' }).where(eq(usersTable.email, adminEmail));
      res.json({ success: true, message: "Rol de administrador asignado correctamente" });
    } catch (error) {
      console.error("Seed admin error:", error);
      res.status(500).json({ message: "Error al asignar rol de administrador" });
    }
  });
}
