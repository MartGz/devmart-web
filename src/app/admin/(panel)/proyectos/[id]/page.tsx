import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminHeader, Cargando } from "@/components/admin/fields";
import { eliminarProyecto } from "@/lib/admin/actions";
import { obtenerProyecto } from "@/lib/admin/queries";
import { ProyectoForm } from "../ProyectoForm";

export const metadata: Metadata = { title: "Editar proyecto" };

export default function EditarProyectoPage({ params }: PageProps<"/admin/proyectos/[id]">) {
  return (
    <>
      <Link href="/admin/proyectos" className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Proyectos
      </Link>
      <Suspense fallback={<Cargando />}>
        <Editor params={params} />
      </Suspense>
    </>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/proyectos/[id]">, "params">) {
  const { id } = await params;
  const proyecto = await obtenerProyecto(Number(id));
  if (!proyecto) notFound();
  return (
    <>
      <AdminHeader title="Editar proyecto">
        <DeleteButton action={eliminarProyecto} id={proyecto.id} label="Eliminar proyecto" />
      </AdminHeader>
      <ProyectoForm proyecto={proyecto} />
    </>
  );
}
