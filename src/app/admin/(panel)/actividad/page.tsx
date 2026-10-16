import type { Metadata } from "next";
import { Suspense } from "react";
import { describirAccion, esAlerta } from "@/components/admin/actividad";
import { AdminHeader, Cargando, fechaHora, Panel } from "@/components/admin/fields";
import { listarActividad } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Actividad" };


export default function ActividadPage() {
  return (
    <>
      <AdminHeader
        title="Actividad"
        intro="Inicios de sesión y cambios en el panel (últimos 200). Si ves accesos que no reconoces, cambia la contraseña con npm run admin:setup."
      />
      <Suspense fallback={<Cargando />}>
        <Lista />
      </Suspense>
    </>
  );
}

async function Lista() {
  const filas = await listarActividad();
  return (
    <Panel className="p-0! md:p-0!">
      {filas.length === 0 ? (
        <p className="p-8 text-[15px] text-pizarra">Sin actividad registrada.</p>
      ) : (
        <ul className="divide-y divide-borde">
          {filas.map((a) => {
            const alerta = esAlerta(a.accion);
            return (
              <li key={a.id} className="grid gap-1 px-6 py-4 sm:grid-cols-[200px_1fr_auto] sm:items-center sm:gap-6 md:px-8">
                <span className="font-mono text-xs text-pizarra">{fechaHora(a.creado)}</span>
                <span className={alerta ? "font-medium text-[#9A3412]" : "text-noche"}>
                  {describirAccion(a.accion)}
                  {a.detalle && !a.accion.startsWith("login") && a.accion !== "logout" && (
                    <span className="text-pizarra"> · {a.detalle}</span>
                  )}
                </span>
                {a.accion.startsWith("login") && (
                  <span className="font-mono text-[11px] text-niebla" title="Huella anónima de la conexión">
                    {a.detalle.slice(0, 8)}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
