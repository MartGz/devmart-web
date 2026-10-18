import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { adminConfig, clavesCuenta } from "./config";

// Cambios de la cuenta del administrador guardados en `ajustes` (tienen prioridad sobre el entorno)
// y enlaces de un solo uso para crear o recuperar la contraseña por correo.

export const MINUTOS_ENLACE = 30;

const claves = () => clavesCuenta(adminConfig().email);

async function guardar(clave: string, valor: string) {
  await db()
    .insert(schema.ajustes)
    .values({ clave, valor })
    .onConflictDoUpdate({ target: schema.ajustes.clave, set: { valor } });
}

export async function guardarCredenciales({ passwordHash, totpSecret }: { passwordHash?: string; totpSecret?: string }) {
  if (passwordHash) await guardar(claves().passwordHash, passwordHash);
  if (totpSecret !== undefined) await guardar(claves().totpSecret, totpSecret);
}

const hashToken = (token: string) => createHash("sha256").update(token).digest();

/** Crea un enlace nuevo (anula el anterior). Solo se guarda la huella del token. */
export async function crearTokenRecuperacion() {
  const token = randomBytes(32).toString("base64url");
  const exp = Date.now() + MINUTOS_ENLACE * 60 * 1000;
  await guardar(claves().reset, JSON.stringify({ h: hashToken(token).toString("base64"), exp }));
  return token;
}

/** El token es el vigente y no ha caducado. */
export async function tokenValido(token: string) {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const [row] = await db().select().from(schema.ajustes).where(eq(schema.ajustes.clave, claves().reset)).limit(1);
  if (!row) return false;
  try {
    const { h, exp } = JSON.parse(row.valor) as { h: string; exp: number };
    const esperado = Buffer.from(h, "base64");
    const actual = hashToken(token);
    return exp > Date.now() && esperado.length === actual.length && timingSafeEqual(esperado, actual);
  } catch {
    return false;
  }
}

export async function anularTokenRecuperacion() {
  await db().delete(schema.ajustes).where(eq(schema.ajustes.clave, claves().reset));
}
