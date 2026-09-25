import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";
import { formatPrice } from "@/lib/format-price";
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";
import { OrdersFilterBar } from "@/components/admin/orders-filter-bar";
import { OrdersAutoRefresh } from "@/components/admin/orders-auto-refresh";
import { buildOrdersWhere } from "@/lib/orders-filter";
import { expireStaleOrders } from "@/lib/expire-stale-orders";

const PAGE_SIZE = 10;

type SearchParams = {
  page?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  categoryId?: string;
  productId?: string;
};

const thClass = "px-4 py-3 text-left text-xs font-bold text-navy-soft whitespace-nowrap";
const tdClass = "p-0";
const cellLinkClass = "block px-4 py-3 text-sm text-navy whitespace-nowrap";

/** Вікно навколо поточної сторінки + перша/остання, з "..." на пропусках — щоб при 30 сторінках не рендерити всі 30 кнопок підряд. */
function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const delta = 2;
  const pages = new Set<number>([1, total]);
  for (let i = current - delta; i <= current + delta; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export default async function AdminOrdersListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, dateFrom, dateTo, status, categoryId, productId } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  await expireStaleOrders();

  const activeStatus =
    status && Object.values(OrderStatus).includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, nameUk: true } }),
    prisma.product.findMany({ orderBy: { createdAt: "asc" }, select: { id: true, nameUk: true } }),
  ]);
  const activeCategoryId = categories.some((c) => c.id === categoryId) ? categoryId : undefined;
  const activeProductId = products.some((p) => p.id === productId) ? productId : undefined;

  const where = buildOrdersWhere(
    { dateFrom, dateTo, status, categoryId, productId },
    new Set(categories.map((c) => c.id)),
    new Set(products.map((p) => p.id)),
  );

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const queryFor = (p: number) => {
    const params = new URLSearchParams();
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (activeStatus) params.set("status", activeStatus);
    if (activeCategoryId) params.set("categoryId", activeCategoryId);
    if (activeProductId) params.set("productId", activeProductId);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/admin/zamovlennia?${qs}` : "/admin/zamovlennia";
  };

  return (
    <div>
      <OrdersAutoRefresh />
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">Замовлення</h1>
        <p className="text-sm text-navy-soft">
          Знайдено: <span className="font-bold text-navy">{total}</span>
        </p>
      </div>

      <OrdersFilterBar
        dateFrom={dateFrom}
        dateTo={dateTo}
        activeStatus={activeStatus}
        activeCategoryId={activeCategoryId}
        activeProductId={activeProductId}
        categories={categories}
        products={products}
      />

      {orders.length === 0 ? (
        <p className="text-navy-soft">Замовлень за цими фільтрами не знайдено.</p>
      ) : (
        <>
          <div className="bg-white rounded-card border border-navy/10 overflow-hidden overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10 bg-white">
                <tr className="border-b border-navy/10">
                  <th className={thClass}>Дата замовлення</th>
                  <th className={thClass}>№ замовлення</th>
                  <th className={thClass}>Покупець</th>
                  <th className={thClass}>Контакт</th>
                  <th className={thClass}>Сума</th>
                  <th className={thClass}>Статус</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const href = `/admin/zamovlennia/${order.id}`;
                  return (
                    <tr key={order.id} className="border-b border-navy/10 last:border-0 hover:bg-powder-pink/40 transition-colors">
                      <td className={tdClass}>
                        <Link href={href} className={cellLinkClass}>
                          {formatDate(order.createdAt, "uk", { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </Link>
                      </td>
                      <td className={tdClass}>
                        <Link href={href} className={`${cellLinkClass} font-bold`}>
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className={tdClass}>
                        <Link href={href} className={`${cellLinkClass} max-w-[200px] truncate`}>
                          {order.recipientName}
                        </Link>
                      </td>
                      <td className={tdClass}>
                        <Link href={href} className={cellLinkClass}>
                          {order.recipientPhone}
                        </Link>
                      </td>
                      <td className={tdClass}>
                        <Link href={href} className={`${cellLinkClass} font-bold`}>
                          {formatPrice(order.subtotal.toString())}
                        </Link>
                      </td>
                      <td className={tdClass}>
                        <Link href={href} className={`${cellLinkClass} py-2.5`}>
                          <span
                            className={
                              "inline-block text-xs font-bold px-2 py-0.5 rounded-field " +
                              ORDER_STATUS_BADGE_CLASS[order.status]
                            }
                          >
                            {ORDER_STATUS_LABELS[order.status]}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
              {buildPageList(currentPage, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-navy-soft">
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={queryFor(p)}
                    className={
                      "w-10 h-10 flex items-center justify-center rounded-field font-bold text-sm " +
                      (p === currentPage
                        ? "bg-indigo text-white"
                        : "bg-white border border-navy/15 text-navy hover:border-magenta hover:text-magenta")
                    }
                  >
                    {p}
                  </Link>
                ),
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
