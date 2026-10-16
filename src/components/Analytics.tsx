import Script from "next/script";

// Analítica opcional: solo se carga si su variable de entorno está definida (ver .env.example).
// GA4 y Plausible registran por sí mismos los cambios de ruta del lado del cliente.
const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";
const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "";
const plausibleSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js";

export function Analytics() {
  return (
    <>
      {gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
          <Script id="ga4">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
      {plausibleDomain && <Script src={plausibleSrc} data-domain={plausibleDomain} />}
    </>
  );
}
