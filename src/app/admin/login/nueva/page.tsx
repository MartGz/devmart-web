import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { credenciales } from "@/lib/auth/config";
import { tokenValido } from "@/lib/auth/cuenta";
import { nuevoSecretoTotp, qrTotp } from "@/lib/auth/totp";
import { Aviso, Tarjeta } from "../Tarjeta";
import { NuevaForm } from "./NuevaForm";

export const metadata: Metadata = { title: "Nueva contraseña", referrer: "no-referrer" };

export default function NuevaPage({ searchParams }: PageProps<"/admin/login/nueva">) {
  return (
    <Tarjeta
      titulo="Tu nueva contraseña"
      intro="Elige una contraseña y vuelve a vincular tu app de autenticación. Así entras con las dos cosas."
    >
      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-nube" aria-label="Cargando" />}>
        <Formulario searchParams={searchParams} />
      </Suspense>
    </Tarjeta>
  );
}

async function Formulario({ searchParams }: Pick<PageProps<"/admin/login/nueva">, "searchParams">) {
  const { token } = await searchParams;
  const t = typeof token === "string" ? token : "";
  if (!(await tokenValido(t))) {
    return (
      <div className="flex flex-col gap-5">
        <Aviso tono="error">El enlace venció o ya se usó.</Aviso>
        <Link href="/admin/login/recuperar" className="btn-primary w-full">
          Pedir un enlace nuevo
        </Link>
      </div>
    );
  }
  const { email } = await credenciales();
  const secreto = nuevoSecretoTotp();
  return <NuevaForm token={t} secreto={secreto} qr={await qrTotp(secreto, email)} />;
}
