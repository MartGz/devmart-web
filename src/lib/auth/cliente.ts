import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { sealData, unsealData } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { db, hasDb, schema } from "@/lib/db";
import { CLIENTE_COOKIE, CLIENTE_SESION_DIAS } from "./constants";

// Acceso de clientes al portal: enlace mágico de un solo uso y sesión en su propia cookie.
// La sesión del panel (/admin) y la del portal no se pueden intercambiar: usan cookies distintas,
// claves de sellado distintas y datos con forma distinta.

type SesionCliente = { clienteId: number; iat: number; exp: number };

export const MINUTOS_ENLACE_CLIENTE = 15;

/** Clave de sellado propia del portal, derivada de SESSION_SECRET (no sirve para abrir la del panel). */
function claveSellado() {
  const base = process.env.SESSION_SECRET ?? "";
  if (base.length < 32) throw new Error("Falta SESSION_SECRET (mínimo 32 caracteres).");
  return createHash("sha256").update(`portal-clientes:${base}`).digest("hex");
}

const opcionesCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

const huellaToken = (token: string) => createHash("sha256").update(token).digest("base64url");

/** Crea un enlace de acceso (15 min, un solo uso) y devuelve el token en claro para el correo. */
export async function crearAccesoCliente(clienteId: number) {
  const token = randomBytes(32).toString("base64url");
  await db()
    .insert(schema.accesosCliente)
    .values({ clienteId, hash: huellaToken(token), expira: new Date(Date.now() + MINUTOS_ENLACE_CLIENTE * 60_000) });
  return token;
}

/** Marca el enlace como usado (de forma atómica) y devuelve el cliente si sigue activo. */
export async function consumirAccesoCliente(token: string): Promise<number | null> {
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const t = schema.accesosCliente;
  const [acceso] = await db()
    .update(t)
    .set({ usado: new Date() })
    .where(and(eq(t.hash, huellaToken(token)), isNull(t.usado), gt(t.expira, new Date())))
    .returning({ clienteId: t.clienteId });
  if (!acceso) return null;
  const [cliente] = await db()
    .select({ id: schema.clientes.id })
    .from(schema.clientes)
    .where(and(eq(schema.clientes.id, acceso.clienteId), eq(schema.clientes.activo, true)))
    .limit(1);
  return cliente?.id ?? null;
}

/** El enlace existe, no se ha usado y no ha caducado (para mostrar la pantalla de entrada). */
export async function accesoVigente(token: string) {
  await connection();
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return false;
  const t = schema.accesosCliente;
  const [fila] = await db()
    .select({ id: t.id })
    .from(t)
    .where(and(eq(t.hash, huellaToken(token)), isNull(t.usado), gt(t.expira, new Date())))
    .limit(1);
  return Boolean(fila);
}

export async function crearSesionCliente(clienteId: number) {
  const ttl = CLIENTE_SESION_DIAS * 24 * 60 * 60;
  const ahora = Date.now();
  const data: SesionCliente = { clienteId, iat: ahora, exp: ahora + ttl * 1000 };
  const sellada = await sealData(data, { password: claveSellado(), ttl });
  (await cookies()).set(CLIENTE_COOKIE, sellada, { ...opcionesCookie, maxAge: ttl });
}

export async function cerrarSesionCliente() {
  (await cookies()).set(CLIENTE_COOKIE, "", { ...opcionesCookie, maxAge: 0 });
}

/** clienteId de la sesión, solo si la cookie es válida, no ha caducado y el cliente sigue activo. */
export async function leerSesionCliente(): Promise<number | null> {
  await connection();
  if (!hasDb) return null;
  const raw = (await cookies()).get(CLIENTE_COOKIE)?.value;
  if (!raw) return null;
  try {
    const data = await unsealData<Partial<SesionCliente>>(raw, { password: claveSellado() });
    if (typeof data.clienteId !== "number" || typeof data.exp !== "number" || data.exp <= Date.now()) return null;
    const [cliente] = await db()
      .select({ id: schema.clientes.id })
      .from(schema.clientes)
      .where(and(eq(schema.clientes.id, data.clienteId), eq(schema.clientes.activo, true)))
      .limit(1);
    return cliente?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * Capa de acceso del portal: cada página y acción la llama y filtra TODO por el clienteId que
 * devuelve. Sin sesión válida, lleva a la pantalla de ingreso.
 */
export async function requireCliente(): Promise<number> {
  const clienteId = await leerSesionCliente();
  if (!clienteId) redirect("/portal/ingreso");
  return clienteId;
}
