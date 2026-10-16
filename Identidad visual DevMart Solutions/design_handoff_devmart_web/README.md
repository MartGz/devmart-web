# Handoff: Sitio web DevMart Solutions

## Resumen
Sitio corporativo de DevMart Solutions (Cartagena de Indias, Colombia). DevMart crea software a medida —web, móvil o lo que el cliente necesite— para personas y negocios que tienen una idea y quieren convertirla en producto.

Páginas: **Inicio, Servicios, Proyectos / casos, Nosotros, Blog, Contacto, Precios.**

## Sobre los archivos de diseño
Los archivos de esta carpeta son **referencias de diseño hechas en HTML**: muestran la apariencia y el comportamiento esperados y no son código de producción para copiar. La tarea es **recrear el diseño en un proyecto nuevo**. Como no hay código base todavía, se recomienda **Next.js (App Router) + TypeScript + Tailwind CSS**, desplegado en Vercel o Netlify. El blog puede usar MDX en el repositorio y luego migrar a un CMS headless (Sanity o Payload) si hace falta.

Abre `DevMart Manual de Marca v2.dc.html` en el navegador (junto a `support.js`). La sección **06 Web** es la referencia de la página de inicio. Las secciones 01–03 definen el logo, el color y la tipografía.

## Fidelidad
**Alta (hi-fi)** para identidad (logo, color, tipografía, botones, estilo de la cabecera y del hero de Inicio). **Baja** para las demás páginas: no están diseñadas. Constrúyelas con el mismo sistema (ver «Patrones»).

## Marca

### Logo: cubo modular
Isométrico plano formado por 3 caras. Construcción con clip-path sobre una caja de proporción **1 : 1.1547** (ancho : alto):
- Cara superior `polygon(50% 0,100% 25%,50% 50%,0 25%)`: **Noche #0B0D12** sobre fondo claro, **#FFFFFF** sobre fondo oscuro.
- Cara izquierda `polygon(0 25%,50% 50%,50% 100%,0 75%)`: **Cielo #3EC1F3**.
- Cara derecha `polygon(50% 50%,100% 25%,100% 75%,50% 100%)`: **Cielo profundo #1E8FD0**, desplazada `translate(8.7%·ancho, 5%·ancho)`.
- Sobre fondo Cielo: superior #FFFFFF, izquierda y derecha #0B0D12.

Expórtalo como **SVG** (`/public/logo-cube.svg`, `logo-cube-dark.svg`) y genera el favicon y el apple-touch-icon a partir del cubo.

Wordmark: `devmart` en minúscula, **Unbounded 700**, letter-spacing −0.04em. Opcionalmente debajo `SOLUTIONS` en Unbounded 500, tamaño 0.2× el wordmark, letter-spacing 0.42em, color #4A5262 (#8A93A3 sobre oscuro). Espacio cubo–texto = 0.3 × ancho del cubo.

Reglas: no deformar, rotar, recolorear ni añadir sombras. Tamaño mínimo del logo completo 90 px; del símbolo, 16 px.

## Design tokens

### Color
| Token | Hex | Uso |
|---|---|---|
| noche | #0B0D12 | Texto principal, botón secundario sólido, fondos oscuros |
| cielo | #3EC1F3 | Acento, CTA principal (texto Noche encima) |
| cielo-profundo | #1E8FD0 | Etiquetas/números sobre blanco, enlaces, cara del cubo |
| cielo-tinte | #EAF7FD | Fondos de bloques destacados, panel del hero |
| nube | #F5F7FA | Fondo de página alternativo |
| blanco | #FFFFFF | Fondo principal de la web |
| niebla | #8A93A3 | Texto secundario sobre oscuro |
| pizarra | #4A5262 | Texto secundario sobre claro |
| borde | #DDE2E9 | Separadores, bordes finos |
| texto-cuerpo | #2B313C | Párrafos |

