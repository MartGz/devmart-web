"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/dal";
import { destroySession } from "@/lib/auth/session";
import { tiposProyecto } from "@/lib/content";
import { TAGS } from "@/lib/data";
import { db, schema } from "@/lib/db";
import { estadosMensaje } from "@/lib/db/schema";
import { registrar } from "@/lib/security";

// Acciones del panel. Cada una vuelve a verificar la sesión (no se confía en el cliente),
// valida la entrada con zod y registra el cambio en la actividad.

export type FormState = { ok?: boolean; message?: string; errors?: string[] };

const texto = (min: number, max: number, campo: string) =>
  z
    .string()
    .trim()
    .min(min, `${campo}: escribe al menos ${min} caracteres.`)
    .max(max, `${campo}: máximo ${max} caracteres.`);
const lista = z
  .string()
  .default("")
  .transform((s) =>
    s
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean)
      .slice(0, 30),
  );
const slugSchema = z
  .string()
  .trim()
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, "Slug: usa minúsculas, números y guiones.");
const urlOpcional = z
  .string()
  .trim()
  .max(300)
  .refine((s) => s === "" || /^https?:\/\/\S+$/.test(s), "URL: debe empezar por https://")
  .transform((s) => s || null);

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function campos(fd: FormData) {
  return Object.fromEntries([...fd.entries()].filter(([, v]) => typeof v === "string")) as Record<string, string>;
}

function errores(e: z.ZodError): FormState {
  return { ok: false, errors: e.issues.map((i) => i.message) };
}

function idDe(fd: FormData) {
  const n = Number(fd.get("id"));
  return Number.isInteger(n) && n > 0 ? n : null;
}

function esDuplicado(err: unknown) {
  return String((err as { cause?: { code?: string } })?.cause?.code ?? (err as { code?: string })?.code) === "23505";
}

/* ───────────── Sesión ───────────── */

export async function cerrarSesion() {
  await requireAdmin();
  await destroySession();
  await registrar("logout");
  redirect("/admin/login");
}

/* ───────────── Mensajes ───────────── */

const mensajeSchema = z.object({
  estado: z.enum(estadosMensaje),
  notas: z.string().max(5000).default(""),
});

export async function actualizarMensaje(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idDe(fd);
  const parsed = mensajeSchema.safeParse(campos(fd));
  if (!id) return { ok: false, message: "Mensaje no válido." };
  if (!parsed.success) return errores(parsed.error);
  await db().update(schema.mensajes).set(parsed.data).where(eq(schema.mensajes.id, id));
  await registrar("mensaje.actualizado", `#${id} → ${parsed.data.estado}`);
  return { ok: true, message: "Guardado." };
}

export async function eliminarMensaje(fd: FormData) {
  await requireAdmin();
  const id = idDe(fd);
  if (id) {
    await db().delete(schema.mensajes).where(eq(schema.mensajes.id, id));
    await registrar("mensaje.eliminado", `#${id}`);
  }
  redirect("/admin/mensajes");
}

/* ───────────── Blog ───────────── */

