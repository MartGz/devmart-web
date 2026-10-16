import "server-only";
import { redirect } from "next/navigation";
import { readSession } from "./session";

/**
 * Capa de acceso: cada página y cada server action del panel la llama antes de tocar datos.
 * proxy.ts solo hace una comprobación optimista de la cookie.
 */
export async function requireAdmin() {
  if (!(await readSession())) redirect("/admin/login");
}