Nunca uses Cielo #3EC1F3 como color de texto sobre blanco (contraste insuficiente). Para eso, Cielo profundo.

### Tipografía (Google Fonts)
- **Unbounded** 500/700: logo, H1, H2, H3, cifras grandes.
- **Outfit** 400/500/600: cuerpo, navegación, botones.
- **JetBrains Mono** 400/500: etiquetas (`// SERVICIOS`), números de sección, datos.

| Estilo | Fuente | Tamaño / interlineado | Peso | Tracking |
|---|---|---|---|---|
| H1 hero | Unbounded | clamp(36px, 4.6vw, 64px) / 1.02 | 700 | −0.05em, text-wrap: balance |
| H2 | Unbounded | 34px / 1.05 (móvil 28px) | 700 | −0.04em |
| H3 | Unbounded | 18–20px / 1.2 | 500 | −0.03em |
| Cuerpo L | Outfit | 18px / 1.55 | 400 | 0 |
| Cuerpo | Outfit | 16–17px / 1.55 | 400 | 0 |
| Nav | Outfit | 15px | 400 | 0 |
| Etiqueta | JetBrains Mono | 12px | 400 | 0.12em, MAYÚSCULAS, prefijo `// ` |

### Espaciado, radios y sombras
- Escala de espaciado: 4, 8, 12, 16, 24, 28, 32, 48, 72, 96 px.
- Contenedor: max-width 1280px; padding horizontal 48px en escritorio y 20px en móvil.
- Radios: 999px (botones y pills), 18–20px (tarjetas), 14px (paneles de imagen), 8–12px (miniaturas).
- Sombra de tarjeta elevada: `0 24px 60px rgba(11,13,18,.12)`.

## Componentes

**Cabecera.** Fila con padding 24px 48px, logo a la izquierda (cubo de 24px + wordmark de 18px, separados 10px) y a la derecha los enlaces Servicios · Proyectos · Nosotros · Blog · Precios, con 32px de separación y color #2B313C. Al final, el botón «Contacto» en pill Noche con texto blanco, padding 10px 18px y peso 600. Por debajo de 768px los enlaces pasan a un menú hamburguesa en panel completo. La cabecera es sticky con fondo blanco y un borde inferior #DDE2E9 que aparece al hacer scroll.

**Botones.**
- Primario: fondo Cielo #3EC1F3, texto Noche, padding 16px 26px, radio 999px, Outfit 16px/600. En hover, fondo #1E8FD0 y texto blanco, con transición de 150ms ease.
- Secundario: borde de 1.5px Noche, padding 14.5px 24px, Outfit 500. En hover, fondo Noche y texto blanco.
- Focus visible: outline de 2px #1E8FD0 con offset de 3px.

**Hero de Inicio.** Grid de 2 columnas (`repeat(auto-fit,minmax(300px,1fr))`) con gap de 48px y padding 72px 48px 48px.
- Columna izquierda, en columna con gap de 28px: etiqueta `// DEVMART SOLUTIONS` en #1E8FD0; H1 «Software a medida para tu negocio.»; un párrafo de 18px en #4A5262 con max-width de 460px; botones «Empezar un proyecto» (primario) y «Ver proyectos» (secundario).
- Columna derecha: panel #EAF7FD de min-height 320px y radio 14px con el cubo grande (200px) centrado. Opcionalmente, animar el cubo con un leve flotado (translateY ±6px, 4s ease-in-out infinito) y la cara derecha separándose al hacer hover. Respetar `prefers-reduced-motion`.

**Fila de servicios.** Debajo del hero va una línea superior #DDE2E9 con padding-top de 28px y un grid de `repeat(auto-fit,minmax(180px,1fr))` con gap de 32px. Cada ítem lleva un número mono `01` en #1E8FD0 y un título en Unbounded 18px/500.

## Páginas

