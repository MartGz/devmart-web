import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TarjetaAcceso } from "@/components/portal/TarjetaAcceso";
import { IngresoForm } from "./IngresoForm";

export const metadata: Metadata = { title: "Entrar" };

export default function IngresoPage() {
  return (
    <TarjetaAcceso
      titulo="Tu portal de cliente"
      intro="Escribe el email con el que trabajas con nosotros y te enviamos un enlace para entrar. Sin contraseñas."
    >
      <IngresoForm />
      <Link href="/" className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Volver al sitio
      </Link>
    </TarjetaAcceso>
  );
}
