import Link from "next/link";
import { Logo } from "./Logo";
import { nav, site, whatsappHref, hasWhatsapp } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-noche text-nube">
      <div className="container-dm grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-[72px]">
        <div className="flex flex-col gap-6">
          <Logo variant="dark" cubeSize={40} wordmarkSize={30} showSolutions />
          <p className="max-w-[340px] text-[15px] leading-[1.55] text-niebla">
            Software a medida —web, móvil o lo que necesites— para convertir tu idea en producto.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <span className="label-mono text-niebla">{"// Navegación"}</span>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-cielo">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contacto" className="transition-colors hover:text-cielo">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <span className="label-mono text-niebla">{"// Contacto"}</span>
          <ul className="flex flex-col gap-2.5 text-[15px]">
            <li>
              <a
                href={whatsappHref()}
                data-track-whatsapp="footer"
                {...(hasWhatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="transition-colors hover:text-cielo"
              >
                WhatsApp
              </a>
            </li>
            {site.email && (
              <li>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-cielo">
                  {site.email}
                </a>
              </li>
            )}
            <li className="text-niebla">{site.city}, Colombia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-dm flex flex-col gap-2 py-6 font-mono text-xs text-niebla sm:flex-row sm:justify-between">
          <span>© 2026 DevMart Solutions · {site.city}</span>
          <Link href="/privacidad" className="transition-colors hover:text-cielo">
            Privacidad y cookies · Ley 1581 de 2012
          </Link>
        </div>
      </div>
    </footer>
  );
}
