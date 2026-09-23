import type { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Очікує оплати",
  PAID: "Оплачено",
  SHIPPED: "Відправлено",
  CANCELLED: "Скасовано",
};

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "text-navy-soft bg-navy/5",
  PAID: "text-indigo bg-indigo/10",
  SHIPPED: "text-blue bg-blue/10",
  CANCELLED: "text-red-600 bg-red-50",
};
