import type { ComponentProps, ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-borde bg-blanco px-4 py-3 text-[15px] text-noche placeholder:text-niebla transition-colors hover:border-niebla focus:border-cielo-profundo focus:outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-[14px] font-medium text-noche">
      <span>
        {label}
        {hint && <span className="font-normal text-pizarra"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return <textarea {...props} className={`${inputCls} resize-y leading-[1.55] ${props.className ?? ""}`} />;
}

export function Select(props: ComponentProps<"select">) {
  return <select {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Checkbox({ label, ...props }: ComponentProps<"input"> & { label: string }) {
  return (
    <label className="flex items-center gap-3 text-[15px] text-noche">
      <input type="checkbox" {...props} className="h-[18px] w-[18px] accent-cielo-profundo" />
      {label}
    </label>
  );
}

/** Tarjeta blanca del panel. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card bg-blanco p-6 md:p-8 ${className}`}>{children}</div>;
}

/** Cabecera de página del panel. */
export function AdminHeader({ title, intro, children }: { title: string; intro?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-[28px] leading-[1.1] font-bold tracking-[-0.045em] md:text-[34px]">{title}</h1>
        {intro && <p className="max-w-[640px] text-[15px] leading-[1.55] text-pizarra">{intro}</p>}
      </div>
      {children}
    </div>
  );
}

export function Cargando() {
  return <div className="h-64 animate-pulse rounded-card bg-blanco/70" aria-label="Cargando" />;
}

export function fechaHora(d: Date) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(d);
}
