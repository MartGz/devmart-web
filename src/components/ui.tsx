import Link from "next/link";
import type { ReactNode } from "react";
import { Cube } from "./Cube";
import { hasWhatsapp, whatsappHref } from "@/lib/site";

/** Etiqueta mono con prefijo «// ». */
export function Label({ children, className = "text-cielo-profundo" }: { children: ReactNode; className?: string }) {
  return <span className={`label-mono ${className}`}>{`// `}{children}</span>;
}

/** Número de sección 01, 02… */
export function Num({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`font-mono text-xs text-cielo-profundo ${className}`}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** Cabecera de página interior: etiqueta, H1 e introducción. */
export function PageHero({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="container-dm flex flex-col gap-7 pt-12 pb-16 md:pt-[72px] md:pb-24">
      <Label>{label}</Label>
      <h1 className="h1-hero max-w-[880px]">{title}</h1>
      {intro && (
        <p className="max-w-[620px] text-lg leading-[1.55] text-pizarra text-pretty">{intro}</p>
      )}
      {children}
    </section>
  );
}

/** Encabezado de sección: etiqueta + H2 (+ texto opcional). */
export function SectionHead({
  label,
  title,
  intro,
  className = "",
}: {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex max-w-[640px] flex-col gap-3.5 ${className}`}>
      <Label>{label}</Label>
      <h2 className="h2-dm">{title}</h2>
      {intro && <p className="text-[17px] leading-[1.55] text-pizarra text-pretty">{intro}</p>}
    </div>
  );
}

/** Enlace a WhatsApp (o a /contacto mientras no haya número). */
export function WhatsAppLink({
  children,
  message,
  className,
  track = "enlace",
}: {
  children: ReactNode;
  message?: string;
  className?: string;
  /** Ubicación que se registra en el evento whatsapp_click. */
  track?: string;
}) {
  return (
    <a
      href={whatsappHref(message)}
      data-track-whatsapp={track}
      {...(hasWhatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
    >
      {children}
    </a>
  );
}

/** Sección Noche de cierre (máximo una por página). */
export function CtaFinal({
  label = "Hablemos",
  title = "¿Tienes una idea? Hablemos.",
  intro = "Cuéntanos qué tienes en mente. Te respondemos con preguntas, un plan y un presupuesto orientativo.",
  showForm = true,
}: {
  label?: string;
  title?: string;
  intro?: string;
  showForm?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-noche py-24 text-nube">
      <div aria-hidden className="pointer-events-none absolute -top-10 -right-16 opacity-90 max-md:hidden">
        <Cube size={260} variant="dark" className="[&_polygon:first-child]:fill-[#1A2230]" />
      </div>
      <div className="container-dm relative flex flex-col items-start gap-7">
        <Label className="text-cielo">{label}</Label>
        <h2 className="h1-hero max-w-[720px]">{title}</h2>
        <p className="max-w-[520px] text-lg leading-[1.55] text-niebla text-pretty">{intro}</p>
        <div className="flex flex-wrap gap-3">
          <WhatsAppLink className="btn-primary" track="cta-final">
            Escríbenos por WhatsApp
          </WhatsAppLink>
          {showForm && (
            <Link href="/contacto" className="btn-secondary-dark">
              Usar el formulario
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/** Placeholder rayado para imágenes pendientes. */
export function ImagePlaceholder({ label = "captura del proyecto", className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`placeholder-rayado flex items-center justify-center font-mono text-xs text-pizarra ${className}`}
      role="img"
      aria-label={`Imagen pendiente: ${label}`}
    >
      {label}
    </div>
  );
}
