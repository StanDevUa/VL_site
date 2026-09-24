"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { getOrderStatus } from "@/server/actions/checkout";
import type { OrderStatus } from "@prisma/client";

export default function CheckoutSuccessPage() {
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { clear } = useCart();
  const [status, setStatus] = useState<OrderStatus | null | "loading">("loading");

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;
    getOrderStatus(orderNumber).then((result) => {
      if (!cancelled) setStatus(result);
    });
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  const note =
    status === "PAID"
      ? t("paidNote")
      : status === "CANCELLED"
        ? t("cancelledNote")
        : status === null
          ? t("notFoundNote")
          : t("pendingNote");

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
      {status !== "loading" && <p className="text-navy-soft mb-10">{note}</p>}
      <Link
        href="/shop"
        className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
      >
        {common("toShop")}
      </Link>
    </main>
  );
}
