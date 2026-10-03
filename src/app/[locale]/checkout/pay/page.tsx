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
    include: { items: { include: { product: { include: { category: true } } } } },
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

  // За рекомендацією підтримки WayForPay — товари передаються як ОКРЕМІ
  // позиції "Оплата за товари: ..." / "Оплата за послуги: ..." (а не рядком
  // на кожен товар), щоб саме так виглядало призначення платежу в чеку.
  // Товар без category.isService (або взагалі без зв'язаного продукту,
  // якщо його видалили поки клієнт оформлював замовлення) вважається товаром.
  // Самі назви товарів НЕ беремо в лапки вручну — WayForPay сам бере назву
  // позиції в лапки при відображенні, тож ручні лапки давали подвійні.
  // Ціну теж НЕ дублюємо в назві — WayForPay сам дописує суму позиції у
  // дужках в кінці, тож своя ціна в тексті давала задвоєння.
  const isServiceItem = (item: (typeof order.items)[number]) =>
    item.product?.category.isService ?? false;
  const sumOf = (items: typeof order.items) =>
    items.reduce((sum, i) => sum + Number(i.priceSnapshot) * i.quantity, 0);

  const goodsItems = order.items.filter((i) => !isServiceItem(i));
  const serviceItems = order.items.filter((i) => isServiceItem(i));

  const positions = [
    goodsItems.length > 0 && {
      name: `Оплата за товари: ${goodsItems.map((i) => i.nameUkSnapshot).join(", ")}`,
      total: sumOf(goodsItems),
    },
    serviceItems.length > 0 && {
      name: `Оплата за послуги: ${serviceItems.map((i) => i.nameUkSnapshot).join(", ")}`,
      total: sumOf(serviceItems),
    },
  ].filter((p): p is { name: string; total: number } => p !== false);

  const productName = positions.map((p) => p.name);
  const productCount = positions.map(() => 1);
  const productPrice = positions.map((p) => p.total.toFixed(2));

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
