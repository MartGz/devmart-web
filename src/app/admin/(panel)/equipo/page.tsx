import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { AdminHeader, Cargando, Panel } from "@/components/admin/fields";
import { ImagenField } from "@/components/admin/ImagenField";
import { guardarEquipo } from "@/lib/admin/actions";
import { obtenerEquipo } from "@/lib/admin/queries";

export const metadata: Metadata = { title: "Equipo" };

export default function EquipoAdminPage() {
  return (
    <>
      <AdminHeader title="Equipo" intro="La foto del fundador que aparece en /nosotros. Sin foto, se muestra el recuadro rayado." />
      <Suspense fallback={<Cargando />}>
        <Editor />
      </Suspense>
    </>
  );
}

async function Editor() {
  const { foto, fotoAlt } = await obtenerEquipo();
  return (
    <AdminForm action={guardarEquipo} submitLabel="Guardar foto">
      <Panel>
        <ImagenField
          name="foto"
          altName="fotoAlt"
          quitarName="quitarFoto"
          actual={foto}
          alt={fotoAlt}
          label="Foto del fundador"
          aspect="aspect-[4/5]"
        />
      </Panel>
    </AdminForm>
  );
}
