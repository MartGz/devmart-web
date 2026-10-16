"use client";

import Image from "next/image";
import { useEffect, useState, type ChangeEvent } from "react";
import { Checkbox, Field, Input, inputCls } from "./fields";

const MAX = 4 * 1024 * 1024;

/**
 * Campo de imagen del panel: muestra la actual, previsualiza la nueva y avisa si pesa demasiado.
 * La validación que cuenta es la del servidor (src/lib/admin/imagenes.ts).
 */
export function ImagenField({
  name,
  altName,
  quitarName,
  actual,
  alt,
  label,
  aspect = "aspect-[4/3]",
}: {
  name: string;
  altName: string;
  quitarName: string;
  actual?: string | null;
  alt?: string;
  label: string;
  aspect?: string;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setPreview(null);
    setAviso(null);
    if (!f) return;
    if (f.size > MAX) {
      setAviso("La imagen pesa más de 4 MB: redúcela antes de subirla.");
      e.target.value = "";
      return;
    }
    setPreview(URL.createObjectURL(f));
  }

  const vista = preview ?? actual;

  return (
    <div className="grid gap-5 sm:grid-cols-[240px_1fr]">
      <div className={`relative overflow-hidden rounded-xl border border-borde bg-nube ${aspect}`}>
        {vista ? (
          // La previsualización local es un blob: y no pasa por el optimizador.
          <Image src={vista} alt="" fill sizes="240px" loading="eager" className="object-cover" unoptimized={!!preview} />
        ) : (
          <div className="placeholder-rayado flex h-full items-center justify-center font-mono text-xs text-pizarra">
            sin imagen
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Field label={label} hint="JPG, PNG o WebP · máx. 4 MB">
          {/* key: tras guardar, el campo se vacía para no volver a subir el mismo archivo. */}
          <input
            key={actual ?? "vacio"}
            type="file"
            name={name}
            accept="image/jpeg,image/png,image/webp"
            onChange={onChange}
            className={`${inputCls} file:mr-3 file:rounded-lg file:border-0 file:bg-cielo-tinte file:px-3 file:py-1.5 file:text-[14px] file:text-noche`}
          />
        </Field>
        {aviso && (
          <p role="alert" className="text-[14px] text-[#9A3412]">
            {aviso}
          </p>
        )}
        <Field label="Texto alternativo" hint="qué se ve en la imagen">
          <Input name={altName} defaultValue={alt ?? ""} maxLength={200} placeholder="p. ej. Página de inicio de la tienda en un portátil" />
        </Field>
        {actual && <Checkbox key={actual} name={quitarName} label="Quitar la imagen actual" />}
      </div>
    </div>
  );
}
