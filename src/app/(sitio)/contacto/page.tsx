import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactForm, ContactFormWithParams } from "@/components/ContactForm";
import { CopyEmail } from "@/components/CopyEmail";
import { HoraLocal } from "@/components/HoraLocal";
import { Label } from "@/components/ui";
import { redes, site, WHATSAPP_VISIBLE, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cuéntanos tu idea. Te respondemos con preguntas, un plan y un presupuesto orientativo.",
};

const pasos = [
  { titulo: "Nos escribes", texto: "Por el formulario, WhatsApp o email. Con lo que tengas claro basta." },
  { titulo: "Te preguntamos", texto: "Aclaramos qué necesitas, para quién es y qué es lo más importante." },
  { titulo: "Propuesta", texto: "Recibes un plan por etapas con el alcance y el valor de cada una." },
  { titulo: "Prototipo", texto: "Empezamos con un prototipo navegable que puedes probar." },
];

const instagram = redes.find((r) => r.red === "instagram");

/** Fila de canal de contacto: etiqueta mono, valor grande y acción a la derecha. */
function Canal({ etiqueta, valor, accion }: { etiqueta: string; valor: ReactNode; accion?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-t border-noche/15 py-[18px] sm:gap-4">
      <span className="w-[76px] shrink-0 font-mono text-[10px] tracking-[0.12em] text-pizarra uppercase sm:w-24 sm:text-[11px]">{etiqueta}</span>
      <span className="min-w-0 flex-1 truncate font-display text-base font-medium tracking-[-0.04em] sm:text-lg md:text-xl">{valor}</span>
      {accion}
    </div>
  );
}

const accionCls = "inline-flex shrink-0 items-center gap-1 font-mono text-[11px] tracking-[0.12em] text-cielo-profundo uppercase hover:text-noche";

export default function ContactoPage() {
  return (
    <>
      {/* Sube bajo la cabecera flotante para que la cápsula quede sobre el fondo de la sección. */}
      <section className="-mt-[68px] bg-cielo-tinte pt-[116px] pb-16 text-noche md:-mt-20 md:pt-[152px] md:pb-24">
        <div className="container-dm grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div className="flex min-w-0 flex-col gap-6">
            <Label>Contacto</Label>
            <h1 className="h1-hero">Cuéntanos tu idea.</h1>
            <p className="max-w-[480px] text-lg leading-[1.55] text-pizarra text-pretty">
              Te respondemos con preguntas, un plan y un presupuesto orientativo. Sin compromiso.
            </p>
            <div className="mt-4 flex flex-col border-b border-noche/15">
              <Canal
                etiqueta="WhatsApp"
                valor={
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track-whatsapp="contacto-numero"
                    aria-label={`Escribir a DevMart Solutions por WhatsApp al ${WHATSAPP_VISIBLE}`}
                    className="hover:text-cielo-profundo"
                  >
                    {WHATSAPP_VISIBLE}
                  </a>
                }
                accion={
                  <a
                    href={whatsappHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track-whatsapp="contacto"
                    aria-label="Escribir a DevMart Solutions por WhatsApp"
                    className={accionCls}
                  >
                    Abrir <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                  </a>
                }
              />
              {site.email && (
                <Canal
                  etiqueta="Email"
                  valor={
                    <a href={`mailto:${site.email}`} className="hover:text-cielo-profundo">
                      {site.email}
                    </a>
                  }
                  accion={<CopyEmail email={site.email} compact tono="claro" />}
                />
              )}
              {instagram && (
                <Canal
                  etiqueta="Instagram"
                  valor={
                    <a href={instagram.url} target="_blank" rel="noopener noreferrer" className="hover:text-cielo-profundo">
                      @devmart.co
                    </a>
                  }
                  accion={
                    <a href={instagram.url} target="_blank" rel="noopener noreferrer" className={accionCls}>
                      Seguir <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                    </a>
                  }
                />
              )}
              <Canal
                etiqueta="Estudio"
                valor="Cartagena"
                accion={
                  <span className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-pizarra uppercase">
                    CTG · <HoraLocal />
                  </span>
                }
              />
            </div>
          </div>

          <div className="relative min-w-0 rounded-[22px] bg-blanco p-6 shadow-elevada md:p-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-bold tracking-[-0.045em]">Tu proyecto</h2>
              <span className="font-mono text-[11px] tracking-[0.12em] text-pizarra uppercase">Formulario</span>
            </div>
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithParams />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-dm flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Label>Qué pasa después</Label>
            <h2 className="h2-dm">De tu mensaje a tu prototipo.</h2>
          </div>
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {pasos.map((p, i) => (
              <li key={p.titulo} className="flex flex-col gap-2.5 border-t-2 border-noche pt-5">
                <span className="font-mono text-xs text-cielo-profundo">{String(i + 1).padStart(2, "0")}</span>
                <span className="h3-dm">{p.titulo}</span>
                <span className="text-[15px] leading-[1.55] text-pizarra">{p.texto}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pendiente: revisar con asesoría legal antes de publicar. */}
      <section id="datos" className="bg-nube py-24">
        <div className="container-dm">
          <div className="flex max-w-[680px] flex-col gap-5">
            <Label>Tratamiento de datos</Label>
            <h2 className="h2-dm">Política de tratamiento de datos personales</h2>
            <p className="text-[16px] leading-[1.6] text-texto-cuerpo">
              En cumplimiento de la Ley 1581 de 2012 y sus decretos reglamentarios, DevMart
              Solutions, con domicilio en {site.city}, es responsable del tratamiento de los datos
              que nos entregas en este formulario.
            </p>
            <ul className="list-disc space-y-2 pl-6 text-[16px] leading-[1.6] text-texto-cuerpo marker:text-cielo-profundo">
              <li>
                <strong className="font-semibold text-noche">Finalidad:</strong> responder tu
                solicitud, enviarte una propuesta y mantener la comunicación sobre tu proyecto.
              </li>
              <li>
                <strong className="font-semibold text-noche">Tus derechos:</strong> conocer,
                actualizar, rectificar y suprimir tus datos, y revocar la autorización en cualquier
                momento.
              </li>
              <li>
                <strong className="font-semibold text-noche">Cómo ejercerlos:</strong> escríbenos
                por los canales de esta página indicando tu solicitud.
              </li>
            </ul>
            <p className="text-[16px] leading-[1.6] text-texto-cuerpo">
              No vendemos ni compartimos tus datos con terceros para fines comerciales.
            </p>
            <Link href="/privacidad" className="btn-secondary w-fit">
              Leer la política completa
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
