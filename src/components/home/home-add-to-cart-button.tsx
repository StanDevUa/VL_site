"use client";

import { useTranslations } from "next-intl";
import { useCart } from "@/lib/cart-context";

export function HomeAddToCartButton({ productId }: { productId: string }) {
  const common = useTranslations("Common");
  const { addItem } = useCart();

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
