import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

/** Tarjeta centrada de las pantallas de acceso (entrar, recuperar, nueva contraseña). */
export function Tarjeta({ titulo, intro, children }: { titulo: string; intro: ReactNode; children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-nube px-4 py-16">
      <div className="flex w-full max-w-[440px] flex-col gap-8 rounded-card bg-blanco p-8 shadow-elevada md:p-10">
        <Logo cubeSize={24} wordmarkSize={18} gap={10} />
        <div className="flex flex-col gap-2">
          <h1 className="h3-dm">{titulo}</h1>
          <p className="text-[15px] leading-[1.55] text-pizarra">{intro}</p>
        </div>
        {children}
      </div>
    </main>
  );
}

export const inputCls =
  "w-full rounded-xl border border-borde bg-blanco px-4 py-3.5 text-[16px] text-noche transition-colors hover:border-niebla focus:border-cielo-profundo focus:outline-none";

export function Aviso({ tono = "info", children }: { tono?: "info" | "error" | "ok"; children: ReactNode }) {
  const cls = {
    info: "bg-cielo-tinte text-noche",
    ok: "bg-cielo-tinte text-noche",
    error: "border border-[#C2410C]/30 bg-[#FFF4ED] text-[#9A3412]",
  }[tono];
  return (
    <p role={tono === "error" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-[15px] leading-[1.55] ${cls}`}>
      {children}
    </p>
  );
}
