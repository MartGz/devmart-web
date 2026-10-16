import Link from "next/link";
import { Cube } from "@/components/Cube";
import { ProjectCard, ProjectSlot } from "@/components/ProjectCard";
import { CtaFinal } from "@/components/ui";
import { proceso, proyectos, servicios } from "@/lib/content";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container-dm">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-center gap-12 pt-12 pb-12 md:pt-[72px]">
          <div className="flex flex-col gap-7">
            <span className="label-mono text-cielo-profundo">{"// DevMart Solutions"}</span>
            <h1 className="h1-hero">Software a medida para tu negocio.</h1>
            <p className="max-w-[460px] text-lg leading-[1.55] text-pizarra text-pretty">
              Creamos software web, móvil o lo que necesites para que tu idea se convierta en un
              producto real. Desde Cartagena, para toda Colombia.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacto" className="btn-primary">
                Empezar un proyecto
              </Link>
              <Link href="/proyectos" className="btn-secondary">
                Ver proyectos
              </Link>
            </div>
          </div>

          <div className="cube-hover flex min-h-[320px] items-center justify-center rounded-panel bg-cielo-tinte">
            <div className="cube-float">
              <Cube size={200} className="h-auto w-[160px] md:w-[200px]" />
            </div>
          </div>
        </div>

        {/* Fila de servicios */}
        <ul className="mt-6 mb-12 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-8 border-t border-borde pt-7">
          {servicios.map((s, i) => (
            <li key={s.slug} className="flex flex-col gap-2">
              <span className="font-mono text-xs text-cielo-profundo">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Link href={`/servicios#${s.slug}`} className="h3-dm transition-colors hover:text-cielo-profundo">
                {s.titulo}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Proyectos destacados */}
      <section className="bg-nube py-24">
        <div className="container-dm flex flex-col gap-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="flex flex-col gap-3.5">
              <span className="label-mono text-cielo-profundo">{"// Proyectos"}</span>
              <h2 className="h2-dm">Ideas que ya son producto.</h2>
            </div>
            <Link href="/proyectos" className="btn-secondary">
              Ver todos
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {proyectos.slice(0, 3).map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
            {Array.from({ length: Math.max(0, 3 - proyectos.length) }, (_, i) => (
              <ProjectSlot key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Proceso */}
      <section className="py-24">
        <div className="container-dm flex flex-col gap-12">
          <div className="flex max-w-[560px] flex-col gap-3.5">
            <span className="label-mono text-cielo-profundo">{"// Proceso"}</span>
            <h2 className="h2-dm">De la idea al lanzamiento, paso a paso.</h2>
          </div>
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-8">
            {proceso.map((paso, i) => (
              <li key={paso.titulo} className="flex flex-col gap-3 border-t border-borde pt-7">
                <span className="font-display text-[40px] leading-none font-bold tracking-[-0.05em] text-cielo-profundo">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="h3-dm">{paso.titulo}</h3>
                <p className="text-base leading-[1.55] text-texto-cuerpo text-pretty">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaFinal />
    </>
  );
}
