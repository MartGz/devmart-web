import "server-only";
import { createHash } from "node:crypto";
import { sql } from "drizzle-orm";
import { headers } from "next/headers";
import { db, hasDb, schema } from "./db";

/** IP del visitante convertida en huella (nunca se guarda en claro). */
export async function huellaCliente() {
  const h = await headers();
  const ip = h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocida";
  return createHash("sha256")
    .update(`${process.env.SESSION_SECRET ?? "dm"}:${ip}`)
    .digest("base64url")
    .slice(0, 22);
}

/**
 * Limita intentos por clave en una ventana de tiempo (contador atómico en Postgres, válido entre
 * instancias serverless). Devuelve true si la acción está permitida. Sin base de datos, no limita.
 */
export async function permitir(clave: string, max: number, ventanaSegundos: number): Promise<boolean> {
  if (!hasDb) return true;
  const t = schema.limites;
  const [row] = await db()
    .insert(t)
    .values({ clave, intentos: 1, reinicio: sql`now() + make_interval(secs => ${ventanaSegundos})` })
    .onConflictDoUpdate({
      target: t.clave,
      set: {
        intentos: sql`case when ${t.reinicio} < now() then 1 else ${t.intentos} + 1 end`,
        reinicio: sql`case when ${t.reinicio} < now() then now() + make_interval(secs => ${ventanaSegundos}) else ${t.reinicio} end`,
      },
    })
    .returning({ intentos: t.intentos });
  return (row?.intentos ?? 0) <= max;
}

/** Reinicia un contador (p. ej. tras un inicio de sesión correcto). */
export async function reiniciar(clave: string) {
  if (!hasDb) return;
  await db().delete(schema.limites).where(sql`${schema.limites.clave} = ${clave}`);
}

/** Registro de actividad del panel. */
export async function registrar(accion: string, detalle = "") {
  if (!hasDb) return;
  await db().insert(schema.actividad).values({ accion, detalle: detalle.slice(0, 500) });
}
