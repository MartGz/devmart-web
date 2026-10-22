// Compartido por proxy.ts y la capa de sesión (sin dependencias de servidor).

/** En producción el prefijo __Host- obliga a HTTPS, path=/ y sin dominio. */
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-dm_admin" : "dm_admin";

/** Duración de la sesión del panel. */
export const SESSION_HOURS = 8;

/** Cookie del portal de clientes: distinta de la del panel y sellada con otra clave. */
export const CLIENTE_COOKIE = process.env.NODE_ENV === "production" ? "__Host-dm_cliente" : "dm_cliente";

/** Duración de la sesión del portal. */
export const CLIENTE_SESION_DIAS = 7;
