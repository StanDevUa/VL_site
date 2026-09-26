import { NextRequest, NextResponse } from "next/server";

/**
 * WayForPay повертає покупця на returnUrl кросдоменним POST зі своєї сторінки
 * оплати — App Router намагається трактувати БУДЬ-ЯКИЙ POST на сторінку як
 * виклик Server Action і падає ("Failed to find Server Action"), навіть якщо
 * дозволити origin через allowedOrigins. Рішення — не сторінка, а Route
 * Handler: він не бере участі в механізмі Server Actions, тож приймає POST
 * без проблем, а сам лише редиректить покупця на реальну сторінку успіху
 * звичайним GET.
 */
function redirectToSuccess(request: NextRequest) {
  const order = request.nextUrl.searchParams.get("order");
  // request.url — це внутрішня адреса за Caddy (localhost:PORT), не публічний
  // домен, тому будуємо абсолютний URL з APP_BASE_URL (так само, як serviceUrl/
  // returnUrl самого WayForPay в checkout/pay/page.tsx), а не з request.url.
  const target = new URL("/checkout/success", process.env.APP_BASE_URL!);
  if (order) target.searchParams.set("order", order);
  return NextResponse.redirect(target, 303);
}

export async function POST(request: NextRequest) {
  return redirectToSuccess(request);
}

export async function GET(request: NextRequest) {
  return redirectToSuccess(request);
}
