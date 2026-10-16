"use client";

import { startTransition, useActionState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { FormState } from "@/lib/admin/actions";

/** Formulario del panel: muestra errores de validación y el resultado de guardar. */
export function AdminForm({
  action,
  children,
  submitLabel = "Guardar",
  className = "",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, dispatch, pending] = useActionState<FormState, FormData>(action, {});

  // Se envía a mano (y no con <form action>) para que React no vacíe los campos al terminar:
  // si hay un error de validación, lo escrito se conserva.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  }

  return (
    <form onSubmit={onSubmit} className={`flex flex-col gap-6 ${className}`}>
      {state.errors && state.errors.length > 0 && (
        <ul
          role="alert"
          className="flex flex-col gap-1 rounded-xl border border-[#C2410C]/30 bg-[#FFF4ED] px-4 py-3 text-[15px] text-[#9A3412]"
        >
          {state.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      {children}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary px-6! py-3! disabled:opacity-70">
          {pending && <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden />}
          {pending ? "Guardando…" : submitLabel}
        </button>
        {state.ok && state.message && !pending && (
          <span role="status" className="inline-flex items-center gap-2 text-[15px] text-cielo-profundo">
            <CheckCircle2 size={18} strokeWidth={1.5} aria-hidden /> {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
