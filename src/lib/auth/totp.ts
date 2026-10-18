import "server-only";
import { Secret, TOTP } from "otpauth";
import QRCode from "qrcode";

/** Verifica un código de 6 dígitos de la app de autenticación (acepta ±30 s de desfase). */
export function verifyTotp(secretBase32: string, code: string): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const totp = new TOTP({ secret: Secret.fromBase32(secretBase32), digits: 6, period: 30, algorithm: "SHA1" });
  return totp.validate({ token: code, window: 1 }) !== null;
}

/** Secreto nuevo para la app de autenticación (base32). */
export function nuevoSecretoTotp() {
  return new Secret({ size: 20 }).base32;
}

export function esSecretoTotp(s: string) {
  return /^[A-Z2-7]{32}$/.test(s);
}

/** Código QR (SVG) que la app de autenticación escanea. */
export async function qrTotp(secretBase32: string, email: string) {
  const uri = new TOTP({
    issuer: "DevMart",
    label: email || "admin",
    secret: Secret.fromBase32(secretBase32),
    digits: 6,
    period: 30,
    algorithm: "SHA1",
  }).toString();
  return QRCode.toString(uri, { type: "svg", margin: 1, color: { dark: "#0B0D12", light: "#FFFFFF" } });
}
