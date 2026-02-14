import type { Express, Response } from "express";
import { z } from "zod";
import { db, storage, isAuthenticated, logAudit, getClientIp, logActivity , asyncHandler } from "./shared";
import { createLogger } from "../lib/logger";

const log = createLogger('contact');
import { contactOtps, users as usersTable, newsletterSubscribers, userNotifications } from "@shared/schema";
import { and, eq, gt } from "drizzle-orm";
import { checkRateLimit, sanitizeHtml } from "../lib/security";
import { sendEmail, getOtpEmailTemplate, getNewsletterWelcomeTemplate, getAutoReplyTemplate } from "../lib/email";
import { EmailLanguage, getOtpSubject } from "../lib/email-translations";

export function registerContactRoutes(app: Express) {
  // Newsletter
  app.get("/api/newsletter/status", isAuthenticated, asyncHandler(async (req: any, res: Response) => {
    try {
      const isSubscribed = await storage.isSubscribedToNewsletter(req.session.email);
      res.json({ isSubscribed });
    } catch (err) {
      log.error("Error fetching newsletter status:", err);
      res.status(500).json({ message: "Error fetching newsletter status" });
    }
  }));

  app.post("/api/newsletter/unsubscribe", isAuthenticated, asyncHandler(async (req: any, res: Response) => {
    try {
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.email, req.session.email));
      res.json({ success: true });
    } catch (err) {
      log.error("Error unsubscribing from newsletter:", err);
      res.status(500).json({ message: "Error unsubscribing" });
    }
  }));

  // Newsletter Subscription
  app.post("/api/newsletter/subscribe", asyncHandler(async (req: any, res: Response) => {
    try {
      const ip = getClientIp(req);
      const rateCheck = await checkRateLimit('contact', ip);
      if (!rateCheck.allowed) {
        return res.status(429).json({ message: "Too many requests. Please try again later." });
      }

      const { email } = z.object({ email: z.string().email().optional() }).parse(req.body);
      
      // If no email provided, try to use authenticated user's email
      const targetEmail = email || req.session?.email || null;
      
      if (!targetEmail) {
        return res.status(400).json({ message: "Email is required" });
      }

      const isSubscribed = await storage.isSubscribedToNewsletter(targetEmail);
      if (isSubscribed) {
        // Silent success for already subscribed via dashboard toggle
        return res.json({ success: true, message: "Already subscribed" });
      }

      await storage.subscribeToNewsletter(targetEmail);

      await storage.createGuestVisitor({
        email: targetEmail,
        source: 'newsletter',
        ip: getClientIp(req),
        userAgent: req.headers['user-agent'] || null,
        language: req.headers['accept-language']?.split(',')[0] || null,
        page: req.headers['referer'] || null,
        referrer: null,
        metadata: null,
      }).catch((err) => log.debug("Non-critical operation failed", { error: err?.message }));

      // NOTIFICATION: Newsletter subscription (translated on frontend via i18n keys)
      const [user] = await db.select().from(usersTable).where(eq(usersTable.email, targetEmail)).limit(1);
      if (user) {
        await db.insert(userNotifications).values({
          userId: user.id,
          title: 'i18n:ntf.newsletterSubscribed.title',
          message: 'i18n:ntf.newsletterSubscribed.message',
          type: 'info',
          isRead: false
        });
      }
      
      const nlLang = ((user as any)?.preferredLanguage || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es') as EmailLanguage;
      const nlSubjects: Record<string, string> = {
        en: "Subscription confirmed - Exentax",
        ca: "Subscripció confirmada - Exentax",
        fr: "Abonnement confirmé - Exentax",
        de: "Abonnement bestätigt - Exentax",
        it: "Iscrizione confermata - Exentax",
        pt: "Subscrição confirmada - Exentax",
      };
      await sendEmail({
        to: targetEmail,
        subject: nlSubjects[nlLang] || "Confirmación de suscripción a Exentax",
        html: getNewsletterWelcomeTemplate(nlLang),
      }).catch((err) => log.warn("Failed to send email", { error: err?.message }));
      
      res.json({ success: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email" });
      }
      log.error("Error subscribing to newsletter", err);
      res.status(500).json({ message: "Error subscribing" });
    }
  }));


  // Contact form
  app.post("/api/contact/send-otp", asyncHandler(async (req: any, res: Response) => {
    try {
      const ip = getClientIp(req);
      const rateCheck = await checkRateLimit('contact', ip);
      if (!rateCheck.allowed) {
        return res.status(429).json({ 
          message: `Too many attempts. Wait ${rateCheck.retryAfter} seconds.` 
        });
      }

      const { email, name } = z.object({ email: z.string().email(), name: z.string().optional() }).parse(req.body);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      await db.insert(contactOtps).values({
        email,
        otp,
        expiresAt,
      });

      const cLang = (req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'es') as EmailLanguage;
      const supportedContactLangs: string[] = ['es', 'en', 'ca', 'fr', 'de', 'it', 'pt'];
      const contactLang = supportedContactLangs.includes(cLang) ? cLang : 'es' as EmailLanguage;
      await sendEmail({
        to: email,
        subject: getOtpSubject(contactLang),
        html: getOtpEmailTemplate(otp, name || undefined, contactLang),
      });

      res.json({ success: true });
    } catch (err) {
      log.error("Error sending contact OTP", err);
      res.status(400).json({ message: "Error sending verification code. Please try again in a few minutes." });
    }
  }));

  app.post("/api/contact/verify-otp", asyncHandler(async (req: any, res: Response) => {
    try {
      const ip = getClientIp(req);
      const rateCheck = await checkRateLimit('otp', ip);
      if (!rateCheck.allowed) {
        return res.status(429).json({ message: `Too many attempts. Wait ${rateCheck.retryAfter} seconds.` });
      }

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
        return res.status(400).json({ message: "The code has expired or is incorrect. Please request a new one." });
      }

      await db.update(contactOtps)
        .set({ verified: true })
        .where(eq(contactOtps.id, record.id));

      res.json({ success: true });
    } catch (err) {
      log.error("Error verifying contact OTP", err);
      res.status(400).json({ message: "Could not verify the code. Please try again." });
    }
  }));

}
