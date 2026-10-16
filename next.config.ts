import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const isDev = process.env.NODE_ENV === "development";

// Orígenes externos permitidos por la CSP: analítica opcional (GA4 / Plausible) y la barra de
// comentarios de Vercel en las vistas previas.
const plausibleOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js").origin;
  } catch {
    return "https://plausible.io";
  }
})();
const ga = "https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com";

// Sin nonces: las páginas se mantienen estáticas. Ver node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${ga} ${plausibleOrigin} https://vercel.live`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' ${ga} ${plausibleOrigin} https://vercel.live wss://ws-us3.pusher.com`,
  "frame-src https://vercel.live",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // El panel no debe aparecer en buscadores ni guardarse en cachés compartidas.
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
};

export default withBotId(nextConfig);
