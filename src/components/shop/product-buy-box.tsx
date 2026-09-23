"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";

export function ProductBuyBox({ productId, price }: { productId: string; price: string }) {
  const { getQuantity, addItem } = useCart();
  const t = useTranslations("Shop");
  const common = useTranslations("Common");
  const [qty, setQty] = useState(1);
  const inCart = getQuantity(productId);

  return (
    <div>
      <div className="flex items-start justify-between gap-5 flex-wrap">
        <div>
          <p className="text-sm text-navy-soft mb-1">{t("pricePerUnit")}</p>
          <p className="font-heading font-extrabold text-3xl text-navy">{formatPrice(price)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-navy-soft mb-1">{t("inCart")}</p>
          <p className="font-heading font-extrabold text-3xl text-indigo">{inCart}</p>
        </div>
      </div>

      <div className="h-px bg-navy/10 my-6" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="sm:col-span-2 flex items-center gap-4">
          <span className="text-sm text-navy-soft">{t("quantity")}</span>
          <div className="flex items-center border border-navy/15 rounded-field p-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-9 h-9 rounded-field font-bold text-navy-soft hover:text-magenta transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center font-bold text-navy">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="w-9 h-9 rounded-field font-bold text-navy-soft hover:text-magenta transition-colors"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            addItem(productId, qty);
            setQty(1);
          }}
          className="rounded-button bg-indigo px-6 py-3.5 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover"
        >
          {common("addToCart")}
        </button>
        <Link
          href="/cart"
          className="flex items-center justify-center rounded-button border border-navy/18 px-6 py-3.5 font-heading font-bold text-navy transition-colors hover:border-magenta hover:text-magenta"
        >
          {t("goToCart")}
        </Link>
      </div>
    </div>
  );
}
