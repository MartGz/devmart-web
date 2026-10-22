"use client";

import { useActionState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { entrarConEnlace, type PortalState } from "../actions";
import { AvisoPortal } from "@/components/portal/TarjetaAcceso";

export function EntrarForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<PortalState, FormData>(entrarConEnlace, {});
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <AvisoPortal tono="error">{state.error}</AvisoPortal>}
      <input type="hidden" name="token" value={token} />
      <button type="submit" disabled={pending} autoFocus className="btn-primary w-full disabled:opacity-70">
        {pending ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden /> : null}
        {pending ? "Entrando…" : "Entrar a mi portal"}
        {!pending && <ArrowRight size={18} strokeWidth={1.5} aria-hidden />}
      </button>
    </form>
  );
}
