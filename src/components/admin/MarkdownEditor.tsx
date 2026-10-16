"use client";

import { useState } from "react";
import { Markdown } from "@/components/Markdown";
import { inputCls } from "./fields";

/** Editor del cuerpo de un artículo con vista previa. */
export function MarkdownEditor({ name, defaultValue = "" }: { name: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const tab = "rounded-full px-4 py-2 text-[14px] font-medium transition-colors";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-[14px] font-medium text-noche">
          Contenido{" "}
          <span className="font-normal text-pizarra">· Markdown: ## Subtítulo, **negrita**, - lista, [enlace](https://…)</span>
        </span>
        <div role="tablist" className="flex gap-1 rounded-full bg-nube p-1">
          <button
            type="button"
            role="tab"
            aria-selected={!preview}
            onClick={() => setPreview(false)}
            className={`${tab} ${!preview ? "bg-blanco text-noche" : "text-pizarra"}`}
          >
            Escribir
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={preview}
            onClick={() => setPreview(true)}
            className={`${tab} ${preview ? "bg-blanco text-noche" : "text-pizarra"}`}
          >
            Vista previa
          </button>
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={22}
        hidden={preview}
        className={`${inputCls} resize-y font-mono text-[14px] leading-[1.6]`}
      />
      {preview && (
        <div className="min-h-[300px] rounded-xl border border-borde px-6 py-4">
          {value.trim() ? <Markdown>{value}</Markdown> : <p className="text-pizarra">Nada que mostrar todavía.</p>}
        </div>
      )}
    </div>
  );
}
