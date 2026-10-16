// Compartido por proxy.ts y la capa de sesión (sin dependencias de servidor).

/** En producción el prefijo __Host- obliga a HTTPS, path=/ y sin dominio. */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-dm_admin" : "dm_admin";

/** Duración de la sesión del panel. */
export const SESSION_HOURS = 8;
