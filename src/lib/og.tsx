import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cubeFaces } from "@/components/Cube";
import { site } from "@/lib/site";

// Imagen Open Graph compartida: fondo Noche, cubo en negativo y titular en Unbounded 700.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontsDir = join(process.cwd(), "src/assets/fonts");
const [unboundedBold, outfitMedium] = await Promise.all([
  readFile(join(fontsDir, "Unbounded-Bold.ttf")),
  readFile(join(fontsDir, "Outfit-Medium.ttf")),
]);

type OgProps = {
  title: string;
  /** Texto pequeño sobre el titular (categoría, tipo de proyecto…). */
  eyebrow?: string;
};

export function ogImage({ title, eyebrow }: OgProps) {
  const titleSize = title.length > 60 ? 60 : title.length > 36 ? 72 : 88;
  const { x, y } = cubeFaces.offset;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0B0D12",
          color: "#FFFFFF",
          fontFamily: "Outfit",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="52" height="60" viewBox="0 0 108.7 120.47">
            <polygon points={cubeFaces.top} fill="#FFFFFF" />
            <polygon points={cubeFaces.left} fill="#3EC1F3" />
            <polygon points={cubeFaces.right} fill="#1E8FD0" transform={`translate(${x} ${y})`} />
          </svg>
          <div style={{ fontFamily: "Unbounded", fontSize: 30, letterSpacing: "-0.03em" }}>
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 1000 }}>
          {eyebrow && (
            <div
              style={{
                fontSize: 26,
                color: "#3EC1F3",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              fontFamily: "Unbounded",
              fontSize: titleSize,
              lineHeight: 1.08,
              letterSpacing: "-0.045em",
              textWrap: "balance",
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, color: "#8A93A3" }}>
          Desde {site.city} para toda Colombia
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Unbounded", data: unboundedBold, weight: 700, style: "normal" },
        { name: "Outfit", data: outfitMedium, weight: 500, style: "normal" },
      ],
    },
  );
}