Todas usan la misma cabecera y pie. El ritmo de secciones es: padding vertical de 96px, una etiqueta mono, un H2 y luego el contenido. Se pueden alternar fondos blanco y #F5F7FA, y usar una sección Noche por página como máximo (por ejemplo, el CTA final).

1. **Inicio:** hero → servicios → 3 proyectos destacados → proceso (Idea → Diseño → Desarrollo → Lanzamiento, numerado 01–04) → CTA final oscuro («¿Tienes una idea? Hablemos.» + botón WhatsApp).
2. **Servicios:** desarrollo web, apps móviles, tiendas en línea, software a medida y paneles administrativos. Una tarjeta por servicio con descripción, entregables y tecnologías.
3. **Proyectos / casos:** grid de tarjetas con imagen 4:3, cliente, tipo y enlace. La ficha de caso se organiza en reto → solución → resultado. Primer caso real: Eliab Bohorquez Perfumería (tienda en línea con Wompi, React + Node/Express + MySQL; prototipo en https://eliabperfumes.netlify.app/).
4. **Nosotros:** fundador Martín Elías García Zurique, desarrollador web, en Cartagena de Indias. Incluye la forma de trabajo: prototipo navegable primero, entregas por etapas, el código es del cliente.
5. **Blog:** listado con etiqueta de categoría, título, fecha y tiempo de lectura; detalle en MDX con ancho de lectura de 680px.
6. **Precios:** rangos orientativos por tipo de proyecto (landing, web corporativa, tienda en línea, app a medida) más un CTA «Cotizar mi proyecto». Los montos deben confirmarse con el cliente; no inventar cifras.
7. **Contacto:** formulario con nombre, email, teléfono, tipo de proyecto (select), presupuesto aproximado (select), descripción de la idea y aceptación de tratamiento de datos (Ley 1581 de 2012, Colombia). Validación en el cliente y en el servidor. El envío puede ir por Resend o Formspree y muestra un estado de éxito. Al lado, un botón de WhatsApp Business.

**Pie de página:** fondo Noche, logo en versión negativa (cara superior blanca), enlaces, email, WhatsApp y redes, y «© 2026 DevMart Solutions · Cartagena de Indias».

## Comportamiento
- Diseño responsive: breakpoints en 640, 768, 1024 y 1280px. El hero se apila en móvil.
- Botón flotante de WhatsApp (abajo a la derecha, 56px, fondo Cielo, icono Noche) con enlace `https://wa.me/57XXXXXXXXXX`. El número de WhatsApp Business está pendiente; mientras tanto se usa una constante de entorno `NEXT_PUBLIC_WHATSAPP`.
- SEO: metadata por página, Open Graph con una imagen generada (fondo Noche + cubo + titular en Unbounded), sitemap.xml, robots.txt y JSON-LD de `Organization` / `LocalBusiness`.
- Analítica: Google Analytics 4 o Plausible.
- Accesibilidad: contraste AA, foco visible y textos alternativos.

## Contacto y dominio
- Teléfono actual: 314 728 9141. El cliente quiere un número separado para WhatsApp Business; queda pendiente.
- Email: pendiente de confirmar (sugerido `hola@<dominio>`).
- Dominios sugeridos, en orden de preferencia (verificar disponibilidad): **devmart.com.co**, **devmart.co**, **devmartsolutions.com**, **devmart.dev**.

## Assets
- Fuentes: Google Fonts (Unbounded, Outfit, JetBrains Mono), a través de `next/font/google`.
- Logo: recrear en SVG a partir de la construcción descrita arriba.
- Imágenes de proyectos: pendientes. Usar placeholders con rayado diagonal #F5F7FA/#E7EBF0 hasta tener capturas reales.
- Iconos: Lucide (trazo de 1.5px), en color Noche o Cielo profundo.

## Archivos
- `DevMart Manual de Marca v2.dc.html`: manual de marca completo. La sección 06 Web es la referencia de Inicio.
- `support.js`: runtime necesario para abrir el HTML anterior en el navegador.
