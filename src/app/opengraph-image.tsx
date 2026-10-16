import { ogImage } from "@/lib/og";
import { site } from "@/lib/site";

export const alt = `${site.name} · Software a medida en Cartagena`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogImage({ title: "Software a medida para tu negocio." });
}
