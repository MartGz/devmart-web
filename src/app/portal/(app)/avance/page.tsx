import type { Metadata } from "next";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { BarraProgreso, CabeceraPortal, CargandoPortal, Chip, SinObra, Tarjeta } from "@/components/portal/ui";
import { avanceGeneral, contextoPortal, etapasDe, fechaCorta } from "@/lib/portal/datos";

export const metadata: Metadata = { title: "Avance" };

export default function AvancePage({ searchParams }: PageProps<"/portal/avance">) {
  return (
    <Suspense fallback={<CargandoPortal />}>
      <Avance searchParams={searchParams} />
    </Suspense>
  );
}

async function Avance({ searchParams }: Pick<PageProps<"/portal/avance">, "searchParams">) {
  const { obra } = await searchParams;
  const ctx = await contextoPortal(obra);
  if (!ctx.obra) {
    return (
      <>
        <CabeceraPortal titulo="Avance" ctx={ctx} ruta="/portal/avance" />
        <SinObra />
      </>
    );
  }
  const etapas = await etapasDe(ctx);
  const avance = avanceGeneral(etapas);

  return (
    <>
      <CabeceraPortal titulo="Avance" ctx={ctx} ruta="/portal/avance" />
      <Tarjeta className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-medium">Avance general</span>
          <span className="font-display text-2xl font-bold tracking-[-0.04em]">{avance}%</span>
        </div>
        <BarraProgreso valor={avance} etiqueta="Avance general del proyecto" />
      </Tarjeta>

      {etapas.length === 0 ? (
        <Tarjeta>
          <p className="text-[15px] text-pizarra">Pronto verás aquí las etapas de tu proyecto.</p>
        </Tarjeta>
      ) : (
        <ol className="flex flex-col">
          {etapas.map((e, i) => {
            const completada = e.estado === "completada";
            const enCurso = e.estado === "en_curso";
            const ultima = i === etapas.length - 1;
            return (
              <li key={e.id} className="relative flex gap-4 pb-6">
                {!ultima && <span aria-hidden className={`absolute top-9 bottom-0 left-[17px] w-0.5 ${completada ? "bg-cielo-profundo" : "bg-borde"}`} />}
                <span
                  aria-hidden
                  className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs ${
                    completada
                      ? "border-cielo-profundo bg-cielo-profundo text-blanco"
                      : enCurso
                        ? "border-cielo-profundo bg-blanco text-cielo-profundo"
                        : "border-borde bg-blanco text-pizarra"
                  }`}
                >
                  {completada ? <Check size={16} strokeWidth={2} /> : String(i + 1).padStart(2, "0")}
                </span>
                <div className={`flex flex-1 flex-col gap-2 rounded-[18px] border bg-blanco p-4 ${enCurso ? "border-cielo-profundo" : "border-borde"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-medium">{e.nombre}</span>
                    <Chip estado={e.estado} />
                  </div>
                  {enCurso && <BarraProgreso valor={e.porcentaje} etiqueta={`Avance de ${e.nombre}`} />}
                  <span className="text-[13px] text-pizarra">
                    {enCurso ? `${e.porcentaje}% · ` : ""}
                    {e.fecha ? (completada ? `Terminada el ${fechaCorta(e.fecha)}` : `Fecha estimada: ${fechaCorta(e.fecha)}`) : completada ? "Terminada" : "Fecha por definir"}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
