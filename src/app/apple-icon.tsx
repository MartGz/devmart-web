import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Igual que el avatar de redes: fondo Noche con el cubo en negativo.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0D12",
        }}
      >
        <svg width="92" height="102" viewBox="0 0 108.7 120.47">
          <polygon points="50,0 100,28.868 50,57.735 0,28.868" fill="#FFFFFF" />
          <polygon points="0,28.868 50,57.735 50,115.47 0,86.603" fill="#3EC1F3" />
          <polygon points="58.7,62.735 108.7,33.868 108.7,91.603 58.7,120.47" fill="#1E8FD0" />
        </svg>
      </div>
    ),
    size,
  );
}
