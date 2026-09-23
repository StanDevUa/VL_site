import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { ProductCard } from "@/components/shop/product-card";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductBuyBox } from "@/components/shop/product-buy-box";
import type { AppLocale } from "@/i18n/routing";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Shop");

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: { select: { nameUk: true, nameEn: true, nameRu: true } } },
  });
  if (!product) {
    notFound();
  }

  const recommended = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: product.id } },
    orderBy: { createdAt: "asc" },
    take: 4,
    include: { category: { select: { nameUk: true, nameEn: true, nameRu: true } } },
  });

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 mb-16">
        <ProductGallery
          mainPhotoUrl={getPublicUrl(product.mainPhoto)!}
          gallery={product.gallery.map((key) => getPublicUrl(key)!)}
        />

        <div>
          <p className="text-sm font-bold tracking-[1.6px] uppercase text-coral mb-3">
            {pickLocalized(product.category, "name", locale)}
          </p>
          <h1 className="font-heading font-extrabold text-4xl text-navy mb-5">
            {pickLocalized(product, "name", locale)}
          </h1>
          <div className="text-navy-soft leading-relaxed whitespace-pre-line mb-6">
            {pickLocalized(product, "description", locale)}
          </div>

          <div className="h-px bg-navy/10 my-6" />

          <div className="space-y-2">
            <div className="flex gap-2.5 text-[15.5px]">
              <span className="text-navy-soft shrink-0">{t("productType")}</span>
              <span className="font-semibold text-navy">
                {pickLocalized(product, "productType", locale)}
              </span>
            </div>
            <div className="flex gap-2.5 text-[15.5px]">
              <span className="text-navy-soft shrink-0">{t("specs")}</span>
              <span className="font-semibold text-navy">
                {pickLocalized(product, "specs", locale)}
              </span>
            </div>
          </div>

          <div className="h-px bg-navy/10 my-6" />

          <ProductBuyBox productId={product.id} price={product.price.toString()} />

          <div className="rounded-card border border-navy/10 bg-powder-beige/60 p-5 mt-6">
            <p className="text-sm leading-relaxed text-navy-soft">{t("deliveryNote")}</p>
          </div>
        </div>
      </div>

      {recommended.length > 0 && (
        <section className="border-t border-navy/10 pt-12">
          <h2 className="font-heading font-extrabold text-2xl text-navy mb-6">
            {t("recommended")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {recommended.map((item) => (
              <ProductCard
                key={item.id}
                locale={locale}
                product={{ ...item, price: item.price.toString() }}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
