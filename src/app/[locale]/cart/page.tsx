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
};

export default function CartPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Cart");
  const common = useTranslations("Common");
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

  const subtotal =
    visibleProducts?.reduce((sum, p) => sum + Number(p.price) * quantityFor(p.id), 0) ?? 0;

  return (
    <main className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-10">{t("pageTitle")}</h1>

      {items.length === 0 ? (
        <div>
          <p className="text-navy-soft mb-6">{t("empty")}</p>
          <Link
            href="/shop"
            className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
          >
            {common("toShop")}
          </Link>
        </div>
      ) : !visibleProducts ? null : (
        <>
          <div className="rounded-card border border-navy/10 bg-white divide-y divide-navy/10 mb-8">
            {visibleProducts.map((p) => {
              const qty = quantityFor(p.id);
              return (
                <div key={p.id} className="flex items-center gap-4 p-5 flex-wrap">
                  <Image
                    src={p.mainPhotoUrl}
                    alt=""
                    width={90}
                    height={68}
                    className="rounded-field object-cover w-[90px] h-[68px] shrink-0"
                  />
                  <div className="flex-1 min-w-[160px]">
                    <Link
                      href={`/shop/${p.slug}`}
                      className="font-bold text-navy hover:text-magenta transition-colors"
                    >
                      {pickLocalized(p, "name", locale)}
                    </Link>
                    <p className="text-sm text-navy-soft mt-1">{formatPrice(p.price)}</p>
                  </div>
                  <div className="flex items-center border border-navy/15 rounded-field p-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(p.id, qty - 1)}
                      className="w-8 h-8 rounded-field font-bold text-navy-soft hover:text-magenta transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-navy">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(p.id, qty + 1)}
                      className="w-8 h-8 rounded-field font-bold text-navy-soft hover:text-magenta transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-24 text-right font-bold text-navy shrink-0">
                    {formatPrice(Number(p.price) * qty)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(p.id)}
                    className="shrink-0 text-sm font-bold text-red-600 hover:underline"
                  >
                    {t("remove")}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-navy">{t("subtotal")}</p>
            <p className="font-heading font-extrabold text-2xl text-navy">
              {formatPrice(subtotal)}
            </p>
          </div>
          <p className="text-sm text-navy-soft mb-8">{t("deliveryHint")}</p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/checkout"
              className="rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover"
            >
              {t("checkout")}
            </Link>
            <Link
              href="/shop"
              className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
            >
              {common("toShop")}
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
