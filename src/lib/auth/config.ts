import "server-only";

/** Configuración del acceso al panel (ver `npm run admin:setup`). */
export function adminConfig() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const sessionSecret = process.env.SESSION_SECRET ?? "";
  const totpSecret = process.env.ADMIN_TOTP_SECRET ?? "";
  return {
    email,
    passwordHash,
    sessionSecret,
    totpSecret,
    ready: Boolean(email && passwordHash.startsWith("scrypt.") && sessionSecret.length >= 32),
  };
}
