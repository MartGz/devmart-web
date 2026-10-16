import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Proyecto } from "@/lib/content";
import { ImagePlaceholder, Label } from "./ui";

export function ProjectCard({ p }: { p: Proyecto }) {
  return (
    <Link
      href={`/proyectos/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-card bg-blanco transition-shadow duration-150 hover:shadow-elevada"
    >
      {p.imagen ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-nube">
          <Image
            src={p.imagen}
            alt={p.imagenAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <ImagePlaceholder className="aspect-[4/3]" />
      )}
      <div className="flex flex-1 flex-col gap-2 p-7">
        <Label>{p.tipo}</Label>
        <h3 className="h3-dm">{p.cliente}</h3>
        <p className="text-[15px] leading-[1.5] text-pizarra">{p.resumen}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[15px] font-medium text-cielo-profundo group-hover:text-noche">
          Ver el caso <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export function ProjectSlot() {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-dashed border-borde bg-blanco/60">
      <div className="placeholder-rayado aspect-[4/3] opacity-60" />
      <div className="flex flex-1 flex-col gap-2 p-7">
        <Label className="text-pizarra">Próximamente</Label>
        <h3 className="h3-dm text-pizarra">Tu proyecto puede ser el siguiente.</h3>
      </div>
    </div>
  );
}
