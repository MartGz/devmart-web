import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import { ContactForm, ContactFormWithParams } from "@/components/ContactForm";
import { Label, PageHero, WhatsAppLink } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cuéntanos tu idea. Te respondemos con preguntas, un plan y un presupuesto orientativo.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        label="Contacto"
        title="Cuéntanos tu idea."
        intro="Llena el formulario o escríbenos por WhatsApp. Te respondemos con preguntas, un plan y un presupuesto orientativo."
      />

      <section className="bg-nube py-16 md:py-24">
        <div className="container-dm grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative rounded-card bg-blanco p-7 md:p-12">
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithParams />
            </Suspense>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-5 rounded-card bg-noche p-7 text-nube md:p-9">
              <MessageCircle size={32} strokeWidth={1.5} className="text-cielo" aria-hidden />
              <h2 className="h3-dm">¿Prefieres conversar?</h2>
              <p className="text-[16px] leading-[1.55] text-niebla">
                Escríbenos por WhatsApp Business y te respondemos directamente.
              </p>
              <WhatsAppLink className="btn-primary" track="contacto">
                Abrir WhatsApp
              </WhatsAppLink>
            </div>
            <div className="flex flex-col gap-4 rounded-card bg-blanco p-7 md:p-9">
              <Label>Dónde estamos</Label>
              <p className="flex items-start gap-3 text-[16px] leading-[1.55] text-texto-cuerpo">
                <MapPin size={20} strokeWidth={1.5} className="mt-0.5 shrink-0 text-cielo-profundo" aria-hidden />
                {site.city}, Colombia. Trabajamos con clientes de todo el país.
              </p>
              {site.email && (
                <a href={`mailto:${site.email}`} className="text-[16px] text-cielo-profundo hover:text-noche">
                  {site.email}
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      {/* Pendiente: revisar con asesoría legal antes de publicar. */}
      <section id="datos" className="py-24">
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
