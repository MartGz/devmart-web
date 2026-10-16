import "server-only";
import { Secret, TOTP } from "otpauth";

/** Verifica un código de 6 dígitos de la app de autenticación (acepta ±30 s de desfase). */
export function verifyTotp(secretBase32: string, code: string): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const totp = new TOTP({ secret: Secret.fromBase32(secretBase32), digits: 6, period: 30, algorithm: "SHA1" });
  return totp.validate({ token: code, window: 1 }) !== null;
}
