// Validación compartida por el formulario (cliente) y la server action (servidor).
import { presupuestos, tiposProyecto } from "./content";

export type ContactoData = {
  nombre: string;
  email: string;
  telefono: string;
  tipo: string;
  presupuesto: string;
  descripcion: string;
  datos: boolean;
};

export type ContactoErrors = Partial<Record<keyof ContactoData, string>>;

export type ContactoState =
  | { status: "idle" }
  | { status: "error"; errors: ContactoErrors; message?: string; values: Partial<ContactoData> }
  | { status: "success" };

export function readContacto(fd: FormData): ContactoData {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  return {
    nombre: s("nombre"),
    email: s("email"),
    telefono: s("telefono"),
    tipo: s("tipo"),
    presupuesto: s("presupuesto"),
    descripcion: s("descripcion"),
    datos: fd.get("datos") === "on",
  };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContacto(d: ContactoData): ContactoErrors {
  const e: ContactoErrors = {};
  if (d.nombre.length < 2) e.nombre = "Escribe tu nombre.";
  else if (d.nombre.length > 100) e.nombre = "El nombre es demasiado largo.";

  if (!EMAIL.test(d.email)) e.email = "Escribe un email válido.";

  const digits = d.telefono.replace(/\D/g, "");
  if (!digits) e.telefono = "Escribe un teléfono de contacto.";
  else if (digits.length < 7 || digits.length > 15) e.telefono = "Revisa el número de teléfono.";

  if (!(tiposProyecto as readonly string[]).includes(d.tipo)) e.tipo = "Elige un tipo de proyecto.";
  if (!(presupuestos as readonly string[]).includes(d.presupuesto))
    e.presupuesto = "Elige un presupuesto aproximado.";

  if (d.descripcion.length < 20) e.descripcion = "Cuéntanos un poco más (mínimo 20 caracteres).";
  else if (d.descripcion.length > 3000) e.descripcion = "La descripción es demasiado larga (máximo 3000 caracteres).";

  if (!d.datos) e.datos = "Necesitamos tu autorización para responderte.";
  return e;
}
