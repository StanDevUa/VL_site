"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { getCartProducts } from "@/server/actions/cart";
import { pickLocalized } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format-price";
import type { AppLocale } from "@/i18n/routing";

type CartProduct = {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string | null;
  nameRu: string | null;
  price: string;
  mainPhotoUrl: string;
  category: { nameUk: string; nameEn: string | null; nameRu: string | null };
};

function CartIcon({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h13l-1.4 8.4a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.7L6 7 5.4 4H3" />
      <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function CartPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Cart");
  const { items, setQuantity, removeItem } = useCart();
  const [products, setProducts] = useState<CartProduct[] | null>(null);

  useEffect(() => {
    const ids = items.map((i) => i.productId);
    if (ids.length === 0) return;

    let cancelled = false;
    getCartProducts(ids).then((data) => {
      if (!cancelled) setProducts(data);
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const quantityFor = (productId: string) =>
    items.find((i) => i.productId === productId)?.quantity ?? 0;

  // Фільтруємо застарілі товари (могли лишитись у fetched-стані вже після
  // видалення з кошика, поки не підвантажились свіжі дані).
  const visibleProducts = products?.filter((p) =>
    items.some((i) => i.productId === p.id),
  );

  const totalQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalSum =
    visibleProducts?.reduce((sum, p) => sum + Number(p.price) * quantityFor(p.id), 0) ?? 0;

  const isEmpty = items.length === 0;
  const isLoading = !isEmpty && !visibleProducts;

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

        <div className="relative mx-auto max-w-[1240px]">
          <div className="mb-3 text-sm font-bold tracking-[1.6px] text-coral uppercase">{t("eyebrow")}</div>
          <h1 className="mb-7 font-heading text-[40px] leading-[1.1] font-extrabold tracking-[-.9px] text-navy">
            {t("h1")}
          </h1>

          {isEmpty ? (
            <div className="flex flex-col items-center rounded-[16px] border border-navy/12 bg-white/90 px-8 py-[72px] text-center">
              <span className="mb-[22px] flex h-[74px] w-[74px] items-center justify-center rounded-[20px] bg-indigo/8 text-indigo">
                <CartIcon />
              </span>
              <div className="mb-2.5 font-heading text-[26px] font-extrabold text-navy">{t("emptyTitle")}</div>
              <p className="mb-[26px] max-w-[420px] text-base leading-[1.65] text-navy-soft">{t("emptyText")}</p>
              <Link
                href="/shop"
                className="rounded-button bg-indigo px-8 py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
              >
                {t("emptyCta")}
              </Link>
            </div>
          ) : isLoading ? null : (
            <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.65fr_1fr] lg:gap-9">
              <div className="flex flex-col gap-3">
                {visibleProducts!.map((p) => {
                  const qty = quantityFor(p.id);
                  return (
                    <div
                      key={p.id}
                      className="relative grid grid-cols-[84px_minmax(0,1fr)_auto_auto_auto] items-center gap-[18px] rounded-card border border-navy/12 bg-white px-[18px] py-3.5 max-sm:grid-cols-[1fr_auto_1fr] max-sm:grid-rows-[auto_auto] max-sm:gap-x-2.5 max-sm:gap-y-4 max-sm:p-3.5"
                    >
                      <Link
                        href={`/shop/${p.slug}`}
                        className="relative block h-[68px] w-[84px] overflow-hidden rounded-[10px] bg-navy/5 max-sm:col-start-1 max-sm:row-start-1 max-sm:h-14 max-sm:w-16 max-sm:justify-self-start"
                      >
                        <Image src={p.mainPhotoUrl} alt="" fill sizes="84px" className="object-cover" />
                      </Link>

                      <div className="max-sm:col-start-2 max-sm:col-end-4 max-sm:row-start-1 max-sm:pr-10">
                        <div className="mb-1 text-[11.5px] font-bold tracking-[.5px] text-navy-soft uppercase">
                          {pickLocalized(p.category, "name", locale)}
                        </div>
                        <Link
                          href={`/shop/${p.slug}`}
                          className="font-heading text-base leading-[1.3] font-bold text-navy transition-colors hover:text-magenta"
                        >
                          {pickLocalized(p, "name", locale)}
                        </Link>
                      </div>

                      <div className="text-right max-sm:col-start-1 max-sm:row-start-2 max-sm:justify-self-start max-sm:text-left">
                        <div className="mb-[3px] text-[12.5px] whitespace-nowrap text-navy-soft max-sm:text-xs">
                          {t("unitPrice")}
                        </div>
                        <div className="font-heading text-[15px] font-bold whitespace-nowrap text-navy-soft max-sm:text-sm">
                          {formatPrice(p.price)}
                        </div>
                      </div>

                      <div className="flex items-center rounded-[10px] border-[1.5px] border-navy/16 bg-white p-0.5 max-sm:col-start-2 max-sm:row-start-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(p.id, qty - 1)}
                          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border-0 bg-transparent font-heading text-base font-bold text-navy-soft transition-colors duration-200 ease-in-out hover:text-magenta"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center font-heading text-[14.5px] font-bold text-navy">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(p.id, qty + 1)}
                          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border-0 bg-transparent font-heading text-base font-bold text-navy-soft transition-colors duration-200 ease-in-out hover:text-magenta"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3.5 max-sm:col-start-3 max-sm:row-start-2 max-sm:justify-self-end">
                        <span className="min-w-[84px] whitespace-nowrap text-right font-heading text-lg font-extrabold text-navy max-sm:min-w-0 max-sm:text-base">
                          {formatPrice(Number(p.price) * qty)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(p.id)}
                          title={t("remove")}
                          className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] border-[1.5px] border-navy/14 bg-transparent text-navy-soft transition-[border-color,color] duration-200 ease-in-out hover:border-[#C0322C] hover:text-[#C0322C] max-sm:absolute max-sm:top-3 max-sm:right-3"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 6l12 12M18 6L6 18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                className="rounded-[16px] border border-navy/12 px-[26px] pt-[26px] pb-7 lg:sticky lg:top-[110px]"
                style={{ background: "linear-gradient(170deg, rgba(251,239,236,.8), rgba(255,253,252,.97))" }}
              >
                <div className="mb-5 font-heading text-xl font-extrabold text-navy">{t("summaryTitle")}</div>

                <div className="mb-2.5 flex justify-between gap-3 text-[15px] text-navy-soft">
                  <span>{t("itemsCount")}</span>
                  <span className="font-semibold text-navy">{totalQty}</span>
                </div>
                <div className="mb-2.5 flex justify-between gap-3 text-[15px] text-navy-soft">
                  <span>{t("sum")}</span>
                  <span className="font-semibold text-navy">{formatPrice(totalSum)}</span>
                </div>
                <div className="flex justify-between gap-3 text-[15px] text-navy-soft">
                  <span>{t("delivery")}</span>
                  <span className="text-right whitespace-nowrap text-navy-soft">{t("deliveryTariff")}</span>
                </div>

                <div className="my-5 h-px bg-navy/12" />

                <div className="mb-[22px] flex items-baseline justify-between gap-3">
                  <span className="font-heading text-base font-bold text-navy">{t("totalToPay")}</span>
                  <span className="whitespace-nowrap font-heading text-[28px] font-extrabold tracking-[-.6px] text-navy">
                    {formatPrice(totalSum)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block rounded-button bg-indigo px-6 py-[15px] text-center font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
                >
                  {t("checkout")}
                </Link>
                <Link
                  href="/shop"
                  className="mt-3 flex items-center justify-center gap-2.5 rounded-button border-[1.5px] border-navy/18 px-6 py-3.5 font-heading text-[15px] font-bold text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {t("continueShopping")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
