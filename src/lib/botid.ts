import "server-only";
import { checkBotId } from "botid/server";

/**
 * true si Vercel BotID marca la petición como bot. BotID solo funciona desplegado en Vercel:
 * fuera de Vercel (o si falla) no bloquea, y el límite de intentos sigue protegiendo.
 */
export async function esBot(): Promise<boolean> {
  if (!process.env.VERCEL) return false;
  try {
    return (await checkBotId()).isBot;
  } catch (err) {
    console.error("[botid]", err);
    return false;
  }
}
