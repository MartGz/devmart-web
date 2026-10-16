import { Suspense } from "react";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav, AdminNavFallback } from "@/components/admin/AdminNav";
import { Logo } from "@/components/Logo";
import { cerrarSesion } from "@/lib/admin/actions";

// Estructura del panel. Es estática: la sesión se verifica en cada página (requireAdmin) y en
// cada acción, nunca aquí, para no bloquear el layout entero.
export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-screen flex-col bg-nube lg:flex-row">
      <aside className="flex flex-col gap-6 bg-noche px-4 py-5 text-nube lg:sticky lg:top-0 lg:h-screen lg:w-[248px] lg:shrink-0 lg:gap-10 lg:px-5 lg:py-8">
        <div className="flex items-center justify-between gap-4">
          <Logo variant="dark" cubeSize={22} wordmarkSize={17} gap={10} href="/admin" />
          <span className="font-mono text-[11px] tracking-[0.12em] text-niebla uppercase">Panel</span>
        </div>
        <Suspense fallback={<AdminNavFallback />}>
          <AdminNav />
        </Suspense>
        <div className="hidden flex-col gap-1 border-t border-white/10 pt-6 lg:mt-auto lg:flex">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] text-niebla transition-colors hover:text-blanco"
          >
            <ExternalLink size={18} strokeWidth={1.5} aria-hidden /> Ver el sitio
          </a>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] text-niebla transition-colors hover:text-blanco"
            >
              <LogOut size={18} strokeWidth={1.5} aria-hidden /> Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-10 md:py-12">
        <div className="mx-auto flex max-w-[1080px] flex-col gap-8">{children}</div>
        <form action={cerrarSesion} className="mt-12 lg:hidden">
          <button type="submit" className="btn-secondary w-full">
            <LogOut size={18} strokeWidth={1.5} aria-hidden /> Cerrar sesión
          </button>
        </form>
      </main>
    </div>
  );
}
