"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";

/** Кнопка на картці товару в каталозі/рекомендованих — без степера кількості (він лише на сторінці товару). */
export function AddToCartButton({ productId }: { productId: string }) {
  const { getQuantity, addItem } = useCart();
  const common = useTranslations("Common");
  const qty = getQuantity(productId);

  if (qty > 0) {
    return (
      <button
        type="button"
        onClick={() => addItem(productId)}
        className="inline-flex shrink-0 items-center gap-2 rounded-button bg-indigo/10 px-4 py-2.5 text-sm font-bold text-indigo transition-colors hover:bg-indigo/15"
      >
        ✓ {common("cart")}
        <span className="rounded-full bg-indigo/20 px-2 py-0.5 text-xs">{qty}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      className="shrink-0 rounded-button border border-navy/18 px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:border-magenta hover:text-magenta"
    >
      {common("addToCart")}
    </button>
  );
}
