"use client";

import { CONSENT_KEY, CONSENT_RESET_EVENT } from "@/lib/analytics";

/** Vuelve a mostrar el aviso de cookies para cambiar la decisión. */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="btn-secondary w-fit"
      onClick={() => {
        try {
          localStorage.removeItem(CONSENT_KEY);
        } catch {}
        window.dispatchEvent(new Event(CONSENT_RESET_EVENT));
      }}
    >
      Cambiar mis preferencias de cookies
    </button>
  );
}
