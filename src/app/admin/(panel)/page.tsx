import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { describirAccion, esAlerta } from "@/components/admin/actividad";
import { EstadoBadge } from "@/components/admin/EstadoBadge";
import { AdminHeader, Cargando, fechaHora, Panel } from "@/components/admin/fields";
import { resumen } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Resumen" };

export default function ResumenPage() {
  return (
    <>
      <AdminHeader title="Resumen" intro="Lo nuevo en el sitio de un vistazo." />
      <Suspense fallback={<Cargando />}>
        <Contenido />
      </Suspense>
    </>
  );
}

async function Contenido() {
  const r = await resumen();
  const stats = [
    { label: "Mensajes nuevos", value: r.nuevos, href: "/admin/mensajes?estado=nuevo", destacado: r.nuevos > 0 },
    { label: "Mensajes en total", value: r.mensajes, href: "/admin/mensajes" },
    { label: "Artículos", value: r.posts, href: "/admin/blog" },
    { label: "Proyectos", value: r.proyectos, href: "/admin/proyectos" },
  ];
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`flex flex-col gap-2 rounded-card p-6 transition-shadow hover:shadow-elevada ${s.destacado ? "bg-noche text-nube" : "bg-blanco"}`}
          >
            <span className={`font-mono text-xs ${s.destacado ? "text-cielo" : "text-pizarra"}`}>{s.label}</span>
            <span className="font-display text-[40px] leading-none font-bold tracking-[-0.045em]">{s.value}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="h3-dm">Últimos mensajes</h2>
            <Link href="/admin/mensajes" className="inline-flex items-center gap-1 text-[14px] text-cielo-profundo hover:text-noche">
              Ver todos <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
          {r.recientes.length === 0 ? (
            <p className="text-[15px] text-pizarra">Todavía no llegan mensajes del formulario.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-borde">
              {r.recientes.map((m) => (
                <li key={m.id}>
                  <Link href={`/admin/mensajes/${m.id}`} className="flex items-center justify-between gap-4 py-3.5 hover:text-cielo-profundo">
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{m.nombre}</span>
                      <span className="truncate text-[14px] text-pizarra">
                        {m.tipo} · {fechaHora(m.creado)}
                      </span>
                    </span>
                    <EstadoBadge estado={m.estado} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="h3-dm">Actividad</h2>
            <Link href="/admin/actividad" className="inline-flex items-center gap-1 text-[14px] text-cielo-profundo hover:text-noche">
              Ver todo <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
          <ul className="flex flex-col gap-3">
            {r.actividad.map((a) => (
              <li key={a.id} className="flex flex-col text-[14px]">
                <span className={esAlerta(a.accion) ? "font-medium text-[#9A3412]" : "text-noche"}>{describirAccion(a.accion)}</span>
                <span className="text-pizarra">{fechaHora(a.creado)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
