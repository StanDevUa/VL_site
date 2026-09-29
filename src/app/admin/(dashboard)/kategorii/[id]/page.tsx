import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "@/server/actions/categories";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    notFound();
  }

  const returnTo = page ? `/admin/kategorii?page=${page}` : "/admin/kategorii";
  const updateCategoryWithId = updateCategory.bind(null, id, returnTo);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування категорії
      </h1>
      <CategoryForm action={updateCategoryWithId} existing={category} />
    </div>
  );
}
