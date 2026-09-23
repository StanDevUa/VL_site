import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "@/server/actions/products";
import { primaryButtonClass } from "@/components/ui/button-styles";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, nameUk: true },
  });

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Новий товар
      </h1>
      {categories.length === 0 ? (
        <div className="bg-white rounded-card border border-navy/10 p-6 max-w-3xl">
          <p className="text-navy-soft mb-4">
            Спочатку потрібно створити хоча б одну категорію — товар обов&apos;язково
            належить до категорії.
          </p>
          <Link href="/admin/kategorii/new" className={primaryButtonClass}>
            + Додати категорію
          </Link>
        </div>
      ) : (
        <ProductForm action={createProduct} categories={categories} />
      )}
    </div>
  );
}
