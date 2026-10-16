import { notFound } from "next/navigation";
import { proyectos } from "@/lib/content";
import { ogImage } from "@/lib/og";

export const alt = "Caso de proyecto de DevMart Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = proyectos.find((x) => x.slug === slug);
  if (!p) notFound();
  return ogImage({ title: p.cliente, eyebrow: `Caso · ${p.tipo}` });
}
