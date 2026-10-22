import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BarraPortal, BarraPortalFallback } from "@/components/portal/BarraPortal";
import { salirDelPortal } from "../actions";

// Estructura del portal. Es estática: la sesión del cliente se verifica en cada página y acción
// (requireCliente), nunca aquí.
export default function PortalAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-nube pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-30 border-b border-borde bg-blanco">
        <div className="mx-auto flex h-16 max-w-[720px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Logo cubeSize={22} wordmarkSize={17} gap={9} href="/portal" />
            <span className="rounded-full bg-cielo-tinte px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] text-cielo-profundo uppercase">
              Portal
            </span>
          </div>
          <form action={salirDelPortal}>
            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-[14px] text-pizarra transition-colors hover:text-noche"
            >
              <LogOut size={18} strokeWidth={1.5} aria-hidden /> Salir
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto flex max-w-[720px] flex-col gap-6 px-4 py-6 md:py-10">{children}</main>
      <Suspense fallback={<BarraPortalFallback />}>
        <BarraPortal />
      </Suspense>
    </div>
  );
}
