import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { accesoVigente } from "@/lib/auth/cliente";
import { AvisoPortal, TarjetaAcceso } from "@/components/portal/TarjetaAcceso";
import { EntrarForm } from "./EntrarForm";

export const metadata: Metadata = { title: "Entrar", referrer: "no-referrer" };

// El enlace del correo abre esta pantalla y el acceso se usa con un clic (POST): así los
// antivirus de correo que abren los enlaces por su cuenta no lo gastan.
export default function AccesoPage({ searchParams }: PageProps<"/portal/acceso">) {
  return (
    <TarjetaAcceso titulo="Bienvenido" intro="Tu enlace está listo. Entra a ver el avance de tu proyecto.">
      <Suspense fallback={<div className="h-14 animate-pulse rounded-full bg-nube" aria-label="Cargando" />}>
        <Entrada searchParams={searchParams} />
      </Suspense>
    </TarjetaAcceso>
  );
}

async function Entrada({ searchParams }: Pick<PageProps<"/portal/acceso">, "searchParams">) {
  const { token } = await searchParams;
  const t = typeof token === "string" ? token : "";
  if (!(await accesoVigente(t))) {
    return (
      <div className="flex flex-col gap-5">
        <AvisoPortal tono="error">El enlace venció o ya se usó.</AvisoPortal>
        <Link href="/portal/ingreso" className="btn-primary w-full">
          Pedir un enlace nuevo
        </Link>
      </div>
    );
  }
  return <EntrarForm token={t} />;
}
