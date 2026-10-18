// Comprueba si el buzón acepta el usuario y la contraseña SMTP, sin enviar ningún correo.
// Uso:  node scripts/probar-smtp.mjs            (pide la contraseña; no se guarda en ningún sitio)
//       SMTP_USER=otro@devmart.co node scripts/probar-smtp.mjs
import { createInterface } from "node:readline/promises";
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.hostinger.com";
const port = Number(process.env.SMTP_PORT) || 465;
const user = process.env.SMTP_USER || "hola@devmart.co";

const rl = createInterface({ input: process.stdin, output: process.stdout });
const pass = (await rl.question(`Contraseña del buzón ${user}: `)).trim();
rl.close();

try {
  await nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } }).verify();
  console.log(`\n✓ ${host} aceptó la contraseña de ${user}. Pega exactamente esa misma en SMTP_PASS (Vercel).`);
} catch (err) {
  console.error(`\n✗ ${host} rechazó el acceso: ${err.response ?? err.message}`);
  console.error("  Revisa que sea la contraseña del buzón (la del webmail), no la de tu cuenta de Hostinger.");
  process.exitCode = 1;
}
