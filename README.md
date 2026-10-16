# DevMart Solutions · Sitio web

Sitio corporativo de **DevMart Solutions**, empresa de software a medida en Cartagena de Indias, Colombia.

Construido con **Next.js 16** (App Router, Cache Components, React Compiler), **TypeScript**, **Tailwind CSS v4** y **MDX** para el blog.

## Empezar

```bash
npm install
cp .env.example .env.local   # completa los valores que tengas
npm run dev                  # http://localhost:3000
```

Otros comandos:

| Comando         | Qué hace                               |
| --------------- | -------------------------------------- |
| `npm run build` | Compila para producción                |
| `npm run start` | Sirve la compilación de producción     |
| `npm run lint`  | Revisa el código con ESLint            |

> Next.js 16 cambia varias APIs respecto a versiones anteriores. Antes de tocar código, consulta la documentación incluida en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Estructura

```
src/
  app/                 Rutas (una carpeta por página)
    blog/[slug]/       Artículo del blog + su imagen Open Graph
    proyectos/[slug]/  Ficha de caso + su imagen Open Graph
    contacto/          Formulario (server action en actions.ts)
    privacidad/        Política de datos (Ley 1581) y cookies
    opengraph-image.tsx, sitemap.ts, robots.ts, apple-icon.tsx
  components/          Componentes de interfaz (Header, Footer, Cotizador…)
  content/blog/        Cuerpo de cada artículo en MDX
  lib/
    site.ts            Nombre, ciudad, URL, email y WhatsApp
    content.ts         Servicios, proyectos, precios, proceso
    blog.ts            Índice de artículos
    cotizador.ts       Opciones del cotizador de /precios
    analytics.ts       Eventos de conversión
    og.tsx             Diseño de las imágenes Open Graph
  assets/fonts/        Fuentes TTF para las imágenes Open Graph
Identidad visual DevMart Solutions/   Manual de marca y handoff de diseño
```

Los colores y estilos de marca (Noche, Cielo, Nube…) están definidos como tokens en `src/app/globals.css`.

## Variables de entorno

Todas son opcionales: el sitio funciona sin ellas y oculta lo que no esté configurado. Ver `.env.example`.

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL pública (sitemap, Open Graph, JSON-LD). Sin ella se usa `http://localhost:3000`. |
| `NEXT_PUBLIC_EMAIL` | Email de contacto que se muestra en el sitio. |
| `NEXT_PUBLIC_WHATSAPP` | Número de WhatsApp Business, solo dígitos con indicativo (`57…`). Sin él, los botones llevan a `/contacto`. |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Envío del formulario de contacto con Resend. |
| `FORMSPREE_ENDPOINT` | Alternativa a Resend para el formulario. |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4. Se carga solo si la persona acepta las cookies. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_PLAUSIBLE_SRC` | Plausible (sin cookies, no muestra aviso). |

Las variables `NEXT_PUBLIC_*` se incorporan al compilar: después de cambiarlas hay que volver a desplegar.

## Tareas frecuentes

### Publicar un artículo

1. Crea `src/content/blog/<slug>.mdx` con el cuerpo del artículo (sin el título: lo pone la página).
2. Añade la entrada en `src/lib/blog.ts` con `slug`, `titulo`, `resumen`, `categoria`, `fecha` (AAAA-MM-DD) y `lecturaMin`.

El sitemap y la imagen Open Graph se generan solos.

### Añadir un proyecto

Añade un objeto al arreglo `proyectos` de `src/lib/content.ts` (cliente, tipo, resumen, stack, reto, solución y resultado). La ficha, la tarjeta, el sitemap y la imagen Open Graph salen de ahí.

### Poner precios

En `src/lib/content.ts`, cambia `rango: null` por el texto del rango (p. ej. `"Desde $2.500.000 COP"`). Mientras sea `null` se muestra «A cotizar».

## Analítica y eventos

Además de las visitas, se registran estos eventos (en GA4 y Plausible):

| Evento | Cuándo |
| --- | --- |
| `whatsapp_click` | Clic en cualquier botón de WhatsApp (propiedad `ubicacion`) |
| `contact_submit` | Envío correcto del formulario (propiedad `tipo`) |
| `cotizador_enviado` | Envío del resumen del cotizador (propiedades `canal`, `tipo`, `nivel`) |

En Plausible hay que crear cada evento como *Goal* para verlo en el panel.

## Despliegue

Pensado para **Vercel**: importa el repositorio, añade las variables de entorno y conecta el dominio. Cada push a `main` despliega a producción y cada rama tiene su vista previa.

Después de publicar con el dominio definitivo:

1. Define `NEXT_PUBLIC_SITE_URL` y vuelve a desplegar.
2. Verifica el dominio en [Google Search Console](https://search.google.com/search-console) y envía `https://<dominio>/sitemap.xml`.
3. Prueba los datos estructurados con el [Rich Results Test](https://search.google.com/test/rich-results).

## Pendientes

- Dominio, email y número de WhatsApp Business.
- Rangos de precios y de presupuesto del formulario (confirmar con DevMart).
- Capturas reales de proyectos y foto del equipo.
- Resultado real del caso Eliab Bohorquez Perfumería.
- Revisión legal de `/privacidad`.
