import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeader, Cargando, Field, Input, inputCls, Panel } from "@/components/admin/fields";
import { SegundoPaso } from "@/components/admin/SegundoPaso";
import { cambiarPassword, reconfigurarTotp } from "@/lib/admin/actions";
import { credenciales } from "@/lib/auth/config";
import { requireAdmin } from "@/lib/auth/dal";
import { nuevoSecretoTotp, qrTotp } from "@/lib/auth/totp";

export const metadata: Metadata = { title: "Cuenta" };

export default function CuentaPage() {
  return (
    <>
      <AdminHeader
        title="Cuenta"
        intro="Cambia tu contraseña o vuelve a vincular tu app de autenticación. Si algún día la olvidas, usa «¿Olvidaste tu contraseña?» en la pantalla de entrada."
      />
      <Suspense fallback={<Cargando />}>
        <Formularios />
      </Suspense>
    </>
  );
}

async function Formularios() {
  await requireAdmin();
  const cfg = await credenciales();
  const secreto = nuevoSecretoTotp();
  const qr = await qrTotp(secreto, cfg.email);
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <AdminForm action={cambiarPassword} submitLabel="Cambiar contraseña" resetOnSuccess>
        <Panel className="flex flex-col gap-5">
          <h2 className="h3-dm">Contraseña</h2>
          <p className="text-[15px] text-pizarra">
            Entras como <span className="font-medium text-noche">{cfg.email}</span>.
          </p>
          <Field label="Contraseña actual">
            <Input name="actual" type="password" autoComplete="current-password" required maxLength={200} />
          </Field>
          <Field label="Contraseña nueva" hint="mínimo 12 caracteres">
            <Input name="nueva" type="password" autoComplete="new-password" required minLength={12} maxLength={200} />
          </Field>
          <Field label="Repite la contraseña nueva">
            <Input name="confirmacion" type="password" autoComplete="new-password" required minLength={12} maxLength={200} />
          </Field>
          {cfg.totpSecret && (
            <Field label="Código de tu app" hint="6 dígitos">
              <Input
                name="codigo"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9 ]{6,7}"
                maxLength={7}
                required
                className="font-mono tracking-[0.2em]"
              />
            </Field>
          )}
        </Panel>
      </AdminForm>

      <AdminForm action={reconfigurarTotp} submitLabel="Vincular app" resetOnSuccess>
        <Panel className="flex flex-col gap-5">
          <h2 className="h3-dm">App de autenticación</h2>
          <p className="text-[15px] text-pizarra">
            {cfg.totpSecret
              ? "Úsalo si cambiaste de teléfono o borraste la app. El código anterior deja de servir."
              : "Aún no tienes verificación en dos pasos. Actívala: protege el panel aunque alguien sepa tu contraseña."}
          </p>
          <Field label="Contraseña actual">
            <Input name="actual" type="password" autoComplete="current-password" required maxLength={200} />
          </Field>
          <SegundoPaso key={secreto} secreto={secreto} qr={qr} inputClassName={inputCls} />
        </Panel>
      </AdminForm>
    </div>
  );
}
