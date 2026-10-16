// Eventos de conversión. No hace nada si no hay analítica cargada
// (sin variables de entorno, o GA4 sin consentimiento de cookies).

type Props = Record<string, string>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

export type ConversionEvent = "whatsapp_click" | "contact_submit" | "cotizador_enviado";

export function track(event: ConversionEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, props);
  window.plausible?.(event, { props });
}

/** Clave de localStorage con la decisión sobre cookies de analítica. */
export const CONSENT_KEY = "dm-cookies";
/** Evento de ventana para volver a mostrar el aviso de cookies. */
export const CONSENT_RESET_EVENT = "dm-cookies-reset";
