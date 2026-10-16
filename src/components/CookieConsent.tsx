"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_KEY, CONSENT_RESET_EVENT } from "@/lib/analytics";

type Decision = "granted" | "denied" | null;

function readDecision(): Decision {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Aviso de cookies de analítica. GA4 se carga solo si la persona acepta. */
export function CookieConsent({ gaId }: { gaId: string }) {
  // undefined = aún no se ha leído localStorage (no mostrar nada en el primer render).
  const [decision, setDecision] = useState<Decision | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage solo existe en el cliente
    setDecision(readDecision());
    const onReset = () => setDecision(null);
    window.addEventListener(CONSENT_RESET_EVENT, onReset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, onReset);
  }, []);

  function decide(value: "granted" | "denied") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {}
    setDecision(value);
    // Si se retira el consentimiento después de haberlo dado, recargar para descargar GA4.
    if (value === "denied" && window.gtag) window.location.reload();
  }

  return (
    <>
      {decision === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} />
          <Script id="ga4">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(gaId)});`}
          </Script>
        </>
      )}
      {decision === null && (
        <div
          role="dialog"
          aria-labelledby="cookies-titulo"
          className="fixed inset-x-4 bottom-24 z-50 flex flex-col gap-4 rounded-card bg-noche p-6 text-nube shadow-elevada sm:right-auto sm:left-6 sm:bottom-6 sm:max-w-[400px]"
        >
          <p id="cookies-titulo" className="text-[15px] leading-[1.55]">
            Usamos cookies de analítica (Google Analytics) para saber cómo se usa el sitio y
            mejorarlo. Solo se activan si las aceptas.{" "}
            <Link href="/privacidad#cookies" className="text-cielo underline underline-offset-4 hover:text-blanco">
              Más información
            </Link>
          </p>
          <div className="flex gap-3">
            <button type="button" onClick={() => decide("granted")} className="btn-primary px-5! py-3!">
              Aceptar
            </button>
            <button type="button" onClick={() => decide("denied")} className="btn-secondary-dark px-5! py-3!">
              Rechazar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
