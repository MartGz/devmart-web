"use client";

import { Trash2 } from "lucide-react";

/** Botón de eliminar con confirmación. La acción vuelve a verificar la sesión en el servidor. */
export function DeleteButton({
  action,
  id,
  label = "Eliminar",
  confirmText = "¿Seguro? Esta acción no se puede deshacer.",
}: {
  action: (fd: FormData) => Promise<void>;
  id: number;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-[#C2410C]/40 px-4 py-2.5 text-[14px] font-medium text-[#9A3412] transition-colors hover:bg-[#FFF4ED]"
      >
        <Trash2 size={16} strokeWidth={1.5} aria-hidden /> {label}
      </button>
    </form>
  );
}
