import { notFound } from "next/navigation";
import { getProyecto, getProyectos } from "@/lib/data";
import { ogImage } from "@/lib/og";

export const alt = "Caso de proyecto de DevMart Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getProyectos()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProyecto(slug);
  if (!p) notFound();
  return ogImage({ title: p.cliente, eyebrow: `Caso · ${p.tipo}` });
}
