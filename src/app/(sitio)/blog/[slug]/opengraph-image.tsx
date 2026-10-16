import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/data";
import { ogImage } from "@/lib/og";

export const alt = "Artículo del blog de DevMart Solutions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return ogImage({ title: post.titulo, eyebrow: `Blog · ${post.categoria}` });
}
