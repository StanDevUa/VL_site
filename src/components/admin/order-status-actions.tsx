"use client";

import type { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/server/actions/orders";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";

export function OrderStatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  if (status === "SHIPPED" || status === "CANCELLED") return null;

  return (
    <div className="flex flex-wrap gap-3">
      {status === "PENDING_PAYMENT" && (
        <form action={updateOrderStatus.bind(null, orderId, "PAID")}>
          <button type="submit" className={primaryButtonClass}>
            Позначити оплаченим
          </button>
        </form>
      )}
      {status === "PAID" && (
        <form action={updateOrderStatus.bind(null, orderId, "SHIPPED")}>
          <button type="submit" className={primaryButtonClass}>
            Позначити відправленим
          </button>
        </form>
      )}
      <form
        action={updateOrderStatus.bind(null, orderId, "CANCELLED")}
        onSubmit={(e) => {
          if (!confirm("Скасувати замовлення? Це не можна відмінити.")) {
            e.preventDefault();
          }
        }}
      >
        <button type="submit" className={secondaryButtonClass}>
          Скасувати замовлення
        </button>
      </form>
    </div>
  );
}
