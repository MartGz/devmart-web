import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { AdminHeader, Cargando, Panel } from "@/components/admin/fields";
import { listarPosts } from "@/lib/admin/queries";
import { formatFecha } from "@/lib/blog";

export const metadata: Metadata = { title: "Blog" };

export default function BlogAdminPage() {
  return (
    <>
      <AdminHeader title="Blog" intro="Los cambios se publican en el sitio al guardar.">
        <Link href="/admin/blog/nuevo" className="btn-primary px-5! py-3!">
          <Plus size={18} strokeWidth={1.5} aria-hidden /> Nuevo artículo
        </Link>
      </AdminHeader>
      <Suspense fallback={<Cargando />}>
        <Lista />
      </Suspense>
    </>
  );
}

async function Lista() {
  const posts = await listarPosts();
  return (
    <Panel className="p-0! md:p-0!">
      {posts.length === 0 ? (
        <p className="p-8 text-[15px] text-pizarra">Todavía no hay artículos.</p>
      ) : (
        <ul className="divide-y divide-borde">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-5 md:px-8">
              <Link href={`/admin/blog/${p.id}`} className="flex min-w-0 flex-col gap-1 hover:text-cielo-profundo">
                <span className="font-medium">{p.titulo}</span>
                <span className="font-mono text-xs text-pizarra">
                  {p.categoria} · {formatFecha(p.fecha)}
                  {!p.publicado && " · borrador"}
                </span>
              </Link>
              {p.publicado && (
                <a
                  href={`/blog/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver «${p.titulo}» en el sitio`}
                  className="shrink-0 text-pizarra hover:text-noche"
                >
                  <ExternalLink size={18} strokeWidth={1.5} aria-hidden />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
