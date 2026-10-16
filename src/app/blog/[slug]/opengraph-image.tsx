import { notFound } from "next/navigation";
import { posts } from "@/lib/blog";
import { ogImage } from "@/lib/og";

export const alt = "Artículo del blog de DevMart Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  return ogImage({ title: post.titulo, eyebrow: `Blog · ${post.categoria}` });
}
