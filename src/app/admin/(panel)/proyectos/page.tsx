import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { AdminHeader, Cargando, Panel } from "@/components/admin/fields";
import { listarProyectos } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Proyectos" };

export default function ProyectosAdminPage() {
  return (
    <>
      <AdminHeader title="Proyectos" intro="Los casos que aparecen en Inicio y en Proyectos.">
        <Link href="/admin/proyectos/nuevo" className="btn-primary px-5! py-3!">
          <Plus size={18} strokeWidth={1.5} aria-hidden /> Nuevo proyecto
        </Link>
      </AdminHeader>
      <Suspense fallback={<Cargando />}>
        <Lista />
      </Suspense>
    </>
  );
}

async function Lista() {
  const proyectos = await listarProyectos();
  return (
    <Panel className="p-0! md:p-0!">
      {proyectos.length === 0 ? (
        <p className="p-8 text-[15px] text-pizarra">Todavía no hay proyectos.</p>
      ) : (
        <ul className="divide-y divide-borde">
          {proyectos.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-5 md:px-8">
              <Link href={`/admin/proyectos/${p.id}`} className="flex min-w-0 flex-col gap-1 hover:text-cielo-profundo">
                <span className="font-medium">{p.cliente}</span>
                <span className="font-mono text-xs text-pizarra">
                  {p.tipo} · orden {p.orden}
                  {!p.publicado && " · oculto"}
                </span>
              </Link>
              {p.publicado && (
                <a
                  href={`/proyectos/${p.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Ver «${p.cliente}» en el sitio`}
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
