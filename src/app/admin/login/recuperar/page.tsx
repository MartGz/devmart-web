import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Tarjeta } from "../Tarjeta";
import { RecuperarForm } from "./RecuperarForm";

export const metadata: Metadata = { title: "Recuperar acceso" };

export default function RecuperarPage() {
  return (
    <Tarjeta
      titulo="Crea o recupera tu contraseña"
      intro="Escribe el email del administrador y te enviaremos un enlace para crear una contraseña nueva."
    >
      <RecuperarForm />
      <Link href="/admin/login" className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Volver a entrar
      </Link>
    </Tarjeta>
  );
}
