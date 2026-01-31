import type { Express } from "express";
import type { Server } from "http";
import { registerAdminRoutes } from "./admin-routes";
import { registerUserRoutes } from "./user-routes";
import { registerOrderRoutes } from "./order-routes";
import { registerContactRoutes } from "./contact-routes";

export async function registerAllRoutes(app: Express, httpServer: Server): Promise<void> {
  registerAdminRoutes(app);
  registerUserRoutes(app);
  registerOrderRoutes(app);
  registerContactRoutes(app);
}
