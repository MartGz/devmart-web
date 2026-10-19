import { redes, site, siteUrl, WHATSAPP_VISIBLE } from "@/lib/site";

// Datos estructurados del estudio. DevMart no es una sociedad registrada: se describe como un
// servicio profesional local (sin «Organization» ni datos legales), con teléfono y redes.
export function EstudioJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#estudio`,
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/logo-cube.svg`,
    description: site.description,
    telephone: WHATSAPP_VISIBLE,
    ...(site.email && { email: site.email }),
    ...(redes.length > 0 && { sameAs: redes.map((r) => r.url) }),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: "Bolívar",
      addressCountry: "CO",
    },
    areaServed: { "@type": "Country", name: "Colombia" },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
    />
  );
}
