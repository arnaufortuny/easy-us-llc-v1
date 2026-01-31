import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../lib/custom-auth";
import { storage } from "../storage";
import { db } from "../db";
import { z } from "zod";
import { eq, and, gt, desc, sql } from "drizzle-orm";
import { api } from "@shared/routes";
import {
  orders as ordersTable,
  users as usersTable,
  llcApplications as llcApplicationsTable,
  maintenanceApplications,
  applicationDocuments as applicationDocumentsTable,
  orderEvents,
  userNotifications,
  contactOtps,
  discountCodes,
  products as productsTable,
} from "@shared/schema";
import { asyncHandler, logActivity } from "./helpers";
import {
  sendEmail,
  getWelcomeEmailTemplate,
  getConfirmationEmailTemplate,
  getAdminLLCOrderTemplate,
  getAdminMaintenanceOrderTemplate,
} from "../lib/email";

export function registerOrderRoutes(app: Express): void {
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const orders = await storage.getOrders(req.session.userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req: any, res) => {
    try {
      const orderId = Number(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      
      if (order.userId !== req.session.userId && !req.session.isAdmin) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener pedido" });
    }
  });

  app.get("/api/orders/:id/events", isAuthenticated, async (req: any, res) => {
    try {
      const orderId = Number(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) return res.status(404).json({ message: "Pedido no encontrado" });
      if (order.userId !== req.session.userId && !req.session.isAdmin) {
        return res.status(403).json({ message: "Acceso denegado" });
      }
      
      const events = await db.select().from(orderEvents)
        .where(eq(orderEvents.orderId, orderId))
        .orderBy(desc(orderEvents.createdAt));
      
      res.json(events);
    } catch (error) {
      console.error("Error fetching order events:", error);
      res.status(500).json({ message: "Error al obtener eventos" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { productId, discountCode, discountAmount } = z.object({
        productId: z.number(),
        discountCode: z.string().optional(),
        discountAmount: z.number().optional()
      }).parse(req.body);
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(400).json({ message: "Invalid product" });
      }

      let finalPrice = product.price;
      if (product.name.includes("New Mexico")) finalPrice = 73900;
      else if (product.name.includes("Wyoming")) finalPrice = 89900;
      else if (product.name.includes("Delaware")) finalPrice = 119900;

      let originalAmount = finalPrice;
      let appliedDiscountAmount = 0;
      let appliedDiscountCode: string | null = null;
      
      if (discountCode && discountAmount) {
        appliedDiscountCode = discountCode;
        appliedDiscountAmount = discountAmount;
        finalPrice = Math.max(0, finalPrice - discountAmount);
        
        await db.update(discountCodes)
          .set({ usedCount: sql`${discountCodes.usedCount} + 1` })
          .where(eq(discountCodes.code, discountCode.toUpperCase()));
      }

      const order = await storage.createOrder({
        userId,
        productId,
        amount: finalPrice,
        originalAmount: appliedDiscountCode ? originalAmount : null,
        discountCode: appliedDiscountCode,
        discountAmount: appliedDiscountAmount || null,
        status: "pending",
        stripeSessionId: "mock_session_" + Date.now(),
      });

      await db.insert(orderEvents).values({
        orderId: order.id,
        eventType: "Pedido Recibido",
        description: `Se ha registrado un nuevo pedido para ${product.name}.`,
        createdBy: userId
      });

      const application = await storage.createLlcApplication({
        orderId: order.id,
        status: "draft",
        state: product.name.split(" ")[0],
      });

      if (userId && !userId.startsWith('guest_')) {
        await db.insert(userNotifications).values({
          userId,
          orderId: order.id,
          orderCode: application.requestCode || order.invoiceNumber,
          title: "Nuevo pedido registrado",
          message: `Tu pedido de ${product.name} ha sido registrado correctamente. Te mantendremos informado del progreso.`,
          type: 'info',
          isRead: false
        });
      }

      const { generateUniqueOrderCode } = await import("../lib/id-generator");
      const appState = product.name.split(" ")[0] || 'New Mexico';
      const requestCode = await generateUniqueOrderCode(appState);

      const updatedApplication = await storage.updateLlcApplication(application.id, { requestCode });

      logActivity("Nuevo Pedido Recibido", {
        "Referencia": requestCode,
        "Producto": product.name,
        "Importe": `${(finalPrice / 100).toFixed(2)}€`,
        "Usuario": userId,
        "IP": req.ip
      });

      res.status(201).json({ ...order, application: updatedApplication });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating order:", err);
      return res.status(500).json({ message: "Error creating order" });
    }
  });

  app.post("/api/discount-codes/validate", async (req, res) => {
    try {
      const { code, orderAmount } = z.object({
        code: z.string(),
        orderAmount: z.number()
      }).parse(req.body);
      
      const [discountCode] = await db.select().from(discountCodes)
        .where(eq(discountCodes.code, code.toUpperCase()))
        .limit(1);
      
      if (!discountCode) {
        return res.status(404).json({ message: "Código de descuento no válido" });
      }
      
      if (!discountCode.isActive) {
        return res.status(400).json({ message: "Este código de descuento no está activo" });
      }
      
      const now = new Date();
      if (discountCode.validFrom && now < discountCode.validFrom) {
        return res.status(400).json({ message: "Este código aún no es válido" });
      }
      if (discountCode.validUntil && now > discountCode.validUntil) {
        return res.status(400).json({ message: "Este código ha expirado" });
      }
      
      if (discountCode.maxUses && discountCode.usedCount >= discountCode.maxUses) {
        return res.status(400).json({ message: "Este código ha alcanzado su límite de usos" });
      }
      
      if (discountCode.minOrderAmount && orderAmount < discountCode.minOrderAmount) {
        return res.status(400).json({ message: `El pedido mínimo para este código es ${(discountCode.minOrderAmount / 100).toFixed(2)}€` });
      }
      
      let discountAmount = 0;
      if (discountCode.discountType === 'percentage') {
        discountAmount = Math.round(orderAmount * (discountCode.discountValue / 100));
      } else {
        discountAmount = discountCode.discountValue;
      }
      
      res.json({
        valid: true,
        code: discountCode.code,
        discountType: discountCode.discountType,
        discountValue: discountCode.discountValue,
        discountAmount,
        description: discountCode.description
      });
    } catch (error) {
      res.status(500).json({ message: "Error al validar código" });
    }
  });

  app.post("/api/llc/claim-order", async (req: any, res) => {
    try {
      const { applicationId, email, password, ownerFullName, paymentMethod, discountCode, discountAmount } = req.body;
      
      if (!applicationId || !email || !password) {
        return res.status(400).json({ message: "Se requiere email y contraseña." });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
      }
      
      const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      if (existingUser) {
        return res.status(400).json({ message: "Este email ya está registrado. Por favor inicia sesión." });
      }
      
      const [otpRecord] = await db.select()
        .from(contactOtps)
        .where(
          and(
            eq(contactOtps.email, email),
            eq(contactOtps.otpType, "account_verification"),
            eq(contactOtps.verified, true),
            gt(contactOtps.expiresAt, new Date(Date.now() - 30 * 60 * 1000))
          )
        )
        .orderBy(sql`${contactOtps.expiresAt} DESC`)
        .limit(1);
      
      if (!otpRecord) {
        return res.status(400).json({ message: "Por favor verifica tu email antes de continuar." });
      }
      
      const application = await storage.getLlcApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Solicitud no encontrada." });
      }
      
      const { hashPassword, generateUniqueClientId } = await import("../lib/auth-service");
      const passwordHash = await hashPassword(password);
      const clientId = await generateUniqueClientId();
      const nameParts = ownerFullName?.split(' ') || ['Cliente'];
      
      const [newUser] = await db.insert(usersTable).values({
        email,
        passwordHash,
        clientId,
        firstName: nameParts[0] || 'Cliente',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: application.ownerPhone || null,
        streetType: application.ownerStreetType || null,
        address: application.ownerAddress || null,
        city: application.ownerCity || null,
        province: application.ownerProvince || null,
        postalCode: application.ownerPostalCode || null,
        country: application.ownerCountry || null,
        birthDate: application.ownerBirthDate || null,
        businessActivity: application.businessActivity || null,
        emailVerified: true,
        accountStatus: 'active',
      }).returning();
      
      const orderUpdate: any = { userId: newUser.id };
      if (discountCode && discountAmount) {
        orderUpdate.discountCode = discountCode;
        orderUpdate.discountAmount = discountAmount;
        await db.update(discountCodes)
          .set({ usedCount: sql`${discountCodes.usedCount} + 1` })
          .where(eq(discountCodes.code, discountCode));
      }
      await db.update(ordersTable)
        .set(orderUpdate)
        .where(eq(ordersTable.id, application.orderId));
      
      if (paymentMethod) {
        await storage.updateLlcApplication(applicationId, { paymentMethod });
      }
      
      req.session.userId = newUser.id;
      
      sendEmail({
        to: email,
        subject: "Bienvenido a Easy US LLC - Acceso a tu panel",
        html: getWelcomeEmailTemplate(nameParts[0] || 'Cliente')
      }).catch(console.error);
      
      res.json({ success: true, userId: newUser.id });
    } catch (error) {
      console.error("Error claiming order:", error);
      res.status(500).json({ message: "Error al crear la cuenta." });
    }
  });

  app.post("/api/maintenance/claim-order", async (req: any, res) => {
    try {
      const { applicationId, email, password, ownerFullName, paymentMethod, discountCode, discountAmount } = req.body;
      
      if (!applicationId || !email || !password) {
        return res.status(400).json({ message: "Se requiere email y contraseña." });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
      }
      
      const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
      if (existingUser) {
        return res.status(400).json({ message: "Este email ya está registrado. Por favor inicia sesión." });
      }
      
      const [otpRecord] = await db.select()
        .from(contactOtps)
        .where(
          and(
            eq(contactOtps.email, email),
            eq(contactOtps.otpType, "account_verification"),
            eq(contactOtps.verified, true),
            gt(contactOtps.expiresAt, new Date(Date.now() - 30 * 60 * 1000))
          )
        )
        .orderBy(sql`${contactOtps.expiresAt} DESC`)
        .limit(1);
      
      if (!otpRecord) {
        return res.status(400).json({ message: "Por favor verifica tu email antes de continuar." });
      }
      
      const [application] = await db.select().from(maintenanceApplications).where(eq(maintenanceApplications.id, applicationId)).limit(1);
      if (!application) {
        return res.status(404).json({ message: "Solicitud no encontrada." });
      }
      
      const { hashPassword, generateUniqueClientId } = await import("../lib/auth-service");
      const passwordHash = await hashPassword(password);
      const clientId = await generateUniqueClientId();
      const nameParts = ownerFullName?.split(' ') || ['Cliente'];
      
      const [newUser] = await db.insert(usersTable).values({
        email,
        passwordHash,
        clientId,
        firstName: nameParts[0] || 'Cliente',
        lastName: nameParts.slice(1).join(' ') || '',
        emailVerified: true,
        accountStatus: 'active',
      }).returning();
      
      const orderUpdate: any = { userId: newUser.id };
      if (discountCode && discountAmount) {
        orderUpdate.discountCode = discountCode;
        orderUpdate.discountAmount = discountAmount;
        await db.update(discountCodes)
          .set({ usedCount: sql`${discountCodes.usedCount} + 1` })
          .where(eq(discountCodes.code, discountCode));
      }
      await db.update(ordersTable)
        .set(orderUpdate)
        .where(eq(ordersTable.id, application.orderId));
      
      if (paymentMethod) {
        await db.update(maintenanceApplications)
          .set({ paymentMethod })
          .where(eq(maintenanceApplications.id, applicationId));
      }
      
      req.session.userId = newUser.id;
      
      sendEmail({
        to: email,
        subject: "Bienvenido a Easy US LLC - Acceso a tu panel",
        html: getWelcomeEmailTemplate(nameParts[0] || 'Cliente')
      }).catch(console.error);
      
      res.json({ success: true, userId: newUser.id });
    } catch (error) {
      console.error("Error claiming maintenance order:", error);
      res.status(500).json({ message: "Error al crear la cuenta." });
    }
  });

  app.patch("/api/llc/:id/data", isAuthenticated, async (req: any, res) => {
    try {
      const appId = Number(req.params.id);
      const updates = req.body;
      const [updated] = await db.update(llcApplicationsTable)
        .set({ ...updates, lastUpdated: new Date() })
        .where(eq(llcApplicationsTable.id, appId))
        .returning();
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Error updating application" });
    }
  });

  app.get(api.llc.get.path, async (req: any, res) => {
    const appId = Number(req.params.id);
    
    const application = await storage.getLlcApplication(appId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  });

  app.put(api.llc.update.path, async (req: any, res) => {
    try {
      const appId = Number(req.params.id);
      const updates = api.llc.update.input.parse(req.body);

      const application = await storage.getLlcApplication(appId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const updatedApp = await storage.updateLlcApplication(appId, updates);
      
      if (updates.status === "submitted" && updatedApp.ownerEmail) {
        const orderIdentifier = updatedApp.requestCode || `#${updatedApp.id}`;
        
        const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, updatedApp.orderId)).limit(1);
        const orderAmount = order ? (order.amount / 100).toFixed(2) : 'N/A';
        
        const adminEmail = process.env.ADMIN_EMAIL || "afortuny07@gmail.com";
        const paymentMethodLabel = updatedApp.paymentMethod === 'transfer' ? 'Transferencia Bancaria' : updatedApp.paymentMethod === 'link' ? 'Link de Pago' : 'No especificado';
        
        sendEmail({
          to: adminEmail,
          subject: `[PEDIDO REALIZADO] ${orderIdentifier} - ${updatedApp.companyName}`,
          html: getAdminLLCOrderTemplate({
            orderIdentifier,
            amount: orderAmount,
            paymentMethod: paymentMethodLabel,
            ownerFullName: updatedApp.ownerFullName || undefined,
            ownerEmail: updatedApp.ownerEmail || undefined,
            ownerPhone: updatedApp.ownerPhone || undefined,
            ownerBirthDate: updatedApp.ownerBirthDate || undefined,
            ownerIdType: updatedApp.ownerIdType || undefined,
            ownerIdNumber: updatedApp.ownerIdNumber || undefined,
            ownerAddress: `${updatedApp.ownerStreetType || ''} ${updatedApp.ownerAddress || ''}`.trim() || undefined,
            ownerCity: updatedApp.ownerCity || undefined,
            ownerProvince: updatedApp.ownerProvince || undefined,
            ownerPostalCode: updatedApp.ownerPostalCode || undefined,
            ownerCountry: updatedApp.ownerCountry || undefined,
            companyName: updatedApp.companyName || undefined,
            companyNameOption2: updatedApp.companyNameOption2 || undefined,
            designator: updatedApp.designator || undefined,
            state: updatedApp.state || undefined,
            businessCategory: updatedApp.businessCategory === "Otra (especificar)" ? (updatedApp.businessCategoryOther || undefined) : (updatedApp.businessCategory || undefined),
            businessActivity: updatedApp.businessActivity || undefined,
            companyDescription: updatedApp.companyDescription || undefined,
            isSellingOnline: updatedApp.isSellingOnline || undefined,
            needsBankAccount: updatedApp.needsBankAccount || undefined,
            willUseStripe: updatedApp.willUseStripe || undefined,
            wantsBoiReport: updatedApp.wantsBoiReport || undefined,
            wantsMaintenancePack: updatedApp.wantsMaintenancePack || undefined,
            notes: updatedApp.notes || undefined
          })
        }).catch(() => {});

        sendEmail({
          to: updatedApp.ownerEmail,
          subject: `Solicitud recibida - Referencia ${orderIdentifier}`,
          html: getConfirmationEmailTemplate(updatedApp.ownerFullName || "Cliente", orderIdentifier, { companyName: updatedApp.companyName || undefined }),
        }).catch(() => {});
      }

      res.json(updatedApp);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error updating LLC application:", err);
      res.status(500).json({ message: "Error updating request" });
    }
  });

  app.get(api.llc.getByCode.path, async (req: any, res) => {
    const code = req.params.code;
    
    const application = await storage.getLlcApplicationByRequestCode(code);
    if (!application) {
      return res.status(404).json({ message: "Solicitud no encontrada. Verifica el código ingresado." });
    }

    res.json(application);
  });

  app.post(api.documents.create.path, async (req: any, res) => {
    try {
      const docData = api.documents.create.input.parse(req.body);
      
      if (docData.applicationId) {
        const application = await storage.getLlcApplication(docData.applicationId);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }
      }

      const document = await storage.createDocument(docData);
      res.status(201).json(document);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });
}
