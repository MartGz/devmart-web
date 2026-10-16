"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, FileText, FolderKanban, LayoutDashboard, Mail, Tag } from "lucide-react";

const items = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/mensajes", label: "Mensajes", icon: Mail },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/proyectos", label: "Proyectos", icon: FolderKanban },
  { href: "/admin/precios", label: "Precios", icon: Tag },
  { href: "/admin/actividad", label: "Actividad", icon: Activity },
];

export function AdminNav() {
  const pathname = usePathname();
  return <NavLinks active={(href) => (href === "/admin" ? pathname === href : pathname.startsWith(href))} />;
}

/** Misma navegación sin resaltar la sección actual (mientras se resuelve la URL). */
export function AdminNavFallback() {
  return <NavLinks active={() => false} />;
}

function NavLinks({ active }: { active: (href: string) => boolean }) {
  return (
    <nav aria-label="Panel" className="-mx-1 flex gap-1 overflow-x-auto px-1 lg:flex-col">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={active(href) ? "page" : undefined}
          className="flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[15px] text-niebla transition-colors hover:bg-white/5 hover:text-blanco aria-[current=page]:bg-white/10 aria-[current=page]:text-blanco"
        >
          <Icon size={18} strokeWidth={1.5} aria-hidden /> {label}
        </Link>
      ))}
    </nav>
  );
}
