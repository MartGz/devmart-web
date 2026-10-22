import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

/** Pantallas de acceso del portal: tarjeta centrada sobre el cielo claro de la marca. */
export function TarjetaAcceso({ titulo, intro, children }: { titulo: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cielo-tinte px-4 py-12">
      <div className="flex w-full max-w-[420px] flex-col gap-7 rounded-[22px] bg-blanco p-7 shadow-elevada md:p-10">
        <div className="flex items-center justify-between">
          <Logo cubeSize={24} wordmarkSize={18} gap={10} />
          <span className="font-mono text-[11px] tracking-[0.12em] text-pizarra uppercase">Portal</span>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[26px] leading-[1.1] font-bold tracking-[-0.045em]">{titulo}</h1>
          <p className="text-[15px] leading-[1.55] text-pizarra">{intro}</p>
        </div>
        {children}
      </div>
    </main>
  );
}

export function AvisoPortal({ tono = "info", children }: { tono?: "info" | "error"; children: ReactNode }) {
  return (
    <p
      role={tono === "error" ? "alert" : "status"}
      className={`rounded-xl px-4 py-3 text-[15px] leading-[1.55] ${
        tono === "error" ? "border border-[#C2410C]/30 bg-[#FFF4ED] text-[#9A3412]" : "bg-cielo-tinte text-noche"
      }`}
    >
      {children}
    </p>
  );
}

export const inputPortal =
  "w-full rounded-xl border border-borde bg-blanco px-4 py-3.5 text-[16px] text-noche placeholder:text-niebla transition-colors hover:border-niebla focus:border-cielo-profundo focus:outline-none";
