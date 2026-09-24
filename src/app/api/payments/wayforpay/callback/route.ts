import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signWayForPay } from "@/lib/wayforpay";

/**
 * WayForPay після спроби оплати шле сюди серверний POST (незалежно від
 * редиректу клієнта на returnUrl) — тільки тут можна довіряти статусу оплати.
 * Відповідь має бути саме в такому форматі "accept", інакше WayForPay
 * повторюватиме запит.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();

  const expectedSignature = signWayForPay([
    body.merchantAccount,
    body.orderReference,
    body.amount,
    body.currency,
    body.authCode,
    body.cardPan,
    body.transactionStatus,
    body.reasonCode,
  ]);

  if (expectedSignature === body.merchantSignature && body.transactionStatus === "Approved") {
    await prisma.order.updateMany({
      where: { orderNumber: body.orderReference, status: "PENDING_PAYMENT" },
      data: {
        status: "PAID",
        paidAt: new Date(),
        wayforpayOrderReference: body.orderReference,
        wayforpayStatus: body.transactionStatus,
      },
    });
  }

  const time = Math.floor(Date.now() / 1000);

  return NextResponse.json({
    orderReference: body.orderReference,
    status: "accept",
    time,
    signature: signWayForPay([body.orderReference, "accept", time]),
  });
}
