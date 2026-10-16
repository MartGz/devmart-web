import type { MDXComponents } from "mdx/types";

// Estilos de lectura del blog (ancho de lectura 680px lo pone la página).
const components: MDXComponents = {
  h2: (props) => <h2 className="h2-dm mt-14 mb-5 text-[26px]! md:text-[28px]!" {...props} />,
  h3: (props) => <h3 className="h3-dm mt-10 mb-3" {...props} />,
  p: (props) => <p className="mb-5 text-[17px] leading-[1.7] text-texto-cuerpo" {...props} />,
  ul: (props) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 text-[17px] leading-[1.7] text-texto-cuerpo marker:text-cielo-profundo" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 text-[17px] leading-[1.7] text-texto-cuerpo marker:font-mono marker:text-cielo-profundo" {...props} />
  ),
  a: (props) => <a className="text-cielo-profundo underline underline-offset-4 hover:text-noche" {...props} />,
  strong: (props) => <strong className="font-semibold text-noche" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-8 rounded-panel bg-cielo-tinte px-7 py-6 text-lg text-noche [&>p]:mb-0" {...props} />
  ),
  code: (props) => <code className="rounded bg-nube px-1.5 py-0.5 font-mono text-[0.9em]" {...props} />,
  hr: () => <hr className="my-12 border-borde" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
