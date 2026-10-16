import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { CtaFinal, Label } from "@/components/ui";
import { formatFecha, posts } from "@/lib/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.titulo,
    description: post.resumen,
    openGraph: { type: "article", publishedTime: post.fecha, siteName: "DevMart Solutions", locale: "es_CO" },
  };
}

// Los params se leen dentro de <Suspense> para que la navegación muestre la cabecera al instante.
export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[70vh]" />}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: Pick<PageProps<"/blog/[slug]">, "params">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${post.slug}.mdx`);

  return (
    <>
      <article className="container-dm pt-12 pb-24 md:pt-[72px]">
        <div className="mx-auto flex max-w-[680px] flex-col gap-6">
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche"
          >
            <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Blog
          </Link>
          <Label>{post.categoria}</Label>
          <h1 className="font-display text-[32px] leading-[1.08] font-bold tracking-[-0.045em] text-balance md:text-[44px]">
            {post.titulo}
          </h1>
          <div className="flex gap-4 font-mono text-xs text-pizarra">
            <time dateTime={post.fecha}>{formatFecha(post.fecha)}</time>
            <span aria-hidden>·</span>
            <span>{post.lecturaMin} min de lectura</span>
          </div>
          <div className="mt-6 border-t border-borde pt-10">
            <Body />
          </div>
        </div>
      </article>
      <CtaFinal />
    </>
  );
}
