"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { complejidad, funcionalidades, plazos, tamanos, tiposCotizador } from "@/lib/cotizador";
import { whatsappHref } from "@/lib/site";
import { Label } from "./ui";

const optionCls =
  "flex cursor-pointer items-start gap-3 rounded-xl border border-borde bg-blanco px-4 py-3.5 text-[15px] leading-[1.4] text-texto-cuerpo transition-colors hover:border-niebla has-checked:border-cielo-profundo has-checked:bg-cielo-tinte has-checked:text-noche has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-cielo-profundo";
const inputCls = "mt-0.5 h-[18px] w-[18px] shrink-0 accent-cielo-profundo";

function Paso({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 flex items-baseline gap-3">
        <span className="font-mono text-xs text-cielo-profundo">{String(n).padStart(2, "0")}</span>
        <span className="h3-dm">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export function Cotizador() {
  const [tipoId, setTipoId] = useState("");
  const [extras, setExtras] = useState<string[]>([]);
  const [tamanoId, setTamanoId] = useState<string>("mediano");
  const [plazoId, setPlazoId] = useState<string>("normal");

  const tipo = tiposCotizador.find((t) => t.id === tipoId);
  const tamano = tamanos.find((t) => t.id === tamanoId)!;
  const plazo = plazos.find((p) => p.id === plazoId)!;
  const elegidas = funcionalidades.filter((f) => extras.includes(f.id));
  const puntos = (tipo?.puntos ?? 0) + tamano.puntos + elegidas.reduce((s, f) => s + f.puntos, 0);
  const nivel = complejidad(puntos);

  const resumen = tipo
    ? [
        `Tipo de proyecto: ${tipo.label}`,
        `Tamaño: ${tamano.label} (${tamano.detalle.toLowerCase()})`,
        `Funcionalidades: ${elegidas.length ? elegidas.map((f) => f.label).join(", ") : "ninguna adicional"}`,
        `Plazo: ${plazo.label}`,
        `Complejidad estimada: ${nivel.nivel}`,
      ].join("\n")
    : "";

  function toggle(id: string) {
    setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));
  }

  const formHref = tipo
    ? `/contacto?tipo=${encodeURIComponent(tipo.tipoFormulario)}&idea=${encodeURIComponent(`${resumen}\n\nMi idea: `)}`
    : "/contacto";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-12">
        <Paso n={1} title="¿Qué quieres construir?">
          <div className="grid gap-3 sm:grid-cols-2">
            {tiposCotizador.map((t) => (
              <label key={t.id} className={optionCls}>
                <input
                  type="radio"
                  name="cotizador-tipo"
                  value={t.id}
                  checked={tipoId === t.id}
                  onChange={() => setTipoId(t.id)}
                  className={inputCls}
                />
                {t.label}
              </label>
            ))}
          </div>
        </Paso>

        <Paso n={2} title="¿Qué tamaño tiene?">
          <div className="grid gap-3 sm:grid-cols-3">
            {tamanos.map((t) => (
              <label key={t.id} className={optionCls}>
                <input
                  type="radio"
                  name="cotizador-tamano"
                  value={t.id}
                  checked={tamanoId === t.id}
                  onChange={() => setTamanoId(t.id)}
                  className={inputCls}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium text-noche">{t.label}</span>
                  <span className="text-[14px] text-pizarra">{t.detalle}</span>
                </span>
              </label>
            ))}
          </div>
        </Paso>

        <Paso n={3} title="¿Qué debe hacer?">
          <div className="grid gap-3 sm:grid-cols-2">
            {funcionalidades.map((f) => (
              <label key={f.id} className={optionCls}>
                <input
                  type="checkbox"
                  value={f.id}
                  checked={extras.includes(f.id)}
                  onChange={() => toggle(f.id)}
                  className={inputCls}
                />
                {f.label}
              </label>
            ))}
          </div>
        </Paso>

        <Paso n={4} title="¿Para cuándo lo necesitas?">
          <div className="grid gap-3 sm:grid-cols-3">
            {plazos.map((p) => (
              <label key={p.id} className={optionCls}>
                <input
                  type="radio"
                  name="cotizador-plazo"
                  value={p.id}
                  checked={plazoId === p.id}
                  onChange={() => setPlazoId(p.id)}
                  className={inputCls}
                />
                {p.label}
              </label>
            ))}
          </div>
        </Paso>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div aria-live="polite" className="flex flex-col gap-6 rounded-card bg-noche p-7 text-nube md:p-9">
          <Label className="text-cielo">Tu proyecto</Label>
          {tipo ? (
            <>
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-niebla">Complejidad estimada</span>
                <span className="font-display text-[32px] leading-none font-bold tracking-[-0.045em]">
                  {nivel.nivel}
                </span>
                <p className="text-[15px] leading-[1.55] text-niebla">{nivel.texto}</p>
              </div>
              <dl className="flex flex-col gap-3 border-t border-white/10 pt-6 text-[15px] leading-[1.45]">
                <div className="flex justify-between gap-4">
                  <dt className="text-niebla">Tipo</dt>
                  <dd className="text-right">{tipo.label}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-niebla">Tamaño</dt>
                  <dd className="text-right">{tamano.label}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-niebla">Funcionalidades</dt>
                  <dd className="text-right">{elegidas.length || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-niebla">Plazo</dt>
                  <dd className="text-right">{plazo.label}</dd>
                </div>
              </dl>
              <p className="text-[14px] leading-[1.5] text-niebla">
                El valor lo confirmamos en una cotización cerrada, por etapas, después de una
                primera conversación.
              </p>
              <div className="flex flex-col gap-3">
                <a
                    href={whatsappHref(`Hola DevMart, armé mi proyecto en el cotizador:\n\n${resumen}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("cotizador_enviado", { canal: "whatsapp", tipo: tipo.label, nivel: nivel.nivel })}
                    className="btn-primary w-full"
                  >
                    <MessageCircle size={18} strokeWidth={1.5} aria-hidden /> Enviar por WhatsApp
                  </a>
                <Link
                  href={formHref}
                  onClick={() => track("cotizador_enviado", { canal: "formulario", tipo: tipo.label, nivel: nivel.nivel })}
                  className="btn-secondary-dark w-full"
                >
                  Seguir en el formulario
                </Link>
              </div>
            </>
          ) : (
            <p className="text-[16px] leading-[1.55] text-niebla">
              Elige qué quieres construir y te mostramos un resumen con la complejidad estimada para
              enviárnoslo.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
