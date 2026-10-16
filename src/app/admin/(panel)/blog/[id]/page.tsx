import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { AdminHeader, Cargando } from "@/components/admin/fields";
import { eliminarPost } from "@/lib/admin/actions";
import { obtenerPost } from "@/lib/admin/queries";
import { PostForm } from "../PostForm";

export const metadata: Metadata = { title: "Editar artículo" };

export default function EditarPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  return (
    <>
      <Link href="/admin/blog" className="inline-flex w-fit items-center gap-2 text-[15px] text-pizarra hover:text-noche">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden /> Blog
      </Link>
      <Suspense fallback={<Cargando />}>
        <Editor params={params} />
      </Suspense>
    </>
  );
}

async function Editor({ params }: Pick<PageProps<"/admin/blog/[id]">, "params">) {
  const { id } = await params;
  const post = await obtenerPost(Number(id));
  if (!post) notFound();
  return (
    <>
      <AdminHeader title="Editar artículo">
        <DeleteButton action={eliminarPost} id={post.id} label="Eliminar artículo" />
      </AdminHeader>
      <PostForm post={post} />
    </>
  );
}
