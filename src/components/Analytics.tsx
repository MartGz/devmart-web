import Script from "next/script";
import { CookieConsent } from "./CookieConsent";
import { TrackClicks } from "./TrackClicks";

// Analítica opcional: solo se carga si su variable de entorno está definida (ver .env.example).
// - GA4 usa cookies: se carga solo después de que la persona las acepta en el aviso.
// - Plausible no usa cookies: se carga directamente.
// Ambos registran por sí mismos los cambios de ruta del lado del cliente.
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "";
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

export const hasAnalytics = Boolean(gaId || plausibleDomain);
export const usesCookies = Boolean(gaId);

export function Analytics() {
  if (!hasAnalytics) return null;
  return (
    <>
      {plausibleDomain && (
        <>
          <Script src={plausibleSrc} data-domain={plausibleDomain} />
          <Script id="plausible-queue">
            {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};`}
          </Script>
        </>
      )}
      {gaId && <CookieConsent gaId={gaId} />}
      <TrackClicks />
    </>
  );
}
