import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Portal de clientes", template: "%s · Portal DevMart" },
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: LayoutProps<"/portal">) {
  return children;
}
