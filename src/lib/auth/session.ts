import "server-only";
import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { db, hasDb, schema } from "@/lib/db";
import { adminConfig, credenciales } from "./config";
import { SESSION_COOKIE, SESSION_HOURS } from "./constants";

type SessionData = { admin: true; iat: number; exp: number; k: string };

// Por email del administrador, como las credenciales guardadas (ver clavesCuenta).
const minIatClave = () => `sesion_min_iat:${adminConfig().email}`;

/** Sesiones emitidas antes de esta marca (ms) ya no valen: se actualiza al cerrar sesión. */
async function minIat(): Promise<number> {
  if (!hasDb) return 0;
  const [row] = await db().select().from(schema.ajustes).where(eq(schema.ajustes.clave, minIatClave())).limit(1);
  return Number(row?.valor ?? 0);
}

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

/**
 * Huella de la contraseña actual: si cambia la contraseña (o SESSION_SECRET), todas las
 * sesiones abiertas dejan de valer.
 */
function huella(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("base64url").slice(0, 16);
}

export async function createSession() {
  const { passwordHash, sessionSecret } = await credenciales();
  const ttl = SESSION_HOURS * 60 * 60;
  const now = Date.now();
  const data: SessionData = { admin: true, iat: now, exp: now + ttl * 1000, k: huella(passwordHash) };
  const sealed = await sealData(data, { password: sessionSecret, ttl });
  (await cookies()).set(SESSION_COOKIE, sealed, { ...cookieOptions, maxAge: ttl });
}

export async function readSession(): Promise<boolean> {
  // La validez depende de la hora actual: siempre en tiempo de petición, nunca prerenderizado.
  await connection();
  if (!adminConfig().sessionSecret) return false;
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return false;
  const cfg = await credenciales();
  if (!cfg.ready) return false;
  try {
    const data = await unsealData<Partial<SessionData>>(raw, { password: cfg.sessionSecret });
    if (data.admin !== true || typeof data.exp !== "number" || typeof data.iat !== "number") return false;
    if (data.exp <= Date.now() || data.k !== huella(cfg.passwordHash)) return false;
    return data.iat >= (await minIat());
  } catch {
    return false;
  }
}

/**
 * Cierra la sesión en este navegador y revoca todas las demás (un solo administrador).
 * La cookie se borra con las mismas opciones con que se creó: __Host- exige Secure y path=/.
 */
export async function destroySession() {
  await revocarSesiones();
  (await cookies()).set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

/** Invalida todas las sesiones emitidas hasta ahora (p. ej. al recuperar la contraseña). */
export async function revocarSesiones() {
  if (!hasDb) return;
  const ahora = String(Date.now());
  await db()
    .insert(schema.ajustes)
    .values({ clave: minIatClave(), valor: ahora })
    .onConflictDoUpdate({ target: schema.ajustes.clave, set: { valor: ahora } });
}
