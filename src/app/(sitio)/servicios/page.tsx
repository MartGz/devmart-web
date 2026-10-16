import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { CtaFinal, Label, Num, PageHero } from "@/components/ui";
import { servicios } from "@/lib/content";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Desarrollo web, apps móviles, tiendas en línea, software a medida y paneles administrativos en Cartagena de Indias.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        label="Servicios"
        title="Lo que construimos para tu negocio."
        intro="Web, móvil o lo que necesites. Cada proyecto empieza con un prototipo navegable y se entrega por etapas, con el código a tu nombre."
      >
        <nav aria-label="Servicios" className="flex flex-wrap gap-2">
          {servicios.map((s) => (
            <Link
              key={s.slug}
              href={`#${s.slug}`}
              className="rounded-full border border-borde px-4 py-2 text-[15px] text-texto-cuerpo transition-colors hover:border-noche hover:text-noche"
            >
              {s.titulo}
            </Link>
          ))}
        </nav>
      </PageHero>

      <section className="bg-nube py-24">
        <div className="container-dm flex flex-col gap-6">
          {servicios.map((s, i) => (
            <article
              key={s.slug}
              id={s.slug}
              className="grid gap-10 rounded-card bg-blanco p-7 md:p-12 lg:grid-cols-[1.1fr_1fr]"
            >
              <div className="flex flex-col gap-4">
                <Num n={i + 1} />
                <h2 className="h2-dm">{s.titulo}</h2>
                <p className="text-lg leading-[1.55] font-medium text-noche text-pretty">{s.resumen}</p>
                <p className="text-[17px] leading-[1.55] text-texto-cuerpo text-pretty">{s.descripcion}</p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                <div className="flex flex-col gap-4">
                  <Label className="text-pizarra">Entregables</Label>
                  <ul className="flex flex-col gap-3">
                    {s.entregables.map((e) => (
                      <li key={e} className="flex gap-3 text-[16px] leading-[1.45] text-texto-cuerpo">
                        <Check size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-cielo-profundo" aria-hidden />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4">
                  <Label className="text-pizarra">Tecnologías</Label>
                  <ul className="flex flex-wrap gap-2">
                    {s.tecnologias.map((t) => (
                      <li key={t} className="rounded-full bg-cielo-tinte px-3.5 py-1.5 font-mono text-xs text-noche">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaFinal
        label="Empecemos"
        title="¿No sabes cuál necesitas? Te ayudamos a decidir."
        intro="Cuéntanos tu idea y te recomendamos el camino más sencillo para llevarla a producto."
      />
    </>
  );
}
