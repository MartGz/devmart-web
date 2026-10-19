import type { Metadata } from "next";
import { Outfit, Unbounded, JetBrains_Mono } from "next/font/google";
import { EstudioJsonLd } from "@/components/JsonLd";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} · Software a medida en Cartagena`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", siteName: site.name, locale: "es_CO" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${unbounded.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <EstudioJsonLd />
      </body>
    </html>
  );
}
