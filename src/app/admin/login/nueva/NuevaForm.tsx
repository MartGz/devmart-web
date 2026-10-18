"use client";

import { useActionState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { establecerPassword, type LoginState } from "../actions";
import { Aviso, inputCls } from "../Tarjeta";
import { SegundoPaso } from "@/components/admin/SegundoPaso";

export function NuevaForm({ token, secreto, qr }: { token: string; secreto: string; qr: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(establecerPassword, {});
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Aviso tono="error">{state.error}</Aviso>}
      <input type="hidden" name="token" value={token} />
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Contraseña nueva
        <input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={200} required className={inputCls} />
        <span className="text-[13px] font-normal text-pizarra">Mínimo 12 caracteres. Una frase larga es fácil de recordar y difícil de adivinar.</span>
      </label>
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Repite la contraseña
        <input name="confirmacion" type="password" autoComplete="new-password" minLength={12} maxLength={200} required className={inputCls} />
      </label>
      <SegundoPaso secreto={secreto} qr={qr} inputClassName={inputCls} />
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-70">
        {pending ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden /> : <KeyRound size={18} strokeWidth={1.5} aria-hidden />}
        {pending ? "Guardando…" : "Guardar y entrar"}
      </button>
    </form>
  );
}
