import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "@/server/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, nameUk: true },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const updateProductWithId = updateProduct.bind(null, id);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування товару
      </h1>
      <ProductForm
        action={updateProductWithId}
        categories={categories}
        existing={{
          nameUk: product.nameUk,
          nameEn: product.nameEn,
          nameRu: product.nameRu,
          categoryId: product.categoryId,
          price: product.price.toString(),
          productTypeUk: product.productTypeUk,
          productTypeEn: product.productTypeEn,
          productTypeRu: product.productTypeRu,
          specsUk: product.specsUk,
          specsEn: product.specsEn,
          specsRu: product.specsRu,
          descriptionUk: product.descriptionUk,
          descriptionEn: product.descriptionEn,
          descriptionRu: product.descriptionRu,
          showOnHome: product.showOnHome,
          mainPhotoUrl: getPublicUrl(product.mainPhoto)!,
          gallery: product.gallery.map((key) => ({
            key,
            url: getPublicUrl(key)!,
          })),
        }}
      />
    </div>
  );
}
