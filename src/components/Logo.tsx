import Link from "next/link";
import { Cube, type CubeVariant } from "./Cube";

type LogoProps = {
  /** Ancho del cubo en px. El wordmark y la separación se derivan del manual. */
  cubeSize?: number;
  wordmarkSize?: number;
  /** Separación cubo–texto; por defecto 0.3 × ancho del cubo. */
  gap?: number;
  variant?: Exclude<CubeVariant, "sky">;
  showSolutions?: boolean;
  href?: string;
  className?: string;
};

export function Logo({
  cubeSize = 24,
  wordmarkSize = 18,
  gap,
  variant = "light",
  showSolutions = false,
  href = "/",
  className = "",
}: LogoProps) {
  const dark = variant === "dark";
  return (
    <Link
      href={href}
      aria-label="DevMart Solutions, inicio"
      className={`inline-flex items-center ${className}`}
      style={{ gap: gap ?? Math.round(cubeSize * 0.3) }}
    >
      <Cube size={cubeSize} variant={variant} />
      <span className="flex flex-col leading-[0.95]">
        <span
          className={`font-display font-bold whitespace-nowrap ${dark ? "text-nube" : "text-noche"}`}
          style={{ fontSize: wordmarkSize, letterSpacing: "-0.04em" }}
        >
          devmart
        </span>
        {showSolutions && (
          <span
            className={`font-display font-medium ${dark ? "text-niebla" : "text-pizarra"}`}
            style={{
              fontSize: wordmarkSize * 0.2,
              letterSpacing: "0.42em",
              marginTop: wordmarkSize * 0.19,
            }}
          >
            SOLUTIONS
          </span>
        )}
      </span>
    </Link>
  );
}
