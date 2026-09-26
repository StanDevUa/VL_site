import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { signWayForPay } from "@/lib/wayforpay";
import { primaryButtonClass } from "@/components/ui/button-styles";
import { AutoSubmitForm } from "@/components/checkout/auto-submit-form";

/** Скільки секунд клієнт може оплачувати замовлення на стороні WayForPay, перш ніж вони самі відхилять спробу як прострочену. */
const ORDER_LIFETIME_SECONDS = 3600;

export default async function CheckoutPayPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
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
    redirect(`/checkout/success?order=${order.orderNumber}`);
  }

  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT!;
  const merchantDomainName = process.env.WAYFORPAY_MERCHANT_DOMAIN!;
  const baseUrl = process.env.APP_BASE_URL!;
  const orderDate = Math.floor(order.createdAt.getTime() / 1000);
  const amount = Number(order.subtotal).toFixed(2);
  const productName = order.items.map((i) => i.nameUkSnapshot);
  const productCount = order.items.map((i) => i.quantity);
  const productPrice = order.items.map((i) => Number(i.priceSnapshot).toFixed(2));

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
      <p className="text-navy-soft mb-6">Перенаправляємо на сторінку оплати…</p>

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
          value={`${baseUrl}/api/payments/wayforpay/return?order=${order.orderNumber}`}
        />
        <button type="submit" className={primaryButtonClass}>
          Перейти до оплати
        </button>
      </form>

      <AutoSubmitForm formId="wfp-form" />
    </main>
  );
}
