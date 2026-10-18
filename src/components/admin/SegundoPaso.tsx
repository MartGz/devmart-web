/**
 * Bloque para vincular la app de autenticación: código QR, la clave para escribirla a mano y
 * el campo del código de 6 dígitos que confirma que quedó vinculada.
 */
export function SegundoPaso({ secreto, qr, inputClassName }: { secreto: string; qr: string; inputClassName: string }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-xl border border-borde p-4">
      <legend className="px-1 text-[15px] font-medium text-noche">Verificación en dos pasos</legend>
      <input type="hidden" name="secreto" value={secreto} />
      <p className="text-[14px] leading-[1.55] text-pizarra">
        Escanea este código con Google Authenticator, Microsoft Authenticator o 1Password. Si ya tenías DevMart en la app,
        reemplázalo por este.
      </p>
      {/* SVG generado en el servidor por la librería qrcode a partir del secreto. */}
      <div
        role="img"
        aria-label="Código QR para la app de autenticación"
        className="mx-auto w-44 [&>svg]:h-auto [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: qr }}
      />
      <details className="text-[13px] text-pizarra">
        <summary className="cursor-pointer">¿No puedes escanearlo? Escribe esta clave</summary>
        <code className="mt-2 block font-mono text-[13px] break-all text-noche select-all">{secreto.match(/.{1,4}/g)?.join(" ")}</code>
      </details>
      <label className="flex flex-col gap-2 text-[15px] font-medium text-noche">
        Código de 6 dígitos de la app
        <input
          name="codigo"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
          placeholder="123 456"
          className={`${inputClassName} font-mono tracking-[0.2em]`}
        />
      </label>
    </fieldset>
  );
}
