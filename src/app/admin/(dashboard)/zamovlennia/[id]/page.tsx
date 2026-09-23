import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";
import { formatPrice } from "@/lib/format-price";
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";
import { OrderStatusActions } from "@/components/admin/order-status-actions";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl">
      <Link href="/admin/zamovlennia" className="text-sm font-bold text-indigo hover:underline">
        ← Усі замовлення
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-8">
        <h1 className="font-heading font-extrabold text-2xl text-navy">{order.orderNumber}</h1>
        <span
          className={
            "text-xs font-bold px-2.5 py-1 rounded-field " + ORDER_STATUS_BADGE_CLASS[order.status]
          }
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-6">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">Товари</h2>
        <div className="divide-y divide-navy/10">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-bold text-navy">{item.nameUkSnapshot}</p>
                <p className="text-sm text-navy-soft">
                  {formatPrice(item.priceSnapshot.toString())} × {item.quantity}
                </p>
              </div>
              <p className="font-bold text-navy">
                {formatPrice(Number(item.priceSnapshot) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-navy/10 pt-4 mt-2">
          <p className="font-bold text-navy">Разом:</p>
          <p className="font-heading font-extrabold text-xl text-navy">
            {formatPrice(order.subtotal.toString())}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Контакти</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-navy-soft">Ім&apos;я: </span>
              <span className="font-bold text-navy">{order.recipientName}</span>
            </p>
            <p>
              <span className="text-navy-soft">Телефон: </span>
              <span className="font-bold text-navy">{order.recipientPhone}</span>
            </p>
            <p>
              <span className="text-navy-soft">Email: </span>
              <span className="font-bold text-navy">{order.recipientEmail}</span>
            </p>
          </div>
        </div>

        <div className="rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">Доставка</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-navy-soft">Місто: </span>
              <span className="font-bold text-navy">{order.novaPoshtaCityName}</span>
            </p>
            <p>
              <span className="text-navy-soft">Відділення: </span>
              <span className="font-bold text-navy">{order.novaPoshtaWarehouseName}</span>
            </p>
            {order.comment && (
              <p>
                <span className="text-navy-soft">Коментар: </span>
                <span className="font-bold text-navy">{order.comment}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-6">
        <p className="text-sm text-navy-soft">
          Створено:{" "}
          <span className="font-bold text-navy">
            {formatDate(order.createdAt, "uk", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </span>
        </p>
      </div>

      <OrderStatusActions orderId={order.id} status={order.status} />
    </div>
  );
}
