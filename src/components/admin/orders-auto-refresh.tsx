"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Тиха перевірка нових замовлень — router.refresh() перезапускає лише
 * серверний рендер поточної сторінки (без повного перезавантаження і без
 * втрати скролу/стану), просто щоб не тримати вебсокети/поллінг заради
 * невеликого адмінського списку.
 */
export function OrdersAutoRefresh({ intervalMs = 120_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
