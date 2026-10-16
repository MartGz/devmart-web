import { site, siteUrl } from "@/lib/site";

// Datos estructurados de la empresa. Teléfono y redes se añadirán cuando estén definidos.
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/logo-cube.svg`,
    description: site.description,
    ...(site.email && { email: site.email }),
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
