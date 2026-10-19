"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { SendHorizontal, X } from "lucide-react";
import { Cube } from "./Cube";
import { SocialIcon } from "./SocialIcon";
import { responder, saludo, sugerencias, type Respuesta } from "@/lib/asistente";
import { whatsappHref } from "@/lib/site";

type Mensaje = { de: "bot" | "tu"; r: Respuesta; id: number };

let siguienteId = 1;

/** Botón flotante con el cubo de DevMart que abre un asistente para dudas rápidas. */
export function Asistente() {
  const [abierto, setAbierto] = useState(false);
  const [visto, setVisto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([{ de: "bot", r: saludo, id: 0 }]);
  const [texto, setTexto] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "end" });
  }, [mensajes, escribiendo]);

  function preguntar(pregunta: string) {
    const limpia = pregunta.trim().slice(0, 300);
    if (!limpia || escribiendo) return;
    setMensajes((m) => [...m, { de: "tu", r: { texto: limpia }, id: siguienteId++ }]);
    setTexto("");
    setEscribiendo(true);
    // Una pausa corta para que la respuesta no aparezca de golpe.
    setTimeout(() => {
      setMensajes((m) => [...m, { de: "bot", r: responder(limpia), id: siguienteId++ }]);
      setEscribiendo(false);
    }, 450);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    preguntar(texto);
  }

  function abrir() {
    setAbierto((v) => !v);
    setVisto(true);
  }

  const soloSaludo = mensajes.length === 1;

  return (
    <>
      {abierto && (
        <div
          id="asistente"
          role="dialog"
          aria-label="Asistente de DevMart"
          className="fixed inset-x-3 bottom-[calc(92px+env(safe-area-inset-bottom))] z-40 flex max-h-[min(560px,calc(100dvh-120px))] flex-col overflow-hidden rounded-[22px] bg-blanco shadow-[0_24px_60px_rgba(11,13,18,0.18)] sm:inset-x-auto sm:right-8 sm:bottom-[108px] sm:w-[380px]"
        >
          <div className="flex items-center gap-3 bg-noche py-4 pr-3 pl-[18px] text-nube">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#161B25]">
              <Cube size={20} variant="dark" />
            </span>
            <span className="flex flex-1 flex-col gap-[3px]">
              <span className="font-display text-[15px] font-bold tracking-[-0.04em]">Asistente DevMart</span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-niebla uppercase">Respuestas automáticas</span>
            </span>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar asistente"
              className="flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
            >
              <X size={18} strokeWidth={1.5} aria-hidden />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-nube p-[18px]" aria-live="polite">
            {mensajes.map((m) => (
              <Burbuja key={m.id} m={m} onNavegar={() => setAbierto(false)} />
            ))}
            {soloSaludo && (
              <div className="flex flex-wrap gap-2">
                {sugerencias.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => preguntar(s)}
                    className="h-9 rounded-full border border-borde bg-blanco px-3.5 text-[14px] text-noche transition-colors hover:border-noche"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {escribiendo && (
              <span className="flex w-fit gap-1 rounded-2xl rounded-bl-sm border border-borde bg-blanco px-4 py-3" aria-label="Escribiendo">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-niebla" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </span>
            )}
            <div ref={finRef} />
          </div>

          <div className="border-t border-borde bg-blanco px-3 pt-3">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              data-track-whatsapp="asistente-boton"
              aria-label="Escribir a DevMart Solutions por WhatsApp"
              className="flex h-12 items-center justify-center gap-2.5 rounded-xl bg-[#25D366] text-[15px] font-semibold text-noche transition-colors hover:bg-[#1FB955]"
            >
              <SocialIcon red="whatsapp" size={20} />
              Hablar por WhatsApp
            </a>
          </div>
          <form onSubmit={onSubmit} className="flex gap-2 bg-blanco p-3">
            <input
              ref={inputRef}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={300}
              placeholder="Escribe tu pregunta…"
              aria-label="Tu pregunta"
              className="h-11 min-w-0 flex-1 rounded-xl border border-borde px-3.5 text-[15px] text-noche placeholder:text-niebla focus:border-cielo-profundo focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Enviar pregunta"
              disabled={!texto.trim() || escribiendo}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-noche text-blanco transition-colors hover:bg-cielo-profundo disabled:opacity-40"
            >
              <SendHorizontal size={18} strokeWidth={1.5} aria-hidden />
            </button>
          </form>
        </div>
      )}

      {/* Respeta el área segura del móvil (barra de inicio, bordes redondeados). */}
      <div className="fixed right-[calc(1.25rem+env(safe-area-inset-right))] bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 md:right-8 md:bottom-8">
        <div className="flex items-center gap-3">
          {!visto && !abierto && (
            <button
              type="button"
              onClick={abrir}
              className="hidden rounded-full border border-borde bg-blanco px-3.5 py-2 text-[14px] text-noche shadow-[0_8px_24px_rgba(11,13,18,0.08)] sm:block"
            >
              ¿Dudas? Pregúntame
            </button>
          )}
          <button
            type="button"
            onClick={abrir}
            aria-label={abierto ? "Cerrar asistente" : "Abrir asistente de DevMart"}
            aria-expanded={abierto}
            aria-controls="asistente"
            className="group flex h-[60px] w-[60px] items-center justify-center rounded-full border border-white/20 bg-noche shadow-[0_12px_32px_rgba(11,13,18,0.25)] transition-transform duration-150 hover:scale-105 motion-reduce:transition-none"
          >
            {abierto ? (
              <X size={24} strokeWidth={1.5} className="text-blanco" aria-hidden />
            ) : (
              <Cube size={26} variant="dark" className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

function Burbuja({ m, onNavegar }: { m: Mensaje; onNavegar: () => void }) {
  if (m.de === "tu") {
    return (
      <p className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-cielo px-3.5 py-3 text-[15px] leading-[1.5] text-noche">{m.r.texto}</p>
    );
  }
  return (
    <div className="flex max-w-[88%] flex-col gap-2.5 self-start rounded-2xl rounded-bl-sm border border-borde bg-blanco px-3.5 py-3 text-[15px] leading-[1.5] text-noche">
      <p>{m.r.texto}</p>
      {m.r.enlaces && m.r.enlaces.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {m.r.enlaces.map((e) =>
            e.externo ? (
              <a
                key={e.href}
                href={e.href}
                target={e.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                {...(e.href.includes("wa.me") ? { "data-track-whatsapp": "asistente" } : {})}
                className="font-medium text-cielo-profundo hover:text-noche"
              >
                {e.label} →
              </a>
            ) : (
              <Link key={e.href} href={e.href} onClick={onNavegar} className="font-medium text-cielo-profundo hover:text-noche">
                {e.label} →
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
