// Copia el contenido estático (src/lib/content.ts, src/lib/blog.ts y src/content/blog/*.md)
// a la base de datos. Es idempotente: no toca lo que ya existe.
// Uso: npm run db:seed
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { posts } from "../src/lib/blog";
import { precios, proyectos } from "../src/lib/content";
import * as schema from "../src/lib/db/schema";

loadEnvConfig(process.cwd());
const url = process.env.DATABASE_URL;
if (!url) throw new Error("Falta DATABASE_URL (ejecuta `vercel env pull .env.local`).");
const db = drizzle(neon(url), { schema });

async function main() {
  for (const p of posts) {
    const cuerpo = await readFile(join(process.cwd(), "src/content/blog", `${p.slug}.md`), "utf8");
    await db.insert(schema.posts).values({ ...p, cuerpo }).onConflictDoNothing({ target: schema.posts.slug });
  }
  for (const [orden, p] of proyectos.entries()) {
    await db
      .insert(schema.proyectos)
      .values({ ...p, url: p.url ?? null, urlLabel: p.urlLabel ?? null, orden })
      .onConflictDoNothing({ target: schema.proyectos.slug });
  }
  const existentes = await db.select({ id: schema.precios.id }).from(schema.precios).limit(1);
  if (existentes.length === 0) {
    await db.insert(schema.precios).values(precios.map((p, orden) => ({ ...p, orden })));
  }
  console.log(`Listo: ${posts.length} artículos, ${proyectos.length} proyectos y ${precios.length} precios revisados.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
