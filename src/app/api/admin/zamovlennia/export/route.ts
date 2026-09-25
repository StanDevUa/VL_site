import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { buildOrdersWhere } from "@/lib/orders-filter";

/**
 * Захист сесією тут обов'язковий вручну — middleware (src/proxy.ts) свідомо
 * не чіпає /api/*, тому без цієї перевірки список замовлень (ПІБ, телефон)
 * був би доступний будь-кому за прямим посиланням.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const dateFrom = searchParams.get("dateFrom") ?? undefined;
  const dateTo = searchParams.get("dateTo") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const productId = searchParams.get("productId") ?? undefined;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ select: { id: true } }),
    prisma.product.findMany({ select: { id: true } }),
  ]);

  const where = buildOrdersWhere(
    { dateFrom, dateTo, status, categoryId, productId },
    new Set(categories.map((c) => c.id)),
    new Set(products.map((p) => p.id)),
  );

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const header = ["Дата замовлення", "№ замовлення", "Покупець", "Контакт", "Сума", "Статус"];
  const rows = orders.map((order) => [
    formatDate(order.createdAt, "uk", { day: "2-digit", month: "2-digit", year: "numeric" }),
    order.orderNumber,
    order.recipientName,
    order.recipientPhone,
    order.subtotal.toString(),
    ORDER_STATUS_LABELS[order.status],
  ]);

  const csv = [header, ...rows].map((row) => row.map(escapeCell).join(";")).join("\r\n");
  // BOM — без нього Excel показує кирилицю в CSV як "кракозябри".
  const csvWithBom = "﻿" + csv;

  return new NextResponse(csvWithBom, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="zamovlennia-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
