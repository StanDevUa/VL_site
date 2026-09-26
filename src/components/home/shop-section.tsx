import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format-price";
import { CATEGORY_BADGE_GRADIENT } from "@/lib/category-badge";
import { HomeAddToCartButton } from "./home-add-to-cart-button";
import type { AppLocale } from "@/i18n/routing";

export async function ShopSection() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("HomeShop");
  const products = await prisma.product.findMany({
    where: { showOnHome: true },
    orderBy: { createdAt: "asc" },
    take: 4,
    include: { category: { select: { nameUk: true, nameEn: true, nameRu: true } } },
  });

  if (products.length === 0) return null;

  return (
    <section
      id="shop"
      className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:pt-24 sm:pb-[104px] lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(250,244,234,0) 0%, #FAF4EA 12%, #FAF4EA 88%, rgba(250,244,234,0) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-[70px] h-[280px] w-[280px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(242,102,47,.13), rgba(255,255,255,0) 70%)" }}
      />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="mb-11 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-[640px]">
            <div className="mb-4 text-sm font-bold tracking-[1.6px] text-coral uppercase">{t("eyebrow")}</div>
            <h2 className="mb-3.5 font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
              {t("h2")}
            </h2>
            <p className="text-[17px] leading-[1.6] text-navy-soft">{t("p")}</p>
          </div>
          <Link
            href="/shop"
            className="w-full shrink-0 whitespace-nowrap rounded-field bg-indigo px-[30px] py-4 text-center font-heading text-base font-bold text-white shadow-button transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
          >
            {t("ctaGoShop")}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-col overflow-hidden rounded-card border border-navy/12 bg-white transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-1.5 hover:shadow-[0_26px_46px_-28px_rgba(30,42,90,.4)]"
            >
              <Link href={`/shop/${p.slug}`} className="relative block h-[190px] w-full">
                <Image
                  src={getPublicUrl(p.mainPhoto)!}
                  alt={pickLocalized(p, "name", locale)}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                <span
                  className="absolute top-3 left-3 rounded-[7px] px-2.5 py-[5px] text-[11.5px] font-bold tracking-[.5px] text-white uppercase"
                  style={{ background: CATEGORY_BADGE_GRADIENT }}
                >
                  {pickLocalized(p.category, "name", locale)}
                </span>
              </Link>
              <div className="flex flex-1 flex-col px-[22px] pt-[22px] pb-6">
                <Link href={`/shop/${p.slug}`}>
                  <h3 className="mb-2.5 font-heading text-[18px] leading-[1.3] font-bold text-navy sm:text-[17.5px]">
                    {pickLocalized(p, "name", locale)}
                  </h3>
                </Link>
                <div className="line-clamp-2 mb-[18px] text-[14.5px] text-navy-soft">
                  {pickLocalized(p, "productType", locale)}
                </div>
                <div className="mt-auto flex min-h-[42px] items-center justify-between gap-3">
                  <span className="font-heading text-xl font-extrabold whitespace-nowrap text-navy">
                    {formatPrice(p.price.toString())}
                  </span>
                  <HomeAddToCartButton productId={p.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
