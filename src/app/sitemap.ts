import type { MetadataRoute } from "next";
import { posts } from "@/lib/blog";
import { proyectos } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/servicios", "/proyectos", "/nosotros", "/blog", "/precios", "/contacto"];
  return [
    ...pages.map((p) => ({ url: `${siteUrl}${p}` })),
    ...proyectos.map((p) => ({ url: `${siteUrl}/proyectos/${p.slug}` })),
    ...posts.map((p) => ({ url: `${siteUrl}/blog/${p.slug}`, lastModified: p.fecha })),
  ];
}
