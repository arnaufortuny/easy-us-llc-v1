import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Optimized connection string processing with simplified pool
let connectionString = process.env.DATABASE_URL!;
if (!connectionString.includes("sslmode=")) {
  connectionString += (connectionString.includes("?") ? "&" : "?") + "sslmode=require";
}

export const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 1000, // 1 second timeout to fail immediately if blocked
  idleTimeoutMillis: 5000,
  max: 5, // Minimum pool size for speed
});
export const db = drizzle(pool, { schema });
