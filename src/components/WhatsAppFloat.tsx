import { MessageCircle } from "lucide-react";
import { hasWhatsapp, whatsappHref } from "@/lib/site";
import { SocialIcon } from "./SocialIcon";

export function WhatsAppFloat() {
  const href = whatsappHref();
  return (
    <a
      href={href}
      data-track-whatsapp="flotante"
      {...(hasWhatsapp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={hasWhatsapp ? "Escríbenos por WhatsApp" : "Escríbenos"}
      className="fixed right-5 bottom-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-cielo text-noche shadow-elevada transition-colors duration-150 hover:bg-cielo-profundo hover:text-blanco md:right-8 md:bottom-8"
    >
      {hasWhatsapp ? <SocialIcon red="whatsapp" size={26} /> : <MessageCircle size={26} strokeWidth={1.5} aria-hidden />}
    </a>
  );
}
