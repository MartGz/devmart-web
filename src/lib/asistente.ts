import { proceso, servicios } from "./content";
import { hasWhatsapp, site, whatsappHref } from "./site";

// Asistente del sitio: responde dudas frecuentes con el contenido del propio sitio (sin IA y sin
// costo). Busca palabras clave en la pregunta; si no entiende, ofrece hablar con una persona.

export type Enlace = { label: string; href: string; externo?: boolean };
export type Respuesta = { texto: string; enlaces?: Enlace[] };

/** Botones de inicio. */
export const sugerencias = ["¿Qué hacen?", "¿Cuánto cuesta?", "¿Cómo trabajan?", "Ver proyectos", "Hablar con alguien"];

export const saludo: Respuesta = {
  texto: `¡Hola! Soy el asistente de DevMart. Te ayudo con dudas rápidas sobre servicios, precios o cómo trabajamos. Para algo más concreto, te conecto con el equipo.`,
};

function contacto(): Enlace[] {
  return [
    ...(hasWhatsapp ? [{ label: "Escribir por WhatsApp", href: whatsappHref(), externo: true }] : []),
    { label: "Dejar mi idea en el formulario", href: "/contacto" },
    ...(site.email ? [{ label: site.email, href: `mailto:${site.email}`, externo: true }] : []),
  ];
}

type Intencion = { claves: string[]; responder: () => Respuesta };

const intenciones: Intencion[] = [
  {
    claves: ["precio", "cuesta", "cuanto", "valor", "costo", "cobran", "presupuesto", "cotiz", "tarifa", "barato"],
    responder: () => ({
      texto:
        "Cada proyecto es distinto, así que no manejamos un precio fijo. Después de una primera conversación te enviamos una cotización cerrada, con el alcance, las etapas y el valor de cada una.",
      enlaces: [
        { label: "Ver precios orientativos", href: "/precios" },
        { label: "Cotizar mi proyecto", href: "/contacto" },
      ],
    }),
  },
  {
    claves: ["tiempo", "demora", "tarda", "cuando", "semana", "plazo", "rapido", "entrega"],
    responder: () => ({
      texto:
        "Depende del alcance. En la propuesta te indicamos las etapas y cuándo verás cada entrega. Siempre empezamos con un prototipo navegable, así ves avances desde el principio.",
      enlaces: [{ label: "Contarte mi idea", href: "/contacto" }],
    }),
  },
  {
    claves: ["proceso", "como trabajan", "trabajan", "etapa", "metodolog", "prototipo", "pasos"],
    responder: () => ({
      texto: `Trabajamos en cuatro pasos: ${proceso.map((p, i) => `${i + 1}. ${p.titulo}`).join(" · ")}. Primero diseñamos un prototipo que puedes probar, luego construimos por etapas y al final el código es tuyo.`,
      enlaces: [{ label: "Conocer más", href: "/nosotros" }],
    }),
  },
  {
    claves: ["proyecto", "portafolio", "ejemplo", "caso", "cliente", "trabajos", "han hecho"],
    responder: () => ({
      texto: "Puedes ver los casos con su reto, solución y resultado. Cada uno indica si ya está en producción o si es un prototipo.",
      enlaces: [{ label: "Ver proyectos", href: "/proyectos" }],
    }),
  },
  {
    claves: ["pago", "wompi", "pasarela", "tarjeta", "pse", "nequi", "vender", "ecommerce", "e-commerce", "tienda"],
    responder: () => ({
      texto:
        "Hacemos tiendas en línea con catálogo, carrito y pasarela de pagos para Colombia (por ejemplo Wompi), además de panel para gestionar pedidos e inventario.",
      enlaces: [
        { label: "Ver servicios", href: "/servicios#tiendas-en-linea" },
        { label: "Cotizar mi tienda", href: "/contacto?tipo=Tienda%20en%20l%C3%ADnea" },
      ],
    }),
  },
  {
    claves: ["soporte", "mantenimiento", "despues", "hosting", "dominio", "actualiz", "garantia"],
    responder: () => ({
      texto:
        "Al lanzar te entregamos el código y los accesos. Si quieres, acordamos un plan de soporte y mejoras. También te ayudamos con el dominio y la publicación.",
      enlaces: contacto().slice(0, 2),
    }),
  },
  {
    claves: ["codigo", "propiedad", "dueno", "derechos", "fuente"],
    responder: () => ({ texto: "El código es tuyo: al final te entregamos el código, los accesos y la documentación. No dependes de nosotros para seguir creciendo." }),
  },
  {
    claves: ["donde", "ubicad", "cartagena", "ciudad", "oficina", "presencial", "colombia"],
    responder: () => ({
      texto: `Estamos en ${site.city}, Colombia, y trabajamos con clientes de todo el país.`,
      enlaces: contacto().slice(0, 1),
    }),
  },
  {
    claves: ["servicio", "hacen", "ofrecen", "web", "pagina", "app", "movil", "software", "sistema", "panel", "landing", "aplicacion"],
    responder: () => ({
      texto: `Hacemos software a medida: ${servicios.map((s) => s.titulo.toLowerCase()).join(", ")}. Desde una página para tu negocio hasta una aplicación completa.`,
      enlaces: [{ label: "Ver servicios", href: "/servicios" }],
    }),
  },
  {
    claves: ["hablar", "humano", "persona", "whatsapp", "llamar", "contacto", "asesor", "correo", "email", "escribir", "numero"],
    responder: () => ({ texto: "¡Claro! Elige cómo prefieres hablar con el equipo:", enlaces: contacto() }),
  },
  {
    claves: ["hola", "buenas", "buenos dias", "buenas tardes", "hey", "saludos"],
    responder: () => ({ texto: "¡Hola! ¿En qué te ayudo? Puedes preguntarme por servicios, precios, tiempos o cómo trabajamos." }),
  },
  {
    claves: ["gracias", "listo", "perfecto", "genial", "vale"],
    responder: () => ({ texto: "¡Con gusto! Si quieres avanzar, cuéntanos tu idea y te respondemos con un plan.", enlaces: [{ label: "Contarte mi idea", href: "/contacto" }] }),
  },
];

const normalizar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ñ\s-]/g, " ");

/** Respuesta a una pregunta libre: la intención con más palabras clave encontradas. */
export function responder(pregunta: string): Respuesta {
  const texto = ` ${normalizar(pregunta)} `;
  let mejor: { puntos: number; i: Intencion } | null = null;
  for (const i of intenciones) {
    const puntos = i.claves.filter((c) => texto.includes(c)).length;
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) mejor = { puntos, i };
  }
  if (mejor) return mejor.i.responder();
  return {
    texto: "No estoy seguro de haber entendido. Esa pregunta es mejor resolverla con el equipo:",
    enlaces: contacto(),
  };
}
