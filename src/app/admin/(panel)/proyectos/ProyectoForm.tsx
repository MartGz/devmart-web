import { AdminForm } from "@/components/admin/AdminForm";
import { Checkbox, Field, Input, Panel, Select, Textarea } from "@/components/admin/fields";
import { ImagenField } from "@/components/admin/ImagenField";
import { guardarProyecto } from "@/lib/admin/actions";

type ProyectoEditable = {
  id: number;
  slug: string;
  cliente: string;
  tipo: string;
  resumen: string;
  stack: string[];
  url: string | null;
  urlLabel: string | null;
  reto: string;
  solucion: string[];
  resultado: string;
  estado: "produccion" | "prototipo";
  imagen: string | null;
  imagenAlt: string;
  orden: number;
  publicado: boolean;
};

export function ProyectoForm({ proyecto: p }: { proyecto?: ProyectoEditable }) {
  return (
    <AdminForm action={guardarProyecto} submitLabel={p ? "Guardar cambios" : "Crear proyecto"}>
      {p && <input type="hidden" name="id" value={p.id} />}
      <Panel className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Cliente o nombre del proyecto">
            <Input name="cliente" defaultValue={p?.cliente} required maxLength={120} />
          </Field>
          <Field label="Tipo" hint="p. ej. Tienda en línea">
            <Input name="tipo" defaultValue={p?.tipo} required maxLength={60} />
          </Field>
        </div>
        <Field label="Estado" hint="se muestra como etiqueta en la tarjeta">
          <Select name="estado" defaultValue={p?.estado ?? "produccion"}>
            <option value="produccion">En producción · sitio real publicado</option>
            <option value="prototipo">Prototipo · navegable, aún no es el sitio final</option>
          </Select>
        </Field>
        <Field label="Resumen" hint="una frase para la tarjeta">
          <Textarea name="resumen" rows={2} defaultValue={p?.resumen} required maxLength={300} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Enlace" hint="opcional">
            <Input name="url" type="url" defaultValue={p?.url ?? ""} placeholder="https://" maxLength={300} />
          </Field>
          <Field label="Texto del enlace" hint="p. ej. Ver sitio">
            <Input name="urlLabel" defaultValue={p?.urlLabel ?? ""} maxLength={40} />
          </Field>
        </div>
        <Field label="Tecnologías" hint="una por línea">
          <Textarea name="stack" rows={4} defaultValue={p?.stack.join("\n")} className="font-mono text-[14px]" />
        </Field>
      </Panel>

      <Panel>
        <ImagenField
          name="imagen"
          altName="imagenAlt"
          quitarName="quitarImagen"
          actual={p?.imagen}
          alt={p?.imagenAlt}
          label="Captura del proyecto"
        />
      </Panel>

      <Panel className="flex flex-col gap-5">
        <Field label="El reto">
          <Textarea name="reto" rows={4} defaultValue={p?.reto} required maxLength={3000} />
        </Field>
        <Field label="La solución" hint="un punto por línea">
          <Textarea name="solucion" rows={5} defaultValue={p?.solucion.join("\n")} />
        </Field>
        <Field label="El resultado">
          <Textarea name="resultado" rows={4} defaultValue={p?.resultado} required maxLength={3000} />
        </Field>
      </Panel>

      <Panel className="grid gap-5 sm:grid-cols-[160px_1fr_200px] sm:items-end">
        <Field label="Orden" hint="0 = primero">
          <Input name="orden" type="number" min={0} max={999} defaultValue={p?.orden ?? 0} />
        </Field>
        <Field label="Slug" hint="vacío = desde el nombre">
          <Input name="slug" defaultValue={p?.slug} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" className="font-mono text-[14px]" />
        </Field>
        <div className="pb-3">
          <Checkbox name="publicado" label="Publicado" defaultChecked={p?.publicado ?? true} />
        </div>
      </Panel>
    </AdminForm>
  );
}
