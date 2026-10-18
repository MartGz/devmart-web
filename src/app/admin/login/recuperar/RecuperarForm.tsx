"use client";

import { useActionState } from "react";
import { Loader2, Mail } from "lucide-react";
import { solicitarEnlace, type LoginState } from "../actions";
import { Aviso, inputCls } from "../Tarjeta";

export function RecuperarForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(solicitarEnlace, {});
  if (state.ok) return <Aviso tono="ok">{state.message}</Aviso>;
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Aviso tono="error">{state.error}</Aviso>}
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Email
        <input name="email" type="email" autoComplete="username" required className={inputCls} />
      </label>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-70">
        {pending ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden /> : <Mail size={18} strokeWidth={1.5} aria-hidden />}
        {pending ? "Enviando…" : "Enviarme el enlace"}
      </button>
    </form>
  );
}
