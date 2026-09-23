"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";

export default function CheckoutSuccessPage() {
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="max-w-2xl mx-auto px-8 py-24 text-center">
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-4">
        {t("successTitle")}
      </h1>
      {orderNumber && (
        <p className="text-navy-soft mb-2">
          {t("orderNumberLabel")} <span className="font-bold text-navy">{orderNumber}</span>
        </p>
      )}
      <p className="text-navy-soft mb-10">{t("successNote")}</p>
      <Link
        href="/shop"
        className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
      >
        {common("toShop")}
      </Link>
    </main>
  );
}
