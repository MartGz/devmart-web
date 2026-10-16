// Configura el acceso al panel /admin:
//   - genera una contraseña segura y guarda solo su hash (scrypt),
//   - genera el secreto de la app de autenticación (2FA) y muestra el código QR,
//   - genera SESSION_SECRET para firmar las sesiones,
//   - lo guarda en .env.local y en las variables de entorno de Vercel (producción y preview).
//
// Uso:  npm run admin:setup -- --email tu@correo.com
//       Opciones: --local (solo .env.local, no toca Vercel) · --sin-2fa (sin código de verificación)
//
// Ejecutarlo otra vez cambia la contraseña y cierra todas las sesiones abiertas.
import { execSync, spawnSync } from "node:child_process";
import { randomBytes, randomInt, scryptSync } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { Secret, TOTP } from "otpauth";
import qrcode from "qrcode-terminal";

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(name);
const option = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

function gitEmail() {
  try {
    return execSync("git config user.email", { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

const email = (option("--email") || gitEmail()).trim().toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Indica tu email: npm run admin:setup -- --email tu@correo.com");
  process.exit(1);
}

// Contraseña: 4 bloques de 5 caracteres sin letras ambiguas (≈ 115 bits).
const alfabeto = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const password = Array.from({ length: 4 }, () =>
  Array.from({ length: 5 }, () => alfabeto[randomInt(alfabeto.length)]).join(""),
).join("-");

const N = 32768, r = 8, p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 32, { N, r, p, maxmem: 128 * 1024 * 1024 });
const passwordHash = ["scrypt", N, r, p, salt.toString("base64"), hash.toString("base64")].join(".");

const sessionSecret = randomBytes(48).toString("base64url");
const totpSecret = flag("--sin-2fa") ? "" : new Secret({ size: 20 }).base32;

const vars: Record<string, string> = {
  ADMIN_EMAIL: email,
  ADMIN_PASSWORD_HASH: passwordHash,
  SESSION_SECRET: sessionSecret,
  ADMIN_TOTP_SECRET: totpSecret,
};

// .env.local (desarrollo)
const envPath = ".env.local";
let env = existsSync(envPath) ? readFileSync(envPath, "utf8") : "";
for (const [k, v] of Object.entries(vars)) {
  const line = `${k}="${v}"`;
  const re = new RegExp(`^${k}=.*$`, "m");
  env = re.test(env) ? env.replace(re, line) : `${env.replace(/\n?$/, "\n")}${line}\n`;
}
writeFileSync(envPath, env);
console.log("✓ Guardado en .env.local");

// Vercel (producción y preview)
if (!flag("--local")) {
  for (const target of ["production", "preview"]) {
    for (const [k, v] of Object.entries(vars)) {
      if (!v) {
        spawnSync("vercel", ["env", "rm", k, target, "--yes"], { stdio: "ignore", shell: true });
        continue;
      }
      const res = spawnSync("vercel", ["env", "add", k, target, "--force", "--sensitive", "--yes"], {
        input: v,
        encoding: "utf8",
        shell: true,
      });
      if (res.status !== 0) {
        console.error(`✗ No se pudo guardar ${k} en Vercel (${target}):\n${res.stderr || res.stdout}`);
        process.exit(1);
      }
    }
    console.log(`✓ Guardado en Vercel (${target})`);
  }
}

console.log("\n────────────────────────────────────────────");
console.log(" Acceso al panel /admin");
console.log("────────────────────────────────────────────");
console.log(` Email:       ${email}`);
console.log(` Contraseña:  ${password}`);
console.log("\n Guárdala ahora en tu gestor de contraseñas: no se vuelve a mostrar.");

if (totpSecret) {
  const uri = new TOTP({ issuer: "DevMart Solutions", label: email, secret: Secret.fromBase32(totpSecret) }).toString();
  console.log("\n Verificación en dos pasos: escanea este código con Google Authenticator,");
  console.log(" Microsoft Authenticator o 1Password.\n");
  qrcode.generate(uri, { small: true });
  console.log(` ¿No puedes escanearlo? Escribe esta clave en la app: ${totpSecret}`);
}

console.log(
  flag("--local")
    ? "\n Listo para desarrollo: reinicia `npm run dev`."
    : "\n Último paso: vuelve a desplegar para que tome efecto (git push o `vercel deploy --prod`).",
);
