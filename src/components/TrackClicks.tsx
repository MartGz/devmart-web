"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Registra los clics en enlaces marcados con data-track-whatsapp="<ubicación>".
 * Así los enlaces pueden seguir siendo componentes de servidor.
 */
export function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track-whatsapp]");
      if (el) track("whatsapp_click", { ubicacion: el.dataset.trackWhatsapp ?? "" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
