"use client";

import { useActionState, useState } from "react";
import { Check, Loader2, MessageSquareText } from "lucide-react";
import { responderEntregable, type PortalState } from "../../actions";
import { AvisoPortal, inputPortal } from "@/components/portal/TarjetaAcceso";

/** Aprobar el entregable o pedir cambios con un comentario. */
export function RespuestaEntregable({ id }: { id: number }) {
  const [state, action, pending] = useActionState<PortalState, FormData>(responderEntregable, {});
  const [cambios, setCambios] = useState(false);

  if (state.ok) return <AvisoPortal>{state.message}</AvisoPortal>;

  return (
    <form action={action} className="flex flex-col gap-3 border-t border-borde pt-4">
      {state.error && <AvisoPortal tono="error">{state.error}</AvisoPortal>}
      <input type="hidden" name="id" value={id} />
      {cambios ? (
        <>
          <input type="hidden" name="decision" value="cambios" />
          <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
            ¿Qué te gustaría cambiar?
            <textarea name="comentario" rows={4} required minLength={5} maxLength={2000} autoFocus className={`${inputPortal} resize-y leading-[1.55]`} />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button type="submit" disabled={pending} className="btn-primary disabled:opacity-70">
              {pending && <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden />}
              Enviar comentarios
            </button>
            <button type="button" onClick={() => setCambios(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="submit" name="decision" value="aprobar" disabled={pending} className="btn-primary disabled:opacity-70">
            {pending ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden /> : <Check size={18} strokeWidth={1.5} aria-hidden />}
            Aprobar
          </button>
          <button type="button" onClick={() => setCambios(true)} className="btn-secondary">
            <MessageSquareText size={18} strokeWidth={1.5} aria-hidden /> Pedir cambios
          </button>
        </div>
      )}
    </form>
  );
}
