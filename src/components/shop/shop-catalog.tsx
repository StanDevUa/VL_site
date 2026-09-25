"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/shop/product-card";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";

type Category = { id: string; nameUk: string; nameEn: string | null; nameRu: string | null };

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
  categoryId: string;
  category: { nameUk: string; nameEn: string | null; nameRu: string | null };
};

function usePerPage() {
  const [perPage, setPerPage] = useState(12);

  useEffect(() => {
    function sync() {
      setPerPage(window.innerWidth <= 640 ? 4 : 12);
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return perPage;
}

export function ShopCatalogPage({
  categories,
  products,
  locale,
}: {
  categories: Category[];
  products: Product[];
  locale: AppLocale;
}) {
  const t = useTranslations("Shop");
  const perPage = usePerPage();
  const [active, setActive] = useState<string | "ALL">("ALL");
  const [page, setPage] = useState(0);

  const filtered = useMemo(
    () => (active === "ALL" ? products : products.filter((p) => p.categoryId === active)),
    [products, active],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pages - 1);
  const pageItems = filtered.slice(current * perPage, current * perPage + perPage);

  function pick(id: string | "ALL") {
    setActive(id);
    setPage(0);
  }

  function goToPage(i: number) {
    setPage(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <section
        className="relative px-[18px] pt-12 pb-12 sm:px-6 sm:pt-16 sm:pb-[34px] lg:px-8"
        style={{ background: "linear-gradient(180deg, #FBEFEC 0%, rgba(251,239,236,0) 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[120px] -right-[100px] h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(242,102,47,.18), rgba(201,48,124,.1) 55%, rgba(43,107,184,0) 72%)",
            animation: "vlPulse 12s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[34px] right-[16%] h-8 w-5 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-40"
          style={{
            background: "linear-gradient(140deg, #7A3AA0, #2B6BB8)",
            animation: "vlFloat 10s ease-in-out infinite",
          }}
        />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="flex items-end justify-between gap-7 max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-5">
            <div>
              <div className="mb-[14px] text-sm font-bold tracking-[1.6px] text-coral uppercase">
                {t("pageTitle")}
              </div>
              <h1 className="mb-4 font-heading text-[36px] leading-[1.1] font-extrabold tracking-[-.6px] text-navy sm:text-[46px] sm:tracking-[-1px]">
                {t("h1")}
              </h1>
              <p className="max-w-[620px] text-lg leading-[1.65] text-navy-soft">{t("intro")}</p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap justify-end gap-2 max-[1100px]:justify-start">
              <button
                type="button"
                onClick={() => pick("ALL")}
                className="rounded-full border-[1.5px] px-4 py-[9px] font-heading text-[13.5px] font-bold tracking-[.3px] transition-[border-color,color,background-color] duration-[250ms] ease-in-out"
                style={{
                  background: active === "ALL" ? "#5252AC" : "transparent",
                  color: active === "ALL" ? "#fff" : "#4A5480",
                  borderColor: active === "ALL" ? "#5252AC" : "rgba(30,42,90,.18)",
                }}
              >
                {t("categoryAll")}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => pick(c.id)}
                  className="rounded-full border-[1.5px] px-4 py-[9px] font-heading text-[13.5px] font-bold tracking-[.3px] uppercase transition-[border-color,color,background-color] duration-[250ms] ease-in-out"
                  style={{
                    background: active === c.id ? "#5252AC" : "transparent",
                    color: active === c.id ? "#fff" : "#4A5480",
                    borderColor: active === c.id ? "#5252AC" : "rgba(30,42,90,.18)",
                  }}
                >
                  {pickLocalized(c, "name", locale)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-[18px] pt-12 pb-12 sm:px-6 sm:pt-[10px] sm:pb-[90px] lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          {filtered.length === 0 ? (
            <p className="text-navy-soft">{active === "ALL" ? t("empty") : t("emptyInCategory")}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 min-[641px]:grid-cols-2 min-[1025px]:grid-cols-3 min-[1101px]:grid-cols-4">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} locale={locale} product={{ ...p, price: p.price.toString() }} />
                ))}
              </div>

              {pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-[14px]">
                  <button
                    type="button"
                    onClick={() => goToPage(Math.max(0, current - 1))}
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
                        onClick={() => goToPage(i)}
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
                    onClick={() => goToPage(Math.min(pages - 1, current + 1))}
                    aria-label={t("nextPageAria")}
                    style={{ opacity: current === pages - 1 ? 0.4 : 1 }}
                    className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
