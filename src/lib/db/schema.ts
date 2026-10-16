import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const estadosMensaje = ["nuevo", "en_conversacion", "cerrado", "descartado"] as const;
export type EstadoMensaje = (typeof estadosMensaje)[number];

/** Mensajes del formulario de contacto. */
export const mensajes = pgTable(
  "mensajes",
  {
    id: serial("id").primaryKey(),
    nombre: text("nombre").notNull(),
    email: text("email").notNull(),
    telefono: text("telefono").notNull(),
    tipo: text("tipo").notNull(),
    presupuesto: text("presupuesto").notNull(),
    descripcion: text("descripcion").notNull(),
    estado: text("estado").$type<EstadoMensaje>().notNull().default("nuevo"),
    notas: text("notas").notNull().default(""),
    creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("mensajes_estado_idx").on(t.estado), index("mensajes_creado_idx").on(t.creado)],
);

/** Artículos del blog. El cuerpo es Markdown. */
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  titulo: text("titulo").notNull(),
  resumen: text("resumen").notNull(),
  categoria: text("categoria").notNull(),
  /** Fecha ISO (AAAA-MM-DD). */
  fecha: text("fecha").notNull(),
  lecturaMin: integer("lectura_min").notNull(),
  cuerpo: text("cuerpo").notNull(),
  publicado: boolean("publicado").notNull().default(true),
  actualizado: timestamp("actualizado", { withTimezone: true }).notNull().defaultNow(),
});

/** Casos de proyecto. */
export const proyectos = pgTable("proyectos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  cliente: text("cliente").notNull(),
  tipo: text("tipo").notNull(),
  resumen: text("resumen").notNull(),
  stack: jsonb("stack").$type<string[]>().notNull().default([]),
  url: text("url"),
  urlLabel: text("url_label"),
  reto: text("reto").notNull(),
  solucion: jsonb("solucion").$type<string[]>().notNull().default([]),
  resultado: text("resultado").notNull(),
  /** Captura en Vercel Blob; null = se muestra el placeholder. */
  imagen: text("imagen"),
  imagenAlt: text("imagen_alt").notNull().default(""),
  orden: integer("orden").notNull().default(0),
  publicado: boolean("publicado").notNull().default(true),
  actualizado: timestamp("actualizado", { withTimezone: true }).notNull().defaultNow(),
});

/** Tarjetas de la página de precios. */
export const precios = pgTable("precios", {
  id: serial("id").primaryKey(),
  tipo: text("tipo").notNull(),
  descripcion: text("descripcion").notNull(),
  incluye: jsonb("incluye").$type<string[]>().notNull().default([]),
  /** Rango orientativo; null = «A cotizar». */
  rango: text("rango"),
  tipoFormulario: text("tipo_formulario").notNull(),
  orden: integer("orden").notNull().default(0),
});

/** Contadores para limitar intentos (login, formulario). La clave nunca guarda la IP en claro. */
export const limites = pgTable("limites", {
  clave: text("clave").primaryKey(),
  intentos: integer("intentos").notNull(),
  reinicio: timestamp("reinicio", { withTimezone: true }).notNull(),
});

/** Registro de actividad del panel (inicios de sesión, cambios). */
export const actividad = pgTable(
  "actividad",
  {
    id: serial("id").primaryKey(),
    accion: text("accion").notNull(),
    detalle: text("detalle").notNull().default(""),
    creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("actividad_creado_idx").on(t.creado)],
);

/** Ajustes internos (p. ej. desde cuándo son válidas las sesiones del panel). */
export const ajustes = pgTable("ajustes", {
  clave: text("clave").primaryKey(),
  valor: text("valor").notNull(),
});
