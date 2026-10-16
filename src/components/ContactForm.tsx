"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { enviarContacto } from "@/app/contacto/actions";
import { track } from "@/lib/analytics";
import { presupuestos, tiposProyecto } from "@/lib/content";
import { readContacto, validateContacto, type ContactoErrors, type ContactoState } from "@/lib/contacto";

const inputCls =
  "w-full rounded-xl border border-borde bg-blanco px-4 py-3.5 text-[16px] text-noche placeholder:text-niebla transition-colors hover:border-niebla focus:border-cielo-profundo focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-[#C2410C]";

function Field({
  id,
  label,
  error,
  children,
  hint,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium text-noche">
        {label}
        {hint && <span className="font-normal text-pizarra"> · {hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[#C2410C]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Lee ?tipo= y ?idea= (desde Precios y el cotizador) para rellenar el formulario. */
export function ContactFormWithParams() {
  const params = useSearchParams();
  return (
    <ContactForm
      defaultTipo={params.get("tipo") ?? undefined}
      defaultIdea={params.get("idea")?.slice(0, 2000) ?? undefined}
    />
  );
}

export function ContactForm({ defaultTipo, defaultIdea }: { defaultTipo?: string; defaultIdea?: string }) {
  const [state, formAction, pending] = useActionState<ContactoState, FormData>(enviarContacto, {
    status: "idle",
  });
  const [clientErrors, setClientErrors] = useState<ContactoErrors>({});
  const [tipoEnviado, setTipoEnviado] = useState("");

  useEffect(() => {
    if (state.status === "success") track("contact_submit", { tipo: tipoEnviado });
  }, [state.status, tipoEnviado]);

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-5 rounded-card bg-cielo-tinte p-8 md:p-12">
        <CheckCircle2 size={36} strokeWidth={1.5} className="text-cielo-profundo" aria-hidden />
        <h2 className="h2-dm">¡Recibimos tu mensaje!</h2>
        <p className="max-w-[460px] text-[17px] leading-[1.55] text-texto-cuerpo">
          Gracias por contarnos tu idea. Te respondemos pronto al email o
          teléfono que dejaste.
        </p>
        <Link href="/proyectos" className="btn-secondary">
          Mientras tanto, mira nuestros proyectos
        </Link>
      </div>
    );
  }

  const serverErrors = state.status === "error" ? state.errors : {};
  const errors = { ...serverErrors, ...clientErrors };
  const values = state.status === "error" ? state.values : {};
  const tipoInicial =
    values.tipo ?? (tiposProyecto as readonly string[]).find((t) => t === defaultTipo) ?? "";

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const data = readContacto(new FormData(e.currentTarget));
    const errs = validateContacto(data);
    setClientErrors(errs);
    setTipoEnviado(data.tipo);
    if (Object.keys(errs).length > 0) {
      e.preventDefault();
      const first = Object.keys(errs)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  const a11y = (name: keyof ContactoErrors) =>
    errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` }
      : { "aria-invalid": false as const };

  return (
    <form action={formAction} onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl border border-[#C2410C]/30 bg-[#FFF4ED] px-4 py-3 text-[15px] text-[#9A3412]">
          {state.message}
        </p>
      )}

      {/* Campo trampa para bots: oculto para personas */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          No llenar
          <input type="text" name="empresa_web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="nombre" label="Nombre" error={errors.nombre}>
          <input id="nombre" name="nombre" autoComplete="name" defaultValue={values.nombre} className={inputCls} {...a11y("nombre")} />
        </Field>
        <Field id="email" label="Email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" defaultValue={values.email} className={inputCls} {...a11y("email")} />
        </Field>
        <Field id="telefono" label="Teléfono / WhatsApp" error={errors.telefono}>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" placeholder="300 000 0000" defaultValue={values.telefono} className={inputCls} {...a11y("telefono")} />
        </Field>
        <Field id="tipo" label="Tipo de proyecto" error={errors.tipo}>
          <select id="tipo" name="tipo" defaultValue={tipoInicial} className={inputCls} {...a11y("tipo")}>
            <option value="" disabled>
              Elige una opción
            </option>
            {tiposProyecto.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="presupuesto" label="Presupuesto aproximado" error={errors.presupuesto}>
        <select id="presupuesto" name="presupuesto" defaultValue={values.presupuesto ?? ""} className={inputCls} {...a11y("presupuesto")}>
          <option value="" disabled>
            Elige una opción
          </option>
          {presupuestos.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </Field>

      <Field id="descripcion" label="Cuéntanos tu idea" error={errors.descripcion}>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={6}
          placeholder="¿Qué quieres construir? ¿Para quién? ¿Tienes alguna fecha en mente?"
          defaultValue={values.descripcion ?? defaultIdea}
          className={`${inputCls} resize-y`}
          {...a11y("descripcion")}
        />
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-start gap-3 text-[15px] leading-[1.5] text-texto-cuerpo">
          <input
            type="checkbox"
            name="datos"
            defaultChecked={values.datos}
            className="mt-1 h-[18px] w-[18px] shrink-0 accent-cielo-profundo"
            {...a11y("datos")}
          />
          <span>
            Autorizo a DevMart Solutions a tratar mis datos personales para responder a mi solicitud,
            según la{" "}
            <a href="#datos" className="text-cielo-profundo underline underline-offset-4 hover:text-noche">
              política de tratamiento de datos
            </a>{" "}
            (Ley 1581 de 2012).
          </span>
        </label>
        {errors.datos && (
          <p id="datos-error" className="text-sm text-[#C2410C]">
            {errors.datos}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-70 sm:w-fit">
        {pending && <Loader2 size={18} strokeWidth={1.5} className="animate-spin" aria-hidden />}
        {pending ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
