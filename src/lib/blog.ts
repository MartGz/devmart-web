// Índice del blog. El cuerpo de cada artículo vive en src/content/blog/<slug>.mdx.

export type Post = {
  slug: string;
  titulo: string;
  resumen: string;
  categoria: string;
  /** Fecha ISO (AAAA-MM-DD). */
  fecha: string;
  lecturaMin: number;
};

export const posts: Post[] = [
  {
    slug: "por-que-empezamos-con-un-prototipo",
    titulo: "Por qué empezamos cada proyecto con un prototipo navegable",
    resumen:
      "Ver y probar tu producto antes de programarlo ahorra tiempo, dinero y malentendidos. Así lo hacemos.",
    categoria: "Proceso",
    fecha: "2026-10-14",
    lecturaMin: 4,
  },
  {
    slug: "que-necesitas-para-vender-en-linea",
    titulo: "Qué necesitas para empezar a vender en línea en Colombia",
    resumen:
      "Catálogo, pagos, envíos y un panel para administrarlo: la lista corta antes de lanzar tu tienda.",
    categoria: "Tiendas en línea",
    fecha: "2026-10-07",
    lecturaMin: 5,
  },
];

export const sortedPosts = [...posts].sort((a, b) => b.fecha.localeCompare(a.fecha));

export function formatFecha(iso: string) {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}
