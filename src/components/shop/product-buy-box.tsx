"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format-price";

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h13l-1.4 8.4a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.7L6 7 5.4 4H3" />
      <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ProductBuyBox({ productId, price }: { productId: string; price: string }) {
  const { getQuantity, addItem } = useCart();
  const t = useTranslations("Shop");
  const common = useTranslations("Common");
  const [qty, setQty] = useState(1);
  const inCart = getQuantity(productId);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="mb-1 text-[14.5px] text-navy-soft">{t("pricePerUnit")}</p>
          <p className="font-heading text-[30px] font-extrabold tracking-[-.7px] text-navy">{formatPrice(price)}</p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-[14.5px] text-navy-soft">{t("inCart")}</p>
          <p
            className="font-heading text-[30px] font-extrabold tracking-[-.7px]"
            style={{ color: inCart > 0 ? "#5252AC" : "#4A5480" }}
          >
            {inCart}
          </p>
        </div>
      </div>

      <div className="my-6 h-px bg-navy/12" />

      <div className="grid grid-cols-2 items-center gap-x-3 gap-y-[22px] max-sm:grid-cols-[auto_1fr]">
        <div className="col-span-2 flex items-center gap-3.5 max-sm:col-start-1 max-sm:col-span-1">
          <span className="text-[15.5px] text-navy-soft">{t("quantity")}</span>
          <div className="flex items-center rounded-field border-[1.5px] border-navy/16 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border-0 bg-transparent font-heading text-[17px] font-bold text-navy-soft transition-colors duration-200 ease-in-out hover:text-magenta"
            >
              −
            </button>
            <span className="min-w-[26px] text-center font-heading text-[15px] font-bold text-navy">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border-0 bg-transparent font-heading text-[17px] font-bold text-navy-soft transition-colors duration-200 ease-in-out hover:text-magenta"
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
          className="w-full rounded-field bg-indigo px-7 py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover max-sm:col-start-2 max-sm:w-auto max-sm:justify-self-end max-sm:px-5 max-sm:py-[13px] max-sm:text-[15px]"
        >
          {common("addToCart")}
        </button>
        <Link
          href="/cart"
          className="inline-flex w-full items-center justify-center gap-2.5 rounded-field border-[1.5px] border-navy/18 px-7 py-[15px] font-heading text-base font-bold text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta max-sm:col-span-2 max-sm:w-auto max-sm:justify-self-center"
        >
          <CartIcon />
          {t("goToCart")}
        </Link>
      </div>
    </div>
  );
}
