"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";

export function HomeAddToCartButton({ productId }: { productId: string }) {
  const common = useTranslations("Common");
  const { getQuantity, addItem } = useCart();
  const qty = getQuantity(productId);

  if (qty > 0) {
    return (
      <button
        type="button"
        onClick={() => addItem(productId)}
        title={common("addOneMore")}
        className="inline-flex shrink-0 items-center gap-[7px] whitespace-nowrap border-0 bg-transparent p-0 font-heading text-sm font-bold text-indigo transition-colors duration-[250ms] ease-in-out hover:text-magenta"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {common("inCart")}
        <span className="flex h-[21px] min-w-[21px] items-center justify-center rounded-full bg-indigo/12 px-1.5 text-xs">
          {qty}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      className="shrink-0 whitespace-nowrap rounded-field border-[1.5px] border-navy/18 bg-white px-4 py-[11px] font-heading text-sm font-bold text-navy transition-[border-color,color,translate] duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:border-magenta hover:text-magenta"
    >
      {common("addToCart")}
    </button>
  );
}
