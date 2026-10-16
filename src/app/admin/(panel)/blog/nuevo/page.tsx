import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminHeader, Cargando } from "@/components/admin/fields";
import { requireAdmin } from "@/lib/auth/dal";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "Nuevo artículo" };

export default function NuevoPostPage() {
  return (
    <>
      <Link href="/admin/blog" className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Blog
      </Link>
      <AdminHeader title="Nuevo artículo" />
      <Suspense fallback={<Cargando />}>
        <Formulario />
      </Suspense>
    </>
  );
}

async function Formulario() {
  await requireAdmin();
  return <PostForm />;
}
