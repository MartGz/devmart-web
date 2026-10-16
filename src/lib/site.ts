export const site = {
  name: "DevMart Solutions",
  city: "Cartagena de Indias",
  description:
    "DevMart crea software a medida —web, móvil o lo que necesites— para personas y negocios que tienen una idea y quieren convertirla en producto.",
  // Pendiente de confirmar: se muestra solo si está definido.
  email: process.env.NEXT_PUBLIC_EMAIL ?? "",
};

/** URL pública del sitio (dominio pendiente de elegir). */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const nav = [
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
  { href: "/precios", label: "Precios" },
] as const;

/**
 * Número de WhatsApp Business en formato internacional sin «+» (p. ej. 573001234567).
 * Mientras no esté definido, los botones de WhatsApp llevan a /contacto.
 */
const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");

export function whatsappHref(message = "Hola DevMart, tengo una idea y quiero contarles.") {
  if (!whatsappNumber) return "/contacto";
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const hasWhatsapp = whatsappNumber.length > 0;
