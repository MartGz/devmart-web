import "server-only";
import { scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Hash de contraseña con scrypt (node:crypto). Formato: scrypt.N.r.p.salt.hash (base64).
// Se usa «.» como separador porque «$» se expandiría como variable en los archivos .env.
// El hash lo genera `npm run admin:setup` y se guarda en ADMIN_PASSWORD_HASH.

function derive(password: string, salt: Buffer, keylen: number, opts: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, keylen, { ...opts, maxmem: 128 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, saltB64, hashB64] = stored.split(".");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await derive(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