const postSchema = z.object({
  titulo: texto(5, 160, "Título"),
  slug: slugSchema,
  resumen: texto(10, 300, "Resumen"),
  categoria: texto(2, 40, "Categoría"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha: usa el formato AAAA-MM-DD."),
  lecturaMin: z.string().default(""),
  cuerpo: texto(50, 60000, "Contenido"),
  publicado: z.string().optional(),
});

export async function guardarPost(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idDe(fd);
  const parsed = postSchema.safeParse(campos(fd));
  if (!parsed.success) return errores(parsed.error);
  const v = parsed.data;
  const palabras = v.cuerpo.split(/\s+/).length;
  const valores = {
    titulo: v.titulo,
    slug: v.slug || slugify(v.titulo),
    resumen: v.resumen,
    categoria: v.categoria,
    fecha: v.fecha,
    lecturaMin: Number(v.lecturaMin) > 0 ? Math.min(Number(v.lecturaMin), 120) : Math.max(1, Math.round(palabras / 200)),
    cuerpo: v.cuerpo,
    publicado: v.publicado === "on",
    actualizado: new Date(),
  };
  try {
    if (id) {
      await db().update(schema.posts).set(valores).where(eq(schema.posts.id, id));
    } else {
      await db().insert(schema.posts).values(valores);
    }
  } catch (err) {
    if (esDuplicado(err)) return { ok: false, errors: ["Ya existe un artículo con ese slug."] };
    throw err;
  }
  updateTag(TAGS.posts);
  await registrar(id ? "post.editado" : "post.creado", valores.slug);
  if (!id) redirect("/admin/blog");
  return { ok: true, message: "Artículo guardado y publicado en el sitio." };
}

export async function eliminarPost(fd: FormData) {
  await requireAdmin();
  const id = idDe(fd);
  if (id) {
    await db().delete(schema.posts).where(eq(schema.posts.id, id));
    updateTag(TAGS.posts);
    await registrar("post.eliminado", `#${id}`);
  }
  redirect("/admin/blog");
}

/* ───────────── Proyectos ───────────── */

const proyectoSchema = z.object({
  cliente: texto(2, 120, "Cliente"),
  slug: slugSchema,
  tipo: texto(2, 60, "Tipo"),
  resumen: texto(10, 300, "Resumen"),
  stack: lista,
  url: urlOpcional,
  urlLabel: z.string().trim().max(40).transform((s) => s || null),
  reto: texto(10, 3000, "El reto"),
  solucion: lista,
  resultado: texto(10, 3000, "El resultado"),
  orden: z.coerce.number().int().min(0).max(999).default(0),
  publicado: z.string().optional(),
});

export async function guardarProyecto(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idDe(fd);
  const parsed = proyectoSchema.safeParse(campos(fd));
  if (!parsed.success) return errores(parsed.error);
  const v = parsed.data;
  const valores = { ...v, slug: v.slug || slugify(v.cliente), publicado: v.publicado === "on", actualizado: new Date() };
  try {
    if (id) {
      await db().update(schema.proyectos).set(valores).where(eq(schema.proyectos.id, id));
    } else {
      await db().insert(schema.proyectos).values(valores);
    }
  } catch (err) {
    if (esDuplicado(err)) return { ok: false, errors: ["Ya existe un proyecto con ese slug."] };
    throw err;
  }
  updateTag(TAGS.proyectos);
  await registrar(id ? "proyecto.editado" : "proyecto.creado", valores.slug);
  if (!id) redirect("/admin/proyectos");
  return { ok: true, message: "Proyecto guardado y publicado en el sitio." };
}

export async function eliminarProyecto(fd: FormData) {
  await requireAdmin();
  const id = idDe(fd);
  if (id) {
    await db().delete(schema.proyectos).where(eq(schema.proyectos.id, id));
    updateTag(TAGS.proyectos);
    await registrar("proyecto.eliminado", `#${id}`);
  }
  redirect("/admin/proyectos");
}

/* ───────────── Precios ───────────── */

const precioSchema = z.object({
  tipo: texto(2, 60, "Nombre"),
  descripcion: texto(5, 300, "Descripción"),
  incluye: lista,
  rango: z.string().trim().max(60).transform((s) => s || null),
  tipoFormulario: z.enum(tiposProyecto, "Elige el tipo de proyecto del formulario."),
  orden: z.coerce.number().int().min(0).max(999).default(0),
});

export async function guardarPrecio(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = idDe(fd);
  const parsed = precioSchema.safeParse(campos(fd));
  if (!parsed.success) return errores(parsed.error);
  if (id) {
    await db().update(schema.precios).set(parsed.data).where(eq(schema.precios.id, id));
  } else {
    await db().insert(schema.precios).values(parsed.data);
  }
  updateTag(TAGS.precios);
  await registrar(id ? "precio.editado" : "precio.creado", parsed.data.tipo);
  return { ok: true, message: id ? "Precio guardado." : "Precio creado." };
}

export async function eliminarPrecio(fd: FormData) {
  await requireAdmin();
  const id = idDe(fd);
  if (id) {
    await db().delete(schema.precios).where(eq(schema.precios.id, id));
    updateTag(TAGS.precios);
    await registrar("precio.eliminado", `#${id}`);
  }
  redirect("/admin/precios");
}
