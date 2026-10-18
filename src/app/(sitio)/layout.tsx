import { Analytics } from "@/components/Analytics";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Asistente } from "@/components/Asistente";

// Cabecera, pie y analítica del sitio público (el panel /admin tiene su propio layout).
export default function SitioLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Asistente />
      <Analytics />
    </>
  );
}
