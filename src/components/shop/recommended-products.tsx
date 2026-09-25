"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/shop/product-card";
import type { AppLocale } from "@/i18n/routing";

const PER_PAGE = 3;

type Product = {
  id: string;
  slug: string;
  photoUrl: string;
  price: string | number;
  nameUk: string;
  nameEn: string | null;
  nameRu: string | null;
  productTypeUk: string;
  productTypeEn: string | null;
  productTypeRu: string | null;
  category: { nameUk: string; nameEn: string | null; nameRu: string | null };
};

export function RecommendedProducts({ products, locale }: { products: Product[]; locale: AppLocale }) {
  const t = useTranslations("Shop");
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const pageItems = products.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  return (
    <div>
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {pageItems.map((p) => (
          <ProductCard key={p.id} locale={locale} photoHeight={190} product={{ ...p, price: p.price.toString() }} />
        ))}
      </div>

      <div className="mt-[38px] grid grid-cols-1 items-center gap-5 sm:grid-cols-[1fr_auto_1fr]">
        <span className="hidden sm:block" />
        {pages > 1 ? (
          <div className="flex items-center justify-center gap-[14px]">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label={t("prevPageAria")}
              style={{ opacity: current === 0 ? 0.4 : 1 }}
              className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={t("goToPageAria", { n: i + 1 })}
                  className="h-[38px] min-w-[38px] rounded-[10px] border-[1.5px] px-3 font-heading text-[15px] font-bold transition-all duration-200 ease-in-out"
                  style={{
                    background: i === current ? "#5252AC" : "transparent",
                    color: i === current ? "#fff" : "#4A5480",
                    borderColor: i === current ? "#5252AC" : "rgba(30,42,90,.18)",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
              aria-label={t("nextPageAria")}
              style={{ opacity: current === pages - 1 ? 0.4 : 1 }}
              className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
            >
              →
            </button>
          </div>
        ) : (
          <span />
        )}
        <div className="flex justify-center sm:justify-end">
          <Link
            href="/shop"
            className="whitespace-nowrap rounded-button border-[1.5px] border-navy/18 px-[30px] py-[15px] font-heading text-base font-bold text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
          >
            {t("allProducts")}
          </Link>
        </div>
      </div>
    </div>
  );
}
