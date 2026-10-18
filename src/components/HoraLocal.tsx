"use client";

import { useEffect, useState } from "react";

const formato = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });

/** Hora actual en Cartagena. Se pinta tras montar para no desajustar la hidratación. */
export function HoraLocal({ className }: { className?: string }) {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setHora(formato.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <time className={className} suppressHydrationWarning>
      {hora ?? "--:--"}
    </time>
  );
}
