"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { getOrderStatus } from "@/server/actions/checkout";

type OrderInfo = Awaited<ReturnType<typeof getOrderStatus>>;

const MAX_POLL_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 3000;

function CheckIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Spinner() {
  return <span className="block h-9 w-9 animate-spin rounded-full border-[3.5px] border-indigo/15 border-t-indigo" />;
}

export default function CheckoutSuccessPage() {
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const { clear } = useCart();
  const [order, setOrder] = useState<OrderInfo | "loading">("loading");
  const [pollExhausted, setPollExhausted] = useState(false);

  // Редирект на цю сторінку може прийти РАНІШЕ, ніж WayForPay встигне
  // надіслати serviceUrl-вебхук, що оновлює статус замовлення в БД (це два
  // незалежні запити, без гарантованого порядку) — тож перевіряємо статус
  // не один раз, а періодично, поки він PENDING_PAYMENT, максимум ~1 хвилину.
  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;
    let attempts = 0;

    async function poll() {
      const result = await getOrderStatus(orderNumber!);
      if (cancelled) return;
      setOrder(result);
      attempts += 1;
      if (result?.status === "PENDING_PAYMENT") {
        if (attempts < MAX_POLL_ATTEMPTS) {
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
        } else {
          setPollExhausted(true);
        }
      }
    }
    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [orderNumber]);

  // Кошик очищаємо лише після підтвердженої оплати — якщо покупець скасував
  // оплату або вона ще не пройшла, товари мають лишитись, щоб можна було
  // спробувати оформити те саме замовлення ще раз.
  useEffect(() => {
    if (order !== "loading" && order?.status === "PAID") {
      clear();
    }
  }, [order, clear]);

  // Поки реальний статус не з'ясовано (ще не прийшла відповідь, або вебхук
  // від WayForPay ще в дорозі) — показуємо явний "перевіряємо", без кнопки
  // "До магазину": інакше покупець може піти, так і не побачивши підсумок.
  const isChecking = order === "loading" || (order?.status === "PENDING_PAYMENT" && !pollExhausted);

  const view = isChecking
    ? {
        icon: <Spinner />,
        iconClass: "bg-indigo/10",
        title: t("checkingTitle"),
        note: t("checkingNote"),
        showButton: false,
      }
    : order === null
      ? {
          icon: <XIcon />,
          iconClass: "bg-navy/8 text-navy-soft",
          title: t("notFoundTitle"),
          note: null,
          showButton: true,
        }
      : order.status === "PAID"
        ? {
            icon: <CheckIcon />,
            iconClass: "bg-indigo/10 text-indigo",
            title: t("successTitle"),
            note: t.rich("paidNote", {
              orderNo: orderNumber ?? "",
              warehouseName: order.novaPoshtaWarehouseName,
              cityName: order.novaPoshtaCityName,
              b: (chunks: React.ReactNode) => <strong className="text-navy">{chunks}</strong>,
            }),
            showButton: true,
          }
        : order.status === "CANCELLED"
          ? {
              icon: <XIcon />,
              iconClass: "bg-coral/10 text-coral",
              title: t("cancelledTitle"),
              note: t("cancelledNote"),
              showButton: true,
            }
          : {
              icon: <XIcon />,
              iconClass: "bg-navy/8 text-navy-soft",
              title: t("stillPendingTitle"),
              note: t("pendingNote"),
              showButton: true,
            };

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
          <span className={`mb-[22px] flex h-[68px] w-[68px] items-center justify-center rounded-[20px] ${view.iconClass}`}>
            {view.icon}
          </span>
          <div className="mb-3.5 font-heading text-[26px] leading-[1.2] font-extrabold text-navy">
            {view.title}
          </div>
          {orderNumber && (
            <p className="mb-1 text-sm text-navy-soft">
              {t("orderNumberLabel")} <span className="font-bold text-navy">{orderNumber}</span>
            </p>
          )}
          {view.note && <p className="mb-7 text-base leading-[1.7] text-navy-soft">{view.note}</p>}
          {view.showButton && (
            <Link
              href="/shop"
              className="inline-block rounded-button bg-indigo px-[34px] py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
            >
              {common("toShop")}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
