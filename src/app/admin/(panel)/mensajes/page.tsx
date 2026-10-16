import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EstadoBadge, estadoLabel } from "@/components/admin/EstadoBadge";
import { AdminHeader, Cargando, fechaHora, Panel } from "@/components/admin/fields";
import { listarMensajes } from "@/lib/admin/queries";
import { estadosMensaje, type EstadoMensaje } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Mensajes" };

export default function MensajesPage({ searchParams }: PageProps<"/admin/mensajes">) {
  return (
    <>
      <AdminHeader title="Mensajes" intro="Lo que llega desde el formulario de contacto." />
      <Suspense fallback={<Cargando />}>
        <Lista searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Lista({ searchParams }: Pick<PageProps<"/admin/mensajes">, "searchParams">) {
  const { estado: raw } = await searchParams;
  const estado = (estadosMensaje as readonly string[]).includes(String(raw)) ? (raw as EstadoMensaje) : undefined;
  const mensajes = await listarMensajes(estado);
  const filtro = "rounded-full px-4 py-2 text-[14px] font-medium transition-colors";

  return (
    <>
      <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
        <Link href="/admin/mensajes" className={`${filtro} ${!estado ? "bg-noche text-blanco" : "bg-blanco text-pizarra hover:text-noche"}`}>
          Todos
        </Link>
        {estadosMensaje.map((e) => (
          <Link
            key={e}
            href={`/admin/mensajes?estado=${e}`}
            className={`${filtro} ${estado === e ? "bg-noche text-blanco" : "bg-blanco text-pizarra hover:text-noche"}`}
          >
            {estadoLabel[e]}
          </Link>
        ))}
      </nav>

      <Panel className="p-0! md:p-0!">
        {mensajes.length === 0 ? (
          <p className="p-8 text-[15px] text-pizarra">No hay mensajes {estado ? "con este estado" : "todavía"}.</p>
        ) : (
          <ul className="divide-y divide-borde">
            {mensajes.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/admin/mensajes/${m.id}`}
                  className="grid gap-2 px-6 py-5 transition-colors hover:bg-nube/60 md:grid-cols-[1fr_auto] md:items-center md:gap-6 md:px-8"
                >
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="flex items-center gap-3">
                      <span className={`truncate ${m.estado === "nuevo" ? "font-semibold" : "font-medium"}`}>{m.nombre}</span>
                      <span className="truncate text-[14px] text-pizarra">{m.email}</span>
                    </span>
                    <span className="line-clamp-1 text-[14px] text-pizarra">
                      <span className="text-noche">{m.tipo}</span> · {m.descripcion}
                    </span>
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="font-mono text-xs text-pizarra">{fechaHora(m.creado)}</span>
                    <EstadoBadge estado={m.estado} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
