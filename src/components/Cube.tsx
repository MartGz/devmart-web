/**
 * Cubo modular DevMart. Caja 1 : 1.1547 (viewBox 100 × 115.47); la cara derecha
 * se desplaza 8.7% × 5% del ancho y sobresale de la caja, como en el manual.
 */

export type CubeVariant = "light" | "dark" | "sky";

const palettes: Record<CubeVariant, { top: string; left: string; right: string }> = {
  // Sobre fondo claro
  light: { top: "#0B0D12", left: "#3EC1F3", right: "#1E8FD0" },
  // Sobre fondo oscuro (negativo)
  dark: { top: "#FFFFFF", left: "#3EC1F3", right: "#1E8FD0" },
  // Sobre fondo Cielo
  sky: { top: "#FFFFFF", left: "#0B0D12", right: "#0B0D12" },
};

export const CUBE_RATIO = 1.1547;

export const cubeFaces = {
  top: "50,0 100,28.868 50,57.735 0,28.868",
  left: "0,28.868 50,57.735 50,115.47 0,86.603",
  right: "50,57.735 100,28.868 100,86.603 50,115.47",
  offset: { x: 8.7, y: 5 },
};

type CubeProps = {
  /** Ancho de la caja del cubo en px (mínimo 16). */
  size?: number;
  variant?: CubeVariant;
  className?: string;
  /** Texto alternativo; si se omite, el cubo es decorativo. */
  title?: string;
};

export function Cube({ size = 24, variant = "light", className, title }: CubeProps) {
  const c = palettes[variant];
  return (
    <svg
      width={size}
      height={+(size * CUBE_RATIO).toFixed(1)}
      viewBox="0 0 100 115.47"
      overflow="visible"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={{ flexShrink: 0, overflow: "visible" }}
    >
      <polygon points={cubeFaces.top} fill={c.top} />
      <polygon points={cubeFaces.left} fill={c.left} />
      <g className="cube-right">
        <polygon
          points={cubeFaces.right}
          fill={c.right}
          transform={`translate(${cubeFaces.offset.x} ${cubeFaces.offset.y})`}
        />
      </g>
    </svg>
  );
}
