"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { getOrderStatus } from "@/server/actions/checkout";

type OrderInfo = Awaited<ReturnType<typeof getOrderStatus>>;

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CheckoutSuccessPage() {
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { clear } = useCart();
  const [order, setOrder] = useState<OrderInfo | "loading">("loading");

  useEffect(() => {
    clear();
  }, [clear]);

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;
    getOrderStatus(orderNumber).then((result) => {
      if (!cancelled) setOrder(result);
    });
    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  const note =
    order === "loading"
      ? null
      : order === null
        ? t("notFoundNote")
        : order.status === "PAID"
          ? t.rich("paidNote", {
              orderNo: orderNumber ?? "",
              warehouseName: order.novaPoshtaWarehouseName,
              cityName: order.novaPoshtaCityName,
              b: (chunks) => <strong className="text-navy">{chunks}</strong>,
            })
          : order.status === "CANCELLED"
            ? t("cancelledNote")
            : t("pendingNote");

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

        <div className="relative mx-auto flex max-w-[540px] flex-col items-center rounded-[18px] bg-white px-8 py-11 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,.25)] sm:px-10">
          <span className="mb-[22px] flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-indigo/10 text-indigo">
            <CheckIcon />
          </span>
          <div className="mb-3.5 font-heading text-[26px] leading-[1.2] font-extrabold text-navy">
            {t("successTitle")}
          </div>
          {orderNumber && (
            <p className="mb-1 text-sm text-navy-soft">
              {t("orderNumberLabel")} <span className="font-bold text-navy">{orderNumber}</span>
            </p>
          )}
          {note && <p className="mb-7 text-base leading-[1.7] text-navy-soft">{note}</p>}
          <Link
            href="/shop"
            className="inline-block rounded-button bg-indigo px-[34px] py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
          >
            {common("toShop")}
          </Link>
        </div>
      </section>
    </main>
  );
}
