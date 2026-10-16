"use server";

import { redirect } from "next/navigation";
import { adminConfig } from "@/lib/auth/config";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { verifyTotp } from "@/lib/auth/totp";
import { esBot } from "@/lib/botid";
import { huellaCliente, permitir, registrar, reiniciar } from "@/lib/security";

export type LoginState = { error?: string };

// Hash de relleno para que un email incorrecto tarde lo mismo que una contraseña incorrecta.
const DUMMY_HASH = "scrypt.32768.8.1.AAAAAAAAAAAAAAAAAAAAAA==.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const GENERICO = "Email, contraseña o código incorrectos.";

export async function iniciarSesion(_prev: LoginState, fd: FormData): Promise<LoginState> {
  const cfg = adminConfig();
  if (!cfg.ready) return { error: "El panel aún no está configurado. Ejecuta npm run admin:setup." };

  if (await esBot()) return { error: "No pudimos verificar tu navegador. Inténtalo de nuevo." };

  // Máximo 5 intentos cada 15 minutos por conexión y 30 en total, contra fuerza bruta distribuida.
  const huella = await huellaCliente();
  const porCliente = `login:${huella}`;
  if (!(await permitir(porCliente, 5, 900)) || !(await permitir("login:global", 30, 900))) {
    await registrar("login.bloqueado", huella);
    return { error: "Demasiados intentos. Espera 15 minutos antes de volver a intentarlo." };
  }

  const email = String(fd.get("email") ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(fd.get("password") ?? "").slice(0, 200);
  const codigo = String(fd.get("codigo") ?? "").replace(/\s/g, "");

  const emailOk = email === cfg.email;
  const passwordOk = await verifyPassword(password, emailOk ? cfg.passwordHash : DUMMY_HASH);
  const totpOk = !cfg.totpSecret || verifyTotp(cfg.totpSecret, codigo);

  if (!(emailOk && passwordOk && totpOk)) {
    await registrar("login.fallido", huella);
    return { error: GENERICO };
  }

  await reiniciar(porCliente);
  await createSession();
  await registrar("login", huella);
  redirect("/admin");
}
