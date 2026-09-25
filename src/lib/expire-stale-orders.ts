import { prisma } from "@/lib/prisma";

/**
 * Замовлення, які висять в PENDING_PAYMENT довше цього часу, вважаємо
 * покинутими клієнтом (закрив вкладку оплати, нічого не ввівши — тоді
 * WayForPay взагалі не шле вебхук, бо не було жодної спроби транзакції).
 * 2 години — це вже на годину довше за orderLifetime (1 година) на сторінці
 * оплати, тож WayForPay й сам би відмовив у пізній оплаті — реальної оплати
 * "з запізненням", яку ми могли б випадково прогавити, тут статися не може.
 */
const STALE_AFTER_MS = 2 * 60 * 60 * 1000;

export async function expireStaleOrders(): Promise<void> {
  await prisma.order.updateMany({
    where: {
      status: "PENDING_PAYMENT",
      createdAt: { lt: new Date(Date.now() - STALE_AFTER_MS) },
    },
    data: { status: "CANCELLED" },
  });
}
