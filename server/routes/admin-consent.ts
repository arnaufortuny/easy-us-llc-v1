import type { Express, Response } from "express";
import { z } from "zod";
import { db, isAdmin, asyncHandler, getClientIp, logAudit } from "./shared";
import { createLogger } from "../lib/logger";
import { userConsentRecords, users as usersTable } from "@shared/schema";
import { eq, desc, and, gte, lte, sql, ilike } from "drizzle-orm";

const log = createLogger('admin-consent');

export function registerAdminConsentRoutes(app: Express) {
  app.get("/api/admin/consent-records", isAdmin, asyncHandler(async (req: any, res: Response) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 25));
      const offset = (page - 1) * limit;

      const conditions: any[] = [];

      if (req.query.consentType) {
        conditions.push(eq(userConsentRecords.consentType, req.query.consentType as string));
      }
      if (req.query.userId) {
        conditions.push(eq(userConsentRecords.userId, req.query.userId as string));
      }
      if (req.query.email) {
        conditions.push(ilike(userConsentRecords.email, `%${req.query.email}%`));
      }
      if (req.query.from) {
        conditions.push(gte(userConsentRecords.createdAt, new Date(req.query.from as string)));
      }
      if (req.query.to) {
        conditions.push(lte(userConsentRecords.createdAt, new Date(req.query.to as string)));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const [records, countResult] = await Promise.all([
        db.select()
          .from(userConsentRecords)
          .where(where)
          .orderBy(desc(userConsentRecords.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: sql<number>`count(*)::int` })
          .from(userConsentRecords)
          .where(where),
      ]);

      res.json({
        records,
        total: countResult[0]?.count || 0,
        page,
        limit,
      });
    } catch (error) {
      log.error("Error fetching consent records", error);
      res.status(500).json({ message: "Error fetching consent records" });
    }
  }));

  app.post("/api/consent/accept", asyncHandler(async (req: any, res: Response) => {
    try {
      const schema = z.object({
        consentType: z.string().min(1),
        version: z.string().min(1),
        email: z.string().email().optional(),
        fullName: z.string().optional(),
      });

      const data = schema.parse(req.body);

      const ip = getClientIp(req);
      const userAgent = req.headers["user-agent"] || null;

      let userId: string | null = null;
      let email = data.email || null;
      let fullName = data.fullName || null;

      if (req.session?.userId) {
        userId = req.session.userId;
        const [user] = await db.select({
          email: usersTable.email,
          firstName: usersTable.firstName,
          lastName: usersTable.lastName,
        }).from(usersTable).where(eq(usersTable.id, userId!));

        if (user) {
          email = email || user.email;
          fullName = fullName || [user.firstName, user.lastName].filter(Boolean).join(" ") || null;
        }
      }

      const [record] = await db.insert(userConsentRecords).values({
        userId,
        email,
        fullName,
        ip,
        userAgent,
        consentType: data.consentType,
        version: data.version,
        accepted: true,
      }).returning();

      logAudit({
        action: 'consent_accepted',
        userId: userId || undefined,
        ip,
        userAgent,
        details: { consentType: data.consentType, version: data.version, email },
      });

      res.json({ success: true, id: record.id });
    } catch (error: any) {
      if (error?.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      log.error("Error recording consent", error);
      res.status(500).json({ message: "Error recording consent" });
    }
  }));
}
