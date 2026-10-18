import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { credenciales } from "@/lib/auth/config";
import { LoginForm } from "./LoginForm";
import { Aviso, Tarjeta } from "./Tarjeta";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <Tarjeta titulo="Panel de administración" intro="Acceso solo para el equipo de DevMart.">
      <Suspense fallback={<div className="h-80 animate-pulse rounded-xl bg-nube" aria-label="Cargando" />}>
        <Acceso searchParams={searchParams} />
      </Suspense>
    </Tarjeta>
  );
}

async function Acceso({ searchParams }: Pick<PageProps<"/admin/login">, "searchParams">) {
  const [cfg, params] = await Promise.all([credenciales(), searchParams]);
  if (!cfg.base) {
    return (
      <Aviso>
        El panel aún no está configurado. Ejecuta <code className="font-mono">npm run admin:setup</code> y vuelve a desplegar.
      </Aviso>
    );
  }
  if (!cfg.ready) {
    return (
      <div className="flex flex-col gap-5">
        <Aviso>Todavía no hay contraseña. Te enviamos un enlace a tu correo para crearla.</Aviso>
        <Link href="/admin/login/recuperar" className="btn-primary w-full">
          Crear mi contraseña
        </Link>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {params.listo === "1" && <Aviso tono="ok">Listo: tu contraseña nueva ya funciona. Entra con ella y el código de tu app.</Aviso>}
      <LoginForm conTotp={Boolean(cfg.totpSecret)} />
    </div>
  );
}
