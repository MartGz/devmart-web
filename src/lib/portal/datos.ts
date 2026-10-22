import "server-only";
import { and, asc, desc, eq } from "drizzle-orm";
import { requireCliente } from "@/lib/auth/cliente";
import { db, schema } from "@/lib/db";

// Lecturas del portal de clientes. Todo parte de requireCliente(): la obra activa sale siempre de
// las obras del cliente de la sesión, y el resto de lecturas reciben ese contexto (nunca un id suelto),
// así un cliente jamás puede ver datos de otro.

export type Obra = typeof schema.obras.$inferSelect;

export type ContextoPortal = {
  clienteId: number;
  cliente: { nombre: string; empresa: string };
  obras: Pick<Obra, "id" | "nombre">[];
  obra: Obra | null;
};

/** Cliente de la sesión, sus obras y la obra elegida (?obra=ID) o la más reciente. */
export async function contextoPortal(obraParam?: string | string[]): Promise<ContextoPortal> {
  const clienteId = await requireCliente();
  const [cliente] = await db()
    .select({ nombre: schema.clientes.nombre, empresa: schema.clientes.empresa })
    .from(schema.clientes)
    .where(eq(schema.clientes.id, clienteId))
    .limit(1);
  const obras = await db()
    .select()
    .from(schema.obras)
    .where(eq(schema.obras.clienteId, clienteId))
    .orderBy(desc(schema.obras.creado), desc(schema.obras.id));
  const pedido = Number(Array.isArray(obraParam) ? obraParam[0] : obraParam);
  const obra = obras.find((o) => o.id === pedido) ?? obras[0] ?? null;
  return {
    clienteId,
    cliente: cliente ?? { nombre: "", empresa: "" },
    obras: obras.map((o) => ({ id: o.id, nombre: o.nombre })),
    obra,
  };
}

export async function etapasDe(ctx: ContextoPortal) {
  if (!ctx.obra) return [];
  return db()
    .select()
    .from(schema.etapas)
    .where(eq(schema.etapas.obraId, ctx.obra.id))
    .orderBy(asc(schema.etapas.orden), asc(schema.etapas.id));
}

export async function entregablesDe(ctx: ContextoPortal) {
  if (!ctx.obra) return [];
  return db()
    .select()
    .from(schema.entregables)
    .where(eq(schema.entregables.obraId, ctx.obra.id))
    .orderBy(desc(schema.entregables.creado), desc(schema.entregables.id));
}

export async function pagosDe(ctx: ContextoPortal) {
  if (!ctx.obra) return [];
  return db()
    .select()
    .from(schema.pagos)
    .where(eq(schema.pagos.obraId, ctx.obra.id))
    .orderBy(asc(schema.pagos.id));
}

export async function solicitudesDe(ctx: ContextoPortal) {
  if (!ctx.obra) return [];
  return db()
    .select()
    .from(schema.solicitudes)
    .where(eq(schema.solicitudes.obraId, ctx.obra.id))
    .orderBy(desc(schema.solicitudes.numero));
}

/** Obra del cliente de la sesión (para acciones que reciben un obraId del formulario). */
export async function obraDelCliente(clienteId: number, obraId: number) {
  if (!Number.isInteger(obraId) || obraId <= 0) return null;
  const [obra] = await db()
    .select()
    .from(schema.obras)
    .where(and(eq(schema.obras.id, obraId), eq(schema.obras.clienteId, clienteId)))
    .limit(1);
  return obra ?? null;
}

/* Cálculos compartidos por las pantallas. */

/** Avance general: promedio del porcentaje de las etapas (las completadas cuentan 100). */
export function avanceGeneral(etapas: { estado: string; porcentaje: number }[]) {
  if (etapas.length === 0) return 0;
  const total = etapas.reduce((s, e) => s + (e.estado === "completada" ? 100 : Math.min(100, Math.max(0, e.porcentaje))), 0);
  return Math.round(total / etapas.length);
}

/** Días que faltan hasta una fecha AAAA-MM-DD, contados en hora de Colombia. */
export function diasHasta(fecha: string | null) {
  if (!fecha) return null;
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const ms = Date.parse(`${fecha}T00:00:00Z`) - Date.parse(`${hoy}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export const pesos = (n: number) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const fechaCorta = (fecha: string | Date | null) => {
  if (!fecha) return "";
  const d = typeof fecha === "string" ? new Date(`${fecha}T12:00:00Z`) : fecha;
  return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "America/Bogota" }).format(d);
};
