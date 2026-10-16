import type { tiposProyecto } from "./content";

// Opciones del cotizador de /precios. No muestra montos: el valor lo confirma DevMart en la
// cotización. Los puntos solo sirven para estimar la complejidad (básico, intermedio, avanzado).

type TipoProyecto = (typeof tiposProyecto)[number];

export type OpcionTipo = { id: string; label: string; tipoFormulario: TipoProyecto; puntos: number };

export const tiposCotizador: OpcionTipo[] = [
  { id: "landing", label: "Landing page", tipoFormulario: "Página web / landing", puntos: 1 },
  { id: "corporativa", label: "Web corporativa", tipoFormulario: "Web corporativa", puntos: 2 },
  { id: "tienda", label: "Tienda en línea", tipoFormulario: "Tienda en línea", puntos: 4 },
  { id: "movil", label: "App móvil", tipoFormulario: "App móvil", puntos: 5 },
  { id: "panel", label: "Panel administrativo", tipoFormulario: "Panel administrativo", puntos: 4 },
  { id: "medida", label: "Software a medida", tipoFormulario: "Software a medida", puntos: 5 },
];

export const funcionalidades = [
  { id: "login", label: "Registro e inicio de sesión de usuarios", puntos: 2 },
  { id: "pagos", label: "Pagos en línea (Wompi, PSE, Nequi…)", puntos: 2 },
  { id: "admin", label: "Panel para administrar contenidos o productos", puntos: 2 },
  { id: "reservas", label: "Reservas o agendamiento", puntos: 2 },
  { id: "blog", label: "Blog o noticias", puntos: 1 },
  { id: "notificaciones", label: "Notificaciones por email o WhatsApp", puntos: 1 },
  { id: "integraciones", label: "Conexión con otros sistemas (facturación, ERP, APIs)", puntos: 3 },
  { id: "idiomas", label: "Varios idiomas", puntos: 1 },
] as const;

export const tamanos = [
  { id: "pequeno", label: "Pequeño", detalle: "Pocas pantallas o secciones", puntos: 0 },
  { id: "mediano", label: "Mediano", detalle: "Entre 5 y 15 pantallas o secciones", puntos: 1 },
  { id: "grande", label: "Grande", detalle: "Muchas pantallas, roles o procesos", puntos: 3 },
] as const;

export const plazos = [
  { id: "flexible", label: "Sin prisa" },
  { id: "normal", label: "En 1 a 3 meses" },
  { id: "urgente", label: "Lo antes posible" },
] as const;

export function complejidad(puntos: number) {
  if (puntos <= 3) return { nivel: "Básico", texto: "Un proyecto acotado que se puede lanzar rápido." };
  if (puntos <= 9) return { nivel: "Intermedio", texto: "Varias piezas que conviene planear por etapas." };
  return { nivel: "Avanzado", texto: "Un producto completo: empezamos con un prototipo y entregas por etapas." };
}
