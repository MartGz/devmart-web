import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { Label, PageHero } from "@/components/ui";
import { usesCookies } from "@/components/Analytics";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacidad y cookies",
  description:
    "Política de tratamiento de datos personales (Ley 1581 de 2012) y uso de cookies de DevMart Solutions.",
};

const linkCls = "text-cielo-profundo underline underline-offset-4 hover:text-noche";

function Section({ id, label, title, children }: { id?: string; label: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="flex flex-col gap-5 border-t border-borde pt-12">
      <Label>{label}</Label>
      <h2 className="h2-dm">{title}</h2>
      <div className="flex flex-col gap-4 text-[17px] leading-[1.65] text-texto-cuerpo [&_strong]:font-semibold [&_strong]:text-noche [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:marker:text-cielo-profundo">
        {children}
      </div>
    </section>
  );
}

// Pendiente: revisar con asesoría legal antes de publicar.
export default function PrivacidadPage() {
  return (
    <>
      <PageHero
        label="Privacidad"
        title="Privacidad y cookies."
        intro="Cómo tratamos los datos que nos entregas y qué cookies usa este sitio."
      />

      <div className="container-dm pb-24">
        <div className="flex max-w-[760px] flex-col gap-12">
          <Section id="datos" label="Ley 1581 de 2012" title="Tratamiento de datos personales">
            <p>
              En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 (compilado en el
              Decreto 1074 de 2015), <strong>{site.name}</strong>, con domicilio en {site.city},
              Colombia, es responsable del tratamiento de los datos personales que recibe a través
              de este sitio.
            </p>
            <p>
              <strong>Datos que recogemos:</strong> nombre, email, teléfono o WhatsApp y la
              información sobre tu proyecto que escribes en el formulario de contacto o nos envías
              por WhatsApp.
            </p>
            <p>
              <strong>Finalidades:</strong>
            </p>
            <ul>
              <li>Responder tu solicitud y preparar una propuesta o cotización.</li>
              <li>Mantener la comunicación sobre tu proyecto.</li>
              <li>Cumplir obligaciones legales y contables si llegamos a trabajar juntos.</li>
            </ul>
            <p>
              No vendemos ni compartimos tus datos con terceros para fines comerciales. Usamos
              proveedores tecnológicos (alojamiento del sitio en Vercel, base de datos en Neon y envío de correos) que los procesan
              solo para prestarnos ese servicio.
            </p>
          </Section>

          <Section label="Tus derechos" title="Qué puedes hacer con tus datos">
            <ul>
              <li>Conocer, actualizar y rectificar tus datos.</li>
              <li>Pedir prueba de la autorización que nos diste.</li>
              <li>Saber qué uso les hemos dado.</li>
              <li>Revocar la autorización o pedir que los suprimamos.</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
            </ul>
            <p>
              Para ejercerlos, escríbenos por los canales de la página de{" "}
              <Link href="/contacto" className={linkCls}>
                contacto
              </Link>
              {site.email && (
                <>
                  {" "}o a{" "}
                  <a href={`mailto:${site.email}`} className={linkCls}>
                    {site.email}
                  </a>
                </>
              )}
              . Respondemos las consultas en máximo 10 días hábiles y los reclamos en máximo 15 días
              hábiles, como indica la ley.
            </p>
            <p>
              Conservamos tus datos mientras sean necesarios para las finalidades anteriores o
              mientras una obligación legal lo exija.
            </p>
          </Section>

          <Section id="cookies" label="Cookies" title="Cookies y analítica">
            <p>
              Este sitio no usa cookies publicitarias. Guardamos en tu navegador (localStorage)
              únicamente tu decisión sobre las cookies de analítica, para no volver a preguntarte.
            </p>
            {usesCookies ? (
              <>
                <p>
                  Con tu permiso usamos <strong>Google Analytics 4</strong>, que instala cookies
                  para medir de forma agregada cuántas personas visitan el sitio y qué páginas
                  consultan. Si no las aceptas, Google Analytics no se carga.
                </p>
                <CookieSettingsButton />
              </>
            ) : (
              <p>
                Si medimos visitas, lo hacemos con herramientas que no usan cookies ni guardan datos
                que te identifiquen.
              </p>
            )}
          </Section>

          <p className="font-mono text-xs text-pizarra">Última actualización: octubre de 2026</p>
        </div>
      </div>
    </>
  );
}
