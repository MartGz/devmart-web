"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { crearSolicitud, type PortalState } from "../../actions";
import { AvisoPortal, inputPortal } from "@/components/portal/TarjetaAcceso";

export function NuevaSolicitud({ obraId }: { obraId: number }) {
  const [state, action, pending] = useActionState<PortalState, FormData>(crearSolicitud, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <h2 className="font-medium">Nueva solicitud</h2>
      {state.error && <AvisoPortal tono="error">{state.error}</AvisoPortal>}
      {state.ok && <AvisoPortal>{state.message}</AvisoPortal>}
      <input type="hidden" name="obraId" value={obraId} />
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Título
        <input name="titulo" required minLength={4} maxLength={120} placeholder="p. ej. Cambiar el texto de la portada" className={inputPortal} />
      </label>
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Detalle
        <textarea name="detalle" rows={4} required minLength={10} maxLength={4000} className={`${inputPortal} resize-y leading-[1.55]`} />
      </label>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-70 sm:w-fit">
        {pending ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden /> : <Send size={18} strokeWidth={1.5} aria-hidden />}
        {pending ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
