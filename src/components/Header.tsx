"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { nav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Cerrar el menú al cambiar de página.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-blanco transition-colors duration-150 ${
        scrolled ? "border-borde" : "border-transparent"
      }`}
    >
      <div className="container-dm flex h-[68px] items-center justify-between gap-6 md:h-[76px]">
        <Logo cubeSize={24} wordmarkSize={18} gap={10} />

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className="text-[15px] text-texto-cuerpo transition-colors hover:text-cielo-profundo aria-[current=page]:text-cielo-profundo"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="rounded-full bg-noche px-[18px] py-2.5 text-[15px] font-semibold text-blanco transition-colors duration-150 hover:bg-cielo-profundo"
          >
            Contacto
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-noche md:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {open && (
        <div
          id="menu-movil"
          className="fixed inset-x-0 top-[69px] bottom-0 z-40 flex flex-col overflow-y-auto border-t border-borde bg-blanco md:hidden"
        >
          <nav aria-label="Principal móvil" className="container-dm flex flex-1 flex-col py-8">
            {nav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="flex items-baseline gap-4 border-b border-borde py-5 aria-[current=page]:text-cielo-profundo"
              >
                <span className="font-mono text-xs text-cielo-profundo">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl font-bold tracking-[-0.04em]">
                  {item.label}
                </span>
              </Link>
            ))}
            <Link href="/contacto" className="btn-primary mt-10 w-full">
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
