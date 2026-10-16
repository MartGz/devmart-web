import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { adminConfig } from "@/lib/auth/config";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  const cfg = adminConfig();
  return (
    <main className="flex min-h-screen items-center justify-center bg-nube px-4 py-16">
      <div className="flex w-full max-w-[420px] flex-col gap-8 rounded-card bg-blanco p-8 shadow-elevada md:p-10">
        <Logo cubeSize={24} wordmarkSize={18} gap={10} />
        <div className="flex flex-col gap-2">
          <h1 className="h3-dm">Panel de administración</h1>
          <p className="text-[15px] leading-[1.55] text-pizarra">Acceso solo para el equipo de DevMart.</p>
        </div>
        {cfg.ready ? (
          <LoginForm conTotp={Boolean(cfg.totpSecret)} />
        ) : (
          <p className="rounded-xl bg-cielo-tinte px-4 py-3 text-[15px] leading-[1.55] text-noche">
            El panel aún no está configurado. Ejecuta <code className="font-mono">npm run admin:setup</code> y vuelve a desplegar.
          </p>
        )}
      </div>
    </main>
  );
}
