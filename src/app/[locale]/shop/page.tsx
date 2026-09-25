import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { ShopCatalogPage } from "@/components/shop/shop-catalog";
import type { AppLocale } from "@/i18n/routing";

export default async function ShopPage() {
  const locale = (await getLocale()) as AppLocale;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, nameUk: true, nameEn: true, nameRu: true },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "asc" },
      include: { category: { select: { nameUk: true, nameEn: true, nameRu: true } } },
    }),
  ]);

  return (
    <main className="bg-white">
      <ShopCatalogPage
        categories={categories}
        products={products.map((p) => ({
          ...p,
          price: p.price.toString(),
          photoUrl: getPublicUrl(p.mainPhoto)!,
        }))}
        locale={locale}
      />
    </main>
  );
}
