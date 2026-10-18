"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Botón para copiar el email al portapapeles, con confirmación breve. */
export function CopyEmail({ email, compact = false }: { email: string; compact?: boolean }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(email);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  const Icono = copiado ? Check : Copy;
  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={compact ? (copiado ? "Email copiado" : "Copiar email") : undefined}
      className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] font-medium text-nube transition-colors duration-150 hover:border-nube hover:bg-nube hover:text-noche ${
        compact ? "w-11" : "px-[18px]"
      }`}
    >
      <Icono size={16} strokeWidth={1.5} aria-hidden />
      {!compact && <span aria-live="polite">{copiado ? "Copiado" : "Copiar"}</span>}
    </button>
  );
}
