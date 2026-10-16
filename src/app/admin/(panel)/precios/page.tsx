import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminForm } from "@/components/admin/AdminForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminHeader, Cargando, Field, Input, Panel, Select, Textarea } from "@/components/admin/fields";
import { eliminarPrecio, guardarPrecio } from "@/lib/admin/actions";
import { listarPrecios } from "@/lib/admin/queries";
import { tiposProyecto } from "@/lib/content";

export const metadata: Metadata = { title: "Precios" };

export default function PreciosAdminPage() {
  return (
    <>
      <AdminHeader
        title="Precios"
        intro="Las tarjetas de /precios. Deja el rango vacío para mostrar «A cotizar»."
      />
      <Suspense fallback={<Cargando />}>
        <Lista />
      </Suspense>
    </>
  );
}

type PrecioEditable = Awaited<ReturnType<typeof listarPrecios>>[number];

function PrecioCampos({ p }: { p?: PrecioEditable }) {
  return (
    <>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid gap-5 sm:grid-cols-[1fr_1fr_120px]">
        <Field label="Nombre">
          <Input name="tipo" defaultValue={p?.tipo} required maxLength={60} />
        </Field>
        <Field label="Rango orientativo" hint="p. ej. Desde $2.500.000 COP">
          <Input name="rango" defaultValue={p?.rango ?? ""} maxLength={60} placeholder="A cotizar" />
        </Field>
        <Field label="Orden">
          <Input name="orden" type="number" min={0} max={999} defaultValue={p?.orden ?? 0} />
        </Field>
      </div>
      <Field label="Descripción">
        <Textarea name="descripcion" rows={2} defaultValue={p?.descripcion} required maxLength={300} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Incluye" hint="un punto por línea">
          <Textarea name="incluye" rows={4} defaultValue={p?.incluye.join("\n")} />
        </Field>
        <Field label="Al cotizar, preseleccionar en el formulario">
          <Select name="tipoFormulario" defaultValue={p?.tipoFormulario ?? tiposProyecto[0]}>
            {tiposProyecto.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>
      </div>
    </>
  );
}

async function Lista() {
  const precios = await listarPrecios();
  return (
    <>
      {precios.map((p) => (
        <Panel key={p.id} className="flex flex-col gap-4">
          <AdminForm action={guardarPrecio}>
            <PrecioCampos p={p} />
          </AdminForm>
          <div className="flex justify-end border-t border-borde pt-4">
            <DeleteButton action={eliminarPrecio} id={p.id} label="Eliminar tarjeta" />
          </div>
        </Panel>
      ))}
      <Panel className="flex flex-col gap-4 border-2 border-dashed border-borde">
        <h2 className="h3-dm">Nueva tarjeta</h2>
        <AdminForm action={guardarPrecio} submitLabel="Crear tarjeta">
          <PrecioCampos />
        </AdminForm>
      </Panel>
    </>
  );
}
