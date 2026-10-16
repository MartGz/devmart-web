import type { EstadoMensaje } from "@/lib/db/schema";

export const estadoLabel: Record<EstadoMensaje, string> = {
  nuevo: "Nuevo",
  en_conversacion: "En conversación",
  cerrado: "Cerrado",
  descartado: "Descartado",
};

const estilos: Record<EstadoMensaje, string> = {
  nuevo: "bg-cielo text-noche",
  en_conversacion: "bg-cielo-tinte text-cielo-profundo",
  cerrado: "bg-nube text-pizarra",
  descartado: "bg-nube text-niebla",
};

export function EstadoBadge({ estado }: { estado: EstadoMensaje }) {
  return (
    <span className={`shrink-0 rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.08em] uppercase ${estilos[estado]}`}>
      {estadoLabel[estado]}
    </span>
  );
}
