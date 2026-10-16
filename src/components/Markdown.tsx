import type { ComponentProps, ElementType } from "react";
import ReactMarkdown, { type Components, type ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";

// Estilos de lectura del blog (el ancho de lectura de 680px lo pone la página).
// react-markdown no interpreta HTML crudo y limpia URLs peligrosas (javascript:), así que el
// contenido escrito en el panel no puede inyectar scripts.

/** Elemento con clases fijas; descarta la prop `node` que añade react-markdown. */
function styled<T extends ElementType>(Tag: T, className: string) {
  function Styled({ node, ...props }: ComponentProps<T> & ExtraProps) {
    void node;
    const El = Tag as ElementType;
    return <El className={className} {...props} />;
  }
  return Styled;
}

const components: Components = {
  h2: styled("h2", "h2-dm mt-14 mb-5 text-[26px]! md:text-[28px]!"),
  h3: styled("h3", "h3-dm mt-10 mb-3"),
  p: styled("p", "mb-5 text-[17px] leading-[1.7] text-texto-cuerpo"),
  ul: styled("ul", "mb-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-texto-cuerpo marker:text-cielo-profundo"),
  ol: styled(
    "ol",
    "mb-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-texto-cuerpo marker:font-mono marker:text-cielo-profundo",
  ),
  strong: styled("strong", "font-semibold text-noche"),
  blockquote: styled("blockquote", "my-8 rounded-panel bg-cielo-tinte px-7 py-6 text-lg text-noche [&>p]:mb-0"),
  code: styled("code", "rounded bg-nube px-1.5 py-0.5 font-mono text-[0.9em]"),
  hr: () => <hr className="my-12 border-borde" />,
  a: ({ node, href, ...props }) => {
    void node;
    const externo = href?.startsWith("http");
    return (
      <a
        href={href}
        {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-cielo-profundo underline underline-offset-4 hover:text-noche"
        {...props}
      />
    );
  },
  img: ({ node, alt, ...props }) => {
    void node;
    // eslint-disable-next-line @next/next/no-img-element -- imágenes externas escritas en Markdown
    return <img alt={alt ?? ""} loading="lazy" className="my-8 w-full rounded-panel" {...props} />;
  },
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
