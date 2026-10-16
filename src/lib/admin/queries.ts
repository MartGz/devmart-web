import "server-only";
import { asc, count, desc, eq, inArray } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/dal";
import { AJUSTES } from "@/lib/data";
import { db, hasDb, schema } from "@/lib/db";
import type { EstadoMensaje } from "@/lib/db/schema";

// Lecturas del panel. Todas verifican la sesión antes de tocar la base de datos y no se cachean.

async function guard() {
  await requireAdmin();
  if (!hasDb) throw new Error("El panel necesita DATABASE_URL.");
  return db();
}

export async function resumen() {
  const d = await guard();
  const [[nuevos], [mensajes], [posts], [proyectos], recientes, actividad] = await Promise.all([
    d.select({ n: count() }).from(schema.mensajes).where(eq(schema.mensajes.estado, "nuevo")),
    d.select({ n: count() }).from(schema.mensajes),
    d.select({ n: count() }).from(schema.posts),
    d.select({ n: count() }).from(schema.proyectos),
    d.select().from(schema.mensajes).orderBy(desc(schema.mensajes.creado)).limit(5),
    d.select().from(schema.actividad).orderBy(desc(schema.actividad.creado)).limit(8),
  ]);
  return {
    nuevos: nuevos.n,
    mensajes: mensajes.n,
    posts: posts.n,
    proyectos: proyectos.n,
    recientes,
    actividad,
  };
}

export async function listarMensajes(estado?: EstadoMensaje) {
  const d = await guard();
  const q = d.select().from(schema.mensajes);
  return (estado ? q.where(eq(schema.mensajes.estado, estado)) : q).orderBy(desc(schema.mensajes.creado)).limit(500);
}

export async function obtenerMensaje(id: number) {
  const d = await guard();
  if (!Number.isInteger(id) || id <= 0) return null;
  const [row] = await d.select().from(schema.mensajes).where(eq(schema.mensajes.id, id)).limit(1);
  return row ?? null;
}

export async function listarPosts() {
  const d = await guard();
  return d
    .select({
      id: schema.posts.id,
      slug: schema.posts.slug,
      titulo: schema.posts.titulo,
      categoria: schema.posts.categoria,
      fecha: schema.posts.fecha,
      publicado: schema.posts.publicado,
    })
    .from(schema.posts)
    .orderBy(desc(schema.posts.fecha), desc(schema.posts.id));
}

export async function obtenerPost(id: number) {
  const d = await guard();
  if (!Number.isInteger(id) || id <= 0) return null;
  const [row] = await d.select().from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
  return row ?? null;
}

export async function listarProyectos() {
  const d = await guard();
  return d
    .select({
      id: schema.proyectos.id,
      slug: schema.proyectos.slug,
      cliente: schema.proyectos.cliente,
      tipo: schema.proyectos.tipo,
      orden: schema.proyectos.orden,
      publicado: schema.proyectos.publicado,
    })
    .from(schema.proyectos)
    .orderBy(asc(schema.proyectos.orden), asc(schema.proyectos.id));
}

export async function obtenerProyecto(id: number) {
  const d = await guard();
  if (!Number.isInteger(id) || id <= 0) return null;
  const [row] = await d.select().from(schema.proyectos).where(eq(schema.proyectos.id, id)).limit(1);
  return row ?? null;
}

export async function listarPrecios() {
  const d = await guard();
  return d.select().from(schema.precios).orderBy(asc(schema.precios.orden), asc(schema.precios.id));
}

export async function listarActividad() {
  const d = await guard();
  return d.select().from(schema.actividad).orderBy(desc(schema.actividad.creado)).limit(200);
}

export async function obtenerEquipo() {
  const d = await guard();
  const rows = await d
    .select()
    .from(schema.ajustes)
    .where(inArray(schema.ajustes.clave, [AJUSTES.fotoEquipo, AJUSTES.fotoEquipoAlt]));
  const valor = (clave: string) => rows.find((r) => r.clave === clave)?.valor ?? "";
  return { foto: valor(AJUSTES.fotoEquipo) || null, fotoAlt: valor(AJUSTES.fotoEquipoAlt) };
}
