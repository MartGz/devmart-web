import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { AdminForm } from "@/components/admin/AdminForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { EstadoBadge, estadoLabel } from "@/components/admin/EstadoBadge";
import { Cargando, Field, fechaHora, Panel, Select, Textarea } from "@/components/admin/fields";
import { actualizarMensaje, eliminarMensaje } from "@/lib/admin/actions";
import { obtenerMensaje } from "@/lib/admin/queries";
import { estadosMensaje } from "@/lib/db/schema";

export const metadata: Metadata = { title: "Mensaje" };

export default function MensajePage({ params }: PageProps<"/admin/mensajes/[id]">) {
  return (
    <>
      <Link href="/admin/mensajes" className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Mensajes
      </Link>
      <Suspense fallback={<Cargando />}>
        <Detalle params={params} />
      </Suspense>
    </>
  );
}

async function Detalle({ params }: Pick<PageProps<"/admin/mensajes/[id]">, "params">) {
  const { id } = await params;
  const m = await obtenerMensaje(Number(id));
  if (!m) notFound();

  const digitos = m.telefono.replace(/\D/g, "");
  const whatsapp = `https://wa.me/${digitos.length === 10 ? `57${digitos}` : digitos}?text=${encodeURIComponent(
    `Hola ${m.nombre.split(" ")[0]}, te escribimos de DevMart Solutions por tu mensaje sobre tu proyecto.`,
  )}`;
  const contacto = "inline-flex items-center gap-2 rounded-full border border-borde px-4 py-2.5 text-[14px] font-medium hover:border-noche";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Panel className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-[26px] leading-[1.15] font-bold tracking-[-0.045em]">{m.nombre}</h1>
            <span className="font-mono text-xs text-pizarra">Recibido el {fechaHora(m.creado)}</span>
          </div>
          <EstadoBadge estado={m.estado} />
        </div>

        <dl className="grid gap-4 border-y border-borde py-5 text-[15px] sm:grid-cols-2">
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-xs text-pizarra">Tipo de proyecto</dt>
            <dd>{m.tipo}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-xs text-pizarra">Presupuesto</dt>
            <dd>{m.presupuesto}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-xs text-pizarra">Email</dt>
            <dd className="break-all">{m.email}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="font-mono text-xs text-pizarra">Teléfono</dt>
            <dd>{m.telefono}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-pizarra">Su idea</span>
          <p className="text-[16px] leading-[1.65] whitespace-pre-wrap text-texto-cuerpo">{m.descripcion}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={contacto}>
            <MessageCircle size={16} strokeWidth={1.5} aria-hidden /> WhatsApp
          </a>
          <a href={`mailto:${m.email}?subject=${encodeURIComponent("Tu proyecto con DevMart Solutions")}`} className={contacto}>
            <Mail size={16} strokeWidth={1.5} aria-hidden /> Responder por email
          </a>
          <a href={`tel:${digitos}`} className={contacto}>
            <Phone size={16} strokeWidth={1.5} aria-hidden /> Llamar
          </a>
        </div>
      </Panel>

      <div className="flex flex-col gap-6">
        <Panel>
          <AdminForm action={actualizarMensaje}>
            <input type="hidden" name="id" value={m.id} />
            <Field label="Estado">
              <Select name="estado" defaultValue={m.estado}>
                {estadosMensaje.map((e) => (
                  <option key={e} value={e}>
                    {estadoLabel[e]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Notas internas" hint="solo las ves tú">
              <Textarea name="notas" rows={6} defaultValue={m.notas} maxLength={5000} />
            </Field>
          </AdminForm>
        </Panel>
        <DeleteButton action={eliminarMensaje} id={m.id} label="Eliminar mensaje" />
      </div>
    </div>
  );
}
