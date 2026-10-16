import type { Metadata } from "next";
import { ProjectCard, ProjectSlot } from "@/components/ProjectCard";
import { CtaFinal, PageHero } from "@/components/ui";
import { proyectos } from "@/lib/content";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Casos de DevMart Solutions: tiendas en línea, sitios web y software a medida.",
};

export default function ProyectosPage() {
  // Completa la cuadrícula con espacios reservados hasta tener más casos.
  const slots = Math.max(0, 3 - proyectos.length);
  return (
    <>
      <PageHero
        label="Proyectos"
        title="Ideas que ya son producto."
        intro="Cada caso cuenta el reto, la solución y el resultado. Estamos sumando nuevos proyectos."
      />
      <section className="bg-nube py-24">
        <div className="container-dm grid gap-6 md:grid-cols-3">
          {proyectos.map((p) => (
            <ProjectCard key={p.slug} p={p} />
          ))}
          {Array.from({ length: slots }, (_, i) => (
            <ProjectSlot key={i} />
          ))}
        </div>
      </section>
      <CtaFinal title="¿Tu idea será el próximo caso?" />
    </>
  );
}
