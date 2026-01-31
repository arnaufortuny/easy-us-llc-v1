import type { Express } from "express";
import { isAuthenticated } from "../lib/custom-auth";
import { storage } from "../storage";
import { db } from "../db";
import { z } from "zod";
import { eq, and, gt, desc } from "drizzle-orm";
import {
  users as usersTable,
  messages as messagesTable,
  messageReplies,
  newsletterSubscribers,
  contactOtps,
  userNotifications,
} from "@shared/schema";
import { checkRateLimit, sanitizeHtml, getClientIp } from "../lib/security";
import { logActivity } from "./helpers";
import {
  sendEmail,
  getOtpEmailTemplate,
  getAutoReplyTemplate,
  getNewsletterWelcomeTemplate,
  getMessageReplyTemplate,
} from "../lib/email";

export function registerContactRoutes(app: Express): void {
  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userMessages = await storage.getMessagesByUserId(req.session.userId);
      res.json(userMessages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching messages" });
    }
  });

  app.post("/api/messages", async (req: any, res) => {
    try {
      const { name, email, phone, contactByWhatsapp, subject, content, requestCode } = req.body;
      const userId = req.session?.userId || null;
      
      if (userId) {
        const [currentUser] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
        if (currentUser?.accountStatus === 'deactivated') {
          return res.status(403).json({ message: "Tu cuenta está suspendida. No puedes enviar mensajes." });
        }
      }
      
      const message = await storage.createMessage({
        userId,
        name,
        email,
        phone: phone || null,
        contactByWhatsapp: contactByWhatsapp || false,
        subject,
        content,
        requestCode,
        type: "contact"
      });

      const ticketId = message.messageId || String(message.id);
      sendEmail({
        to: email,
        subject: `Recibimos tu mensaje - Ticket #${ticketId}`,
        html: getAutoReplyTemplate(ticketId, name || "Cliente"),
      }).catch(() => {});

      logActivity("Nuevo Mensaje de Contacto", {
        "Nombre": name,
        "Email": email,
        "Teléfono": phone || "No proporcionado",
        "WhatsApp": contactByWhatsapp ? "Sí" : "No",
        "Asunto": subject,
        "Mensaje": content,
        "Referencia": requestCode || "N/A"
      });

      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ message: "Error sending message" });
    }
  });

  app.get("/api/messages/:id/replies", isAuthenticated, async (req: any, res) => {
    try {
      const messageId = Number(req.params.id);
      const replies = await db.select().from(messageReplies)
        .where(eq(messageReplies.messageId, messageId))
        .orderBy(messageReplies.createdAt);
      
      res.json(replies);
    } catch (error) {
      console.error("Error fetching message replies:", error);
      res.status(500).json({ message: "Error al obtener respuestas" });
    }
  });

  app.post("/api/messages/:id/reply", isAuthenticated, async (req: any, res) => {
    try {
      const messageId = Number(req.params.id);
      const { content } = req.body;
      
      if (!content || typeof content !== 'string' || !content.trim()) {
        return res.status(400).json({ message: "El contenido de la respuesta es requerido" });
      }
      
      const [reply] = await db.insert(messageReplies).values({
        messageId,
        content,
        isAdmin: req.session.isAdmin || false,
        createdBy: req.session.userId,
      }).returning();
      
      const [message] = await db.select().from(messagesTable).where(eq(messagesTable.id, messageId)).limit(1);
      if (message?.email && req.session.isAdmin) {
        const ticketId = message.messageId || String(messageId);
        sendEmail({
          to: message.email,
          subject: `Nueva respuesta a tu consulta - Ticket #${ticketId}`,
          html: getMessageReplyTemplate(message.name?.split(' ')[0] || 'Cliente', content, ticketId)
        }).catch(() => {});
        
        if (message.userId) {
          await db.insert(userNotifications).values({
            userId: message.userId,
            title: "Nueva respuesta a tu consulta",
            message: `Hemos respondido a tu mensaje (Ticket: #${ticketId}). Revisa tu email o tu área de mensajes.`,
            type: 'info',
            isRead: false
          });
        }
      }
      
      res.json(reply);
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({ message: "Error al crear respuesta" });
    }
  });

  app.post("/api/contact/send-otp", async (req, res) => {
    try {
      const ip = getClientIp(req);
      const rateCheck = checkRateLimit('contact', ip);
      if (!rateCheck.allowed) {
        return res.status(429).json({ 
          message: `Demasiados intentos. Espera ${rateCheck.retryAfter} segundos.` 
        });
      }

      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await db.insert(contactOtps).values({
        email,
        otp,
        expiresAt,
      });

      await sendEmail({
        to: email,
        subject: "Tu código de verificación | Easy US LLC",
        html: getOtpEmailTemplate(otp, "Cliente"),
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Error sending contact OTP:", err);
      res.status(400).json({ message: "Error al enviar el código de verificación. Por favor, inténtalo de nuevo en unos minutos." });
    }
  });

  app.post("/api/contact/verify-otp", async (req, res) => {
    try {
      const { email, otp } = z.object({ email: z.string().email(), otp: z.string() }).parse(req.body);
      
      const [record] = await db.select()
        .from(contactOtps)
        .where(
          and(
            eq(contactOtps.email, email),
            eq(contactOtps.otp, otp),
            gt(contactOtps.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!record) {
        return res.status(400).json({ message: "El código ha expirado o no es correcto. Por favor, solicita uno nuevo." });
      }

      await db.update(contactOtps)
        .set({ verified: true })
        .where(eq(contactOtps.id, record.id));

      res.json({ success: true });
    } catch (err) {
      console.error("Error verifying contact OTP:", err);
      res.status(400).json({ message: "No se pudo verificar el código. Inténtalo de nuevo." });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = z.object({
        nombre: z.string(),
        apellido: z.string(),
        email: z.string().email(),
        telefono: z.string().optional(),
        subject: z.string(),
        mensaje: z.string(),
        otp: z.string(),
      }).parse(req.body);

      const sanitizedData = {
        nombre: sanitizeHtml(contactData.nombre),
        apellido: sanitizeHtml(contactData.apellido),
        subject: sanitizeHtml(contactData.subject),
        mensaje: sanitizeHtml(contactData.mensaje),
        telefono: contactData.telefono ? sanitizeHtml(contactData.telefono) : undefined,
      };

      const [otpRecord] = await db.select()
        .from(contactOtps)
        .where(
          and(
            eq(contactOtps.email, contactData.email),
            eq(contactOtps.otp, contactData.otp),
            eq(contactOtps.verified, true)
          )
        )
        .limit(1);

      if (!otpRecord) {
        return res.status(400).json({ message: "Verificación de email fallida. Por favor, verifica tu código OTP." });
      }

      const message = await storage.createMessage({
        name: `${sanitizedData.nombre} ${sanitizedData.apellido}`,
        email: contactData.email,
        phone: sanitizedData.telefono || null,
        subject: sanitizedData.subject,
        content: sanitizedData.mensaje,
        type: "contact"
      });

      const ticketId = message.messageId || String(message.id);
      sendEmail({
        to: contactData.email,
        subject: `Recibimos tu mensaje - Ticket #${ticketId}`,
        html: getAutoReplyTemplate(ticketId, sanitizedData.nombre),
      }).catch(() => {});

      logActivity("Nuevo Mensaje de Contacto Verificado", {
        "Nombre": `${sanitizedData.nombre} ${sanitizedData.apellido}`,
        "Email": contactData.email,
        "Teléfono": sanitizedData.telefono || "No proporcionado",
        "Asunto": sanitizedData.subject,
      });

      res.json({ success: true, ticketId });
    } catch (err) {
      console.error("Error processing contact form:", err);
      res.status(400).json({ message: "Error al procesar el formulario de contacto." });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      
      const [existing] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email)).limit(1);
      if (existing) {
        return res.json({ success: true, message: "Ya estás suscrito" });
      }
      
      await db.insert(newsletterSubscribers).values({ email });
      
      sendEmail({
        to: email,
        subject: "Bienvenido a Easy US LLC",
        html: getNewsletterWelcomeTemplate()
      }).catch(() => {});
      
      res.json({ success: true });
    } catch (err) {
      console.error("Error subscribing to newsletter:", err);
      res.status(400).json({ message: "Error al suscribirse" });
    }
  });

  app.post("/api/llc/send-otp", async (req, res) => {
    try {
      const ip = getClientIp(req);
      const rateCheck = checkRateLimit('llc_otp', ip);
      if (!rateCheck.allowed) {
        return res.status(429).json({ 
          message: `Demasiados intentos. Espera ${rateCheck.retryAfter} segundos.` 
        });
      }

      const { email, type } = z.object({ 
        email: z.string().email(),
        type: z.enum(['account_verification', 'contact']).optional()
      }).parse(req.body);
      
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await db.insert(contactOtps).values({
        email,
        otp,
        otpType: type || "account_verification",
        expiresAt,
      });

      await sendEmail({
        to: email,
        subject: "Tu código de verificación | Easy US LLC",
        html: getOtpEmailTemplate(otp, "Cliente"),
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Error sending LLC OTP:", err);
      res.status(400).json({ message: "Error al enviar el código de verificación." });
    }
  });

  app.post("/api/llc/verify-otp", async (req, res) => {
    try {
      const { email, otp } = z.object({ 
        email: z.string().email(), 
        otp: z.string() 
      }).parse(req.body);
      
      const [record] = await db.select()
        .from(contactOtps)
        .where(
          and(
            eq(contactOtps.email, email),
            eq(contactOtps.otp, otp),
            gt(contactOtps.expiresAt, new Date())
          )
        )
        .orderBy(desc(contactOtps.expiresAt))
        .limit(1);

      if (!record) {
        return res.status(400).json({ message: "El código ha expirado o no es correcto." });
      }

      await db.update(contactOtps)
        .set({ verified: true })
        .where(eq(contactOtps.id, record.id));

      res.json({ success: true });
    } catch (err) {
      console.error("Error verifying LLC OTP:", err);
      res.status(400).json({ message: "No se pudo verificar el código." });
    }
  });
}
