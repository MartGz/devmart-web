import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Label, PageHero, SectionHead, WhatsAppLink } from "@/components/ui";
import { precios } from "@/lib/content";

export const metadata: Metadata = {
  title: "Precios",
  description:
    "Rangos orientativos para landing pages, webs corporativas, tiendas en línea y apps a medida. Cotiza tu proyecto con DevMart Solutions.",
};

const faqs = [
  {
    q: "¿Por qué no hay un precio fijo?",
    a: "Cada proyecto es distinto. Después de una primera conversación te enviamos una cotización cerrada con el alcance, las etapas y el valor de cada una.",
  },
  {
    q: "¿Qué pasa después del lanzamiento?",
    a: "Te entregamos el código y los accesos. Si quieres, acordamos un plan de soporte y mejoras.",
  },
];

export default function PreciosPage() {
  return (
    <>
      <PageHero
        label="Precios"
        title="Precios claros desde el principio."
        intro="Estos rangos son orientativos. El valor final depende del alcance y lo acordamos contigo antes de empezar, por etapas."
      />

      <section className="bg-nube py-24">
        <div className="container-dm grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {precios.map((p) => (
            <article key={p.tipo} className="flex flex-col gap-5 rounded-card bg-blanco p-7">
              <h2 className="h3-dm">{p.tipo}</h2>
              <p className="text-[15px] leading-[1.55] text-pizarra text-pretty">{p.descripcion}</p>
              <div className="flex flex-col gap-1 border-y border-borde py-5">
                <Label className="text-pizarra">Rango orientativo</Label>
                <span className="font-display text-2xl font-bold tracking-[-0.04em]">
                  {p.rango ?? "A cotizar"}
                </span>
              </div>
              <ul className="flex flex-1 flex-col gap-3">
                {p.incluye.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-[1.45] text-texto-cuerpo">
                    <Check size={18} strokeWidth={1.5} className="mt-0.5 shrink-0 text-cielo-profundo" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/contacto?tipo=${encodeURIComponent(p.tipoFormulario)}`}
                className="btn-secondary mt-2 w-full"
              >
                Cotizar
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-dm grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHead label="Preguntas" title="Lo que suelen preguntarnos." />
          <dl className="flex flex-col">
            {faqs.map((f) => (
              <div key={f.q} className="flex flex-col gap-2 border-t border-borde py-6 last:border-b">
                <dt className="h3-dm">{f.q}</dt>
                <dd className="text-[17px] leading-[1.55] text-texto-cuerpo text-pretty">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-dm">
          <div className="flex flex-col items-start gap-6 rounded-card bg-cielo-tinte p-8 md:flex-row md:items-center md:justify-between md:p-12">
            <div className="flex flex-col gap-3">
              <Label>Cotización</Label>
              <h2 className="h2-dm">Recibe una cotización para tu idea.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacto" className="btn-primary">
                Cotizar mi proyecto
              </Link>
              <WhatsAppLink className="btn-secondary" message="Hola DevMart, quiero cotizar un proyecto.">
                WhatsApp
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
