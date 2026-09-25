import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductDescription } from "@/components/shop/product-description";
import { ProductBuyBox } from "@/components/shop/product-buy-box";
import { RecommendedProducts } from "@/components/shop/recommended-products";
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
    include: { category: { select: { nameUk: true, nameEn: true, nameRu: true } } },
  });

  const title = pickLocalized(product, "name", locale);

  return (
    <main className="bg-white">
      <section
        className="relative px-[18px] pt-12 pb-12 sm:px-6 sm:pt-[52px] sm:pb-[90px] lg:px-8"
        style={{ background: "linear-gradient(180deg, #FBEFEC 0%, rgba(251,239,236,0) 46%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[130px] -right-[110px] h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(242,102,47,.16), rgba(201,48,124,.09) 55%, rgba(43,107,184,0) 72%)",
            animation: "vlPulse 12s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[240px] left-[5%] h-8 w-5 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-35"
          style={{
            background: "linear-gradient(140deg, #7A3AA0, #2B6BB8)",
            animation: "vlFloat 11s ease-in-out infinite",
          }}
        />

        <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-14 lg:grid-cols-2">
          <ProductGallery
            title={title}
            mainPhotoUrl={getPublicUrl(product.mainPhoto)!}
            gallery={product.gallery.map((key) => getPublicUrl(key)!)}
          />

          <div>
            <div className="mb-3 text-sm font-bold tracking-[1.6px] text-coral uppercase">
              {pickLocalized(product.category, "name", locale)}
            </div>
            <h1 className="mb-4 font-heading text-[36px] leading-[1.14] font-extrabold tracking-[-.8px] text-navy">
              {title}
            </h1>

            <ProductDescription description={pickLocalized(product, "description", locale)} />

            <div className="my-6 h-px bg-navy/12" />

            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5 text-[15.5px] leading-[1.55]">
                <span className="shrink-0 text-navy-soft">{t("productType")}</span>
                <span className="font-semibold text-navy">
                  {pickLocalized(product, "productType", locale)}
                </span>
              </div>
              <div className="flex gap-2.5 text-[15.5px] leading-[1.55]">
                <span className="shrink-0 text-navy-soft">{t("specs")}</span>
                <span className="font-semibold text-navy">
                  {pickLocalized(product, "specs", locale)}
                </span>
              </div>
            </div>

            <div className="my-6 h-px bg-navy/12" />

            <ProductBuyBox productId={product.id} price={product.price.toString()} />

            <div className="mt-6 rounded-button border border-navy/12 bg-powder-beige/60 px-5 py-[18px]">
              <p className="text-[14.5px] leading-[1.65] text-navy-soft text-pretty">
                {t.rich("deliveryNote", {
                  delivery: (chunks) => (
                    <Link href="/legal/dostavka" className="border-b border-blue/40 font-bold text-blue hover:text-magenta">
                      {chunks}
                    </Link>
                  ),
                  returns: (chunks) => (
                    <Link href="/legal/povernennia" className="border-b border-blue/40 font-bold text-blue hover:text-magenta">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
          </div>
        </div>

        {recommended.length > 0 && (
          <div className="relative mx-auto mt-[76px] max-w-[1240px] border-t border-navy/12 pt-11">
            <h2 className="mb-[26px] font-heading text-[28px] font-extrabold tracking-[-.5px] text-navy">
              {t("recommended")}
            </h2>
            <RecommendedProducts
              locale={locale}
              products={recommended.map((item) => ({
                ...item,
                price: item.price.toString(),
                photoUrl: getPublicUrl(item.mainPhoto)!,
              }))}
            />
          </div>
        )}
      </section>
    </main>
  );
}
