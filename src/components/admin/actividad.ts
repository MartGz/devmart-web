const descripciones: Record<string, string> = {
  login: "Inicio de sesión",
  logout: "Cierre de sesión",
  "login.fallido": "Intento de acceso fallido",
  "login.bloqueado": "Acceso bloqueado por demasiados intentos",
  "mensaje.actualizado": "Mensaje actualizado",
  "mensaje.eliminado": "Mensaje eliminado",
  "post.creado": "Artículo creado",
  "post.editado": "Artículo editado",
  "post.eliminado": "Artículo eliminado",
  "proyecto.creado": "Proyecto creado",
  "proyecto.editado": "Proyecto editado",
  "proyecto.eliminado": "Proyecto eliminado",
  "precio.creado": "Precio creado",
  "precio.editado": "Precio editado",
  "precio.eliminado": "Precio eliminado",
};

export function describirAccion(accion: string) {
  return descripciones[accion] ?? accion;
}

export function esAlerta(accion: string) {
  return accion === "login.fallido" || accion === "login.bloqueado";
}
