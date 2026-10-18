"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { iniciarSesion, type LoginState } from "./actions";
import { inputCls } from "./Tarjeta";

export function LoginForm({ conTotp }: { conTotp: boolean }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(iniciarSesion, {});
  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && (
        <p role="alert" className="rounded-xl border border-[#C2410C]/30 bg-[#FFF4ED] px-4 py-3 text-[15px] text-[#9A3412]">
          {state.error}
        </p>
      )}
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Email
        <input name="email" type="email" autoComplete="username" required className={inputCls} />
      </label>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
          Contraseña
          <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
        </label>
        <Link href="/admin/login/recuperar" className="w-fit text-[14px] text-cielo-profundo hover:text-noche">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      {conTotp && (
        <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
          Código de verificación
          <input
            name="codigo"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9 ]{6,7}"
            maxLength={7}
            required
            placeholder="123 456"
            className={`${inputCls} font-mono tracking-[0.2em]`}
          />
          <span className="text-[13px] font-normal text-pizarra">El de tu app de autenticación (Google Authenticator, 1Password…).</span>
        </label>
      )}
      <button type="submit" disabled={pending} className="btn-primary mt-2 w-full disabled:opacity-70">
        {pending ? <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden /> : <LockKeyhole size={18} strokeWidth={1.5} aria-hidden />}
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
