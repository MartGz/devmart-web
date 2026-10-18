import type { ReactNode } from "react";
import { CubosEscalera } from "@/components/CubosEscalera";
import { HoraLocal } from "@/components/HoraLocal";
import { Logo } from "@/components/Logo";

const pasos = ["Idea", "Diseño", "Desarrollo", "Lanzamiento"];

/**
 * Pantallas de acceso (entrar, recuperar, nueva contraseña) en 60/40: a la izquierda la
 * escalera de cubos de la marca sobre Noche; a la derecha el formulario. En móvil, solo el formulario.
 */
export function Tarjeta({ titulo, intro, children }: { titulo: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-blanco lg:grid-cols-[3fr_2fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-noche px-14 py-10 text-nube lg:flex">
        <div className="flex items-center justify-between">
          <Logo variant="dark" cubeSize={24} wordmarkSize={18} gap={10} href="/" />
          <span className="font-mono text-[11px] tracking-[0.12em] text-niebla uppercase">
            CTG · <HoraLocal />
          </span>
        </div>
        <CubosEscalera className="max-h-[52vh] w-[78%] max-w-[620px] self-center" />
        <div className="flex flex-col gap-[18px]">
          <span className="label-mono text-cielo">{"// Panel de administración"}</span>
          <p className="max-w-[560px] font-display text-[40px] leading-[1.05] font-bold tracking-[-0.05em] text-balance">
            De la idea al producto, un bloque a la vez.
          </p>
          <ol className="flex flex-wrap gap-x-7 gap-y-2 border-t border-white/15 pt-[18px] font-mono text-xs text-niebla">
            {pasos.map((p, i) => (
              <li key={p}>
                <span className="text-cielo">{String(i + 1).padStart(2, "0")}</span> {p}
              </li>
            ))}
          </ol>
        </div>
      </aside>

      <main className="flex items-center justify-center px-5 py-12 md:px-12">
        <div className="flex w-full max-w-[400px] flex-col gap-7">
          <Logo cubeSize={24} wordmarkSize={18} gap={10} className="lg:hidden" />
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-[26px] leading-[1.1] font-bold tracking-[-0.045em] md:text-[30px]">{titulo}</h1>
            <p className="text-[15px] leading-[1.55] text-pizarra">{intro}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
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
