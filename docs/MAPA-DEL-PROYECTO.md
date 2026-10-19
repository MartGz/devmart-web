# Mapa del proyecto · devmart.co

Guía rápida para encontrar cada cosa del sitio de DevMart Solutions y saber cómo se publica.

## Abrirlo en Visual Studio Code

1. **Archivo → Abrir área de trabajo desde archivo…** y elige `devmart-web.code-workspace`.
2. Acepta instalar las **extensiones recomendadas** (Tailwind, ESLint, GitLens, Error Lens).
3. En el explorador verás el proyecto completo y, debajo, accesos directos a cada parte: sitio público, panel, componentes, lógica, blog, identidad visual y esta documentación.

### Tareas con un clic

**Terminal → Ejecutar tarea…**

| Tarea | Qué hace |
|---|---|
| ▶ Ver el sitio en local | Arranca el sitio en <http://localhost:3000> (atajo: `Ctrl+Shift+B`) |
| ✔ Revisar el código | Busca errores con ESLint |
| 🏗 Compilar como en producción | Comprueba que todo compila igual que en Vercel |
| 🗄 Aplicar cambios de la base de datos | Lleva a Neon los cambios de `src/lib/db/schema.ts` |
| ✉ Probar el correo SMTP | Comprueba la contraseña de aplicación del buzón |
| 🌍 Abrir devmart.co | Abre el sitio publicado |

## Cómo se publica

```
rama de trabajo  →  git push a main  →  Vercel despliega solo  →  devmart.co
```

- **Código:** GitHub, repositorio `MartGz/devmart-web`. Cada cambio se hace en una rama (`feat/…`) y se fusiona en `main`.
- **Hosting:** Vercel, proyecto `devmart-web`. Cada push a `main` publica en producción.
- **Dominio:** `devmart.co` (comprado en Hostinger; el DNS apunta a Vercel y el correo sigue en Hostinger).
- **Base de datos:** Neon Postgres (la misma para local y producción).
- **Imágenes:** Vercel Blob (store `devmart-imagenes`).
- **Correo:** buzón `hola@devmart.co` en Hostinger; el sitio envía por SMTP con una contraseña de aplicación.

## Sitio público · `src/app/(sitio)`

| Página | Archivo | Notas |
|---|---|---|
| Inicio | `page.tsx` | Hero, servicios, proyectos destacados, proceso |
| Servicios | `servicios/page.tsx` | Textos en `src/lib/content.ts` |
| Proyectos | `proyectos/page.tsx`, `proyectos/[slug]/page.tsx` | Salen de la base de datos; etiqueta «En producción» / «Prototipo» |
| Nosotros | `nosotros/page.tsx` | Foto del fundador desde el panel (Equipo) |
| Blog | `blog/page.tsx`, `blog/[slug]/page.tsx` | Artículos editables en el panel |
| Precios | `precios/page.tsx` | Tarjetas editables en el panel y cotizador |
| Contacto | `contacto/page.tsx`, `contacto/actions.ts` | Formulario (guarda en el panel y avisa por correo), WhatsApp, email |
| Privacidad | `privacidad/page.tsx` | Ley 1581 de 2012 y cookies |

Comunes a todas las páginas: `layout.tsx` (cabecera, pie y asistente), `src/app/layout.tsx` (fuentes, datos para Google), `sitemap.ts`, `robots.ts` e imágenes para redes (`opengraph-image.tsx`).

## Panel de administración · `src/app/admin`

Se entra en **devmart.co/admin** con email, contraseña y el código de la app de autenticación (en dos pasos).

| Sección | Archivo | Para qué |
|---|---|---|
| Entrar | `login/page.tsx`, `login/actions.ts` | Login en dos pasos con diseño 60/40 |
| ¿Olvidaste tu contraseña? | `login/recuperar/`, `login/nueva/` | Enlace de 30 min al correo para crear contraseña y QR nuevo |
| Resumen | `(panel)/page.tsx` | Mensajes nuevos y actividad reciente |
| Mensajes | `(panel)/mensajes/` | Lo que llega del formulario de contacto |
| Blog | `(panel)/blog/` | Crear y editar artículos (Markdown) |
| Proyectos | `(panel)/proyectos/` | Casos, captura, estado y orden |
| Precios | `(panel)/precios/` | Tarjetas de la página de precios |
| Equipo | `(panel)/equipo/page.tsx` | Foto del fundador para /nosotros |
| Actividad | `(panel)/actividad/page.tsx` | Registro de inicios de sesión y cambios |
| Cuenta | `(panel)/cuenta/page.tsx` | Cambiar contraseña y volver a vincular la app |

Las acciones del panel (guardar, eliminar, subir imágenes) están en `src/lib/admin/actions.ts`; las lecturas en `src/lib/admin/queries.ts`.

## Componentes · `src/components`

| Componente | Qué es |
|---|---|
| `Header.tsx` | Cabecera flotante en cápsula con hora de Cartagena |
| `Footer.tsx` | Pie tipo ficha técnica con redes, WhatsApp y wordmark grande |
| `Asistente.tsx` | Botón del cubo con el asistente y el botón de WhatsApp dentro |
| `ProjectCard.tsx` | Tarjeta de proyecto con etiqueta de estado |
| `ContactForm.tsx`, `Cotizador.tsx` | Formulario de contacto y cotizador de precios |
| `Cube.tsx`, `Logo.tsx`, `CubosEscalera.tsx` | Logo y la ilustración de cubos del login |
| `SocialIcon.tsx` | Iconos de redes |
| `admin/` | Piezas del panel (formularios, subida de imágenes, QR de 2FA) |

## Lógica y datos · `src/lib`

| Archivo | Qué contiene |
|---|---|
| `site.ts` | **Datos del negocio:** nombre, ciudad, email, número de WhatsApp, redes |
| `content.ts` | Textos de servicios, proceso y contenido de respaldo |
| `asistente.ts` | Preguntas y respuestas del asistente |
| `data.ts` | Lecturas del contenido público (con caché) |
| `db/schema.ts` | Tablas de la base de datos |
| `auth/` | Login, sesiones, contraseñas, 2FA y recuperación |
| `email.ts` | Envío de correos (Resend o SMTP) |
| `security.ts` | Límite de intentos y registro de actividad |

## Cambios frecuentes

| Quiero… | Dónde |
|---|---|
| Cambiar textos de proyectos, blog, precios o la foto | **Panel /admin** (sin tocar código) |
| Cambiar el número de WhatsApp | `src/lib/site.ts` → `WHATSAPP_NUMERO` y `WHATSAPP_VISIBLE` |
| Cambiar enlaces de redes | Variables `NEXT_PUBLIC_INSTAGRAM`, `_LINKEDIN`, `_FACEBOOK`, `_TIKTOK` en Vercel |
| Añadir respuestas al asistente | `src/lib/asistente.ts` |
| Cambiar colores o tipografías | `src/app/globals.css` (tokens de la marca) |

## Diseños

Los diseños de cabecera, pie, login, contacto y asistente están en el lienzo de Claude Design «DevMart · Header y Footer».
