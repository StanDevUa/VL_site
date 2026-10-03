import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { signWayForPay } from "@/lib/wayforpay";
import { primaryButtonClass } from "@/components/ui/button-styles";
import { AutoSubmitForm } from "@/components/checkout/auto-submit-form";
import { redirect } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

/** Скільки секунд клієнт може оплачувати замовлення на стороні WayForPay, перш ніж вони самі відхилять спробу як прострочену. */
const ORDER_LIFETIME_SECONDS = 3600;

export default async function CheckoutPayPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) {
    notFound();
  }

  if (order.status !== "PENDING_PAYMENT") {
    redirect({
      href: { pathname: "/checkout/success", query: { order: order.orderNumber } },
      locale,
    });
  }

  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
  const merchantDomainName = process.env.WAYFORPAY_MERCHANT_DOMAIN!;
  const baseUrl = process.env.APP_BASE_URL!;
  const orderDate = Math.floor(order.createdAt.getTime() / 1000);
  const amount = Number(order.subtotal).toFixed(2);
  // За рекомендацією підтримки WayForPay — усі товари передаються як ОДНА
  // позиція з назвою "Оплата за товари: ..." (а не окремим рядком на товар),
  // щоб саме так виглядало призначення платежу в чеку/банківській виписці.
  const productName = [
    `Оплата за товари: ${order.items.map((i) => `"${i.nameUkSnapshot}"`).join(", ")}`,
  ];
  const productCount = [1];
  const productPrice = [amount];

  const signature = signWayForPay([
    merchantAccount,
    merchantDomainName,
    order.orderNumber,
    orderDate,
    amount,
    order.currency,
    ...productName,
    ...productCount,
    ...productPrice,
  ]);

  return (
    <main className="max-w-xl mx-auto px-8 py-24 text-center">
      <p className="text-navy-soft mb-6">{t("redirectingToPayment")}</p>

      <form id="wfp-form" method="POST" action="https://secure.wayforpay.com/pay">
        <input type="hidden" name="merchantAccount" value={merchantAccount} />
        <input type="hidden" name="merchantDomainName" value={merchantDomainName} />
        <input type="hidden" name="merchantSignature" value={signature} />
        <input type="hidden" name="merchantTransactionSecureType" value="AUTO" />
        <input type="hidden" name="orderLifetime" value={ORDER_LIFETIME_SECONDS} />
        <input type="hidden" name="orderReference" value={order.orderNumber} />
        <input type="hidden" name="orderDate" value={orderDate} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="currency" value={order.currency} />
        {productName.map((name, i) => (
          <input key={`n${i}`} type="hidden" name="productName[]" value={name} />
        ))}
        {productCount.map((count, i) => (
          <input key={`c${i}`} type="hidden" name="productCount[]" value={count} />
        ))}
        {productPrice.map((price, i) => (
          <input key={`p${i}`} type="hidden" name="productPrice[]" value={price} />
        ))}
        <input
          type="hidden"
          name="serviceUrl"
          value={`${baseUrl}/api/payments/wayforpay/callback`}
        />
        <input
          type="hidden"
          name="returnUrl"
          value={`${baseUrl}/api/payments/wayforpay/return?order=${order.orderNumber}&locale=${locale}`}
        />
        <button type="submit" className={primaryButtonClass}>
          {t("goToPayment")}
        </button>
      </form>

      <AutoSubmitForm formId="wfp-form" />
    </main>
  );
}
