import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/** Hay base de datos configurada (Neon, desde la integración de Vercel). */
export const hasDb = Boolean(process.env.DATABASE_URL);

let instance: NeonHttpDatabase<typeof schema> | undefined;

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("Falta DATABASE_URL.");
  instance ??= drizzle(neon(process.env.DATABASE_URL), { schema });
  return instance;
}

export { schema };
