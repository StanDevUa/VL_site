import Link from "next/link";
import { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format-date";
import { formatPrice } from "@/lib/format-price";
import { ORDER_STATUS_LABELS, ORDER_STATUS_BADGE_CLASS } from "@/lib/order-status";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import { CustomSelect } from "@/components/admin/custom-select";

const PAGE_SIZE = 15;

const selectClass =
  "w-full rounded-field border border-navy/15 px-3 py-2 text-sm text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-xs font-bold text-navy-soft mb-1.5";

type SearchParams = {
  page?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  categoryId?: string;
  productId?: string;
};

export default async function AdminOrdersListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { page, dateFrom, dateTo, status, categoryId, productId } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

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

  const andConditions: Prisma.OrderWhereInput[] = [];
  if (activeStatus) andConditions.push({ status: activeStatus });
  if (dateFrom) andConditions.push({ createdAt: { gte: new Date(dateFrom) } });
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    andConditions.push({ createdAt: { lte: end } });
  }
  if (activeProductId) {
    andConditions.push({ items: { some: { productId: activeProductId } } });
  } else if (activeCategoryId) {
    andConditions.push({ items: { some: { product: { categoryId: activeCategoryId } } } });
  }
  const where: Prisma.OrderWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">Замовлення</h1>
        <p className="text-sm text-navy-soft">
          Знайдено: <span className="font-bold text-navy">{total}</span>
        </p>
      </div>

      <form
        method="get"
        className="bg-white rounded-card border border-navy/10 p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3 items-end"
      >
        <div>
          <label className={labelClass}>Від</label>
          <input type="date" name="dateFrom" defaultValue={dateFrom ?? ""} className={selectClass} />
        </div>
        <div>
          <label className={labelClass}>До</label>
          <input type="date" name="dateTo" defaultValue={dateTo ?? ""} className={selectClass} />
        </div>
        <div>
          <label className={labelClass}>Статус</label>
          <CustomSelect
            name="status"
            defaultValue={activeStatus ?? ""}
            placeholder="Усі"
            options={[
              { value: "", label: "Усі" },
              ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
        </div>
        <div>
          <label className={labelClass}>Категорія</label>
          <CustomSelect
            name="categoryId"
            defaultValue={activeCategoryId ?? ""}
            placeholder="Усі"
            options={[
              { value: "", label: "Усі" },
              ...categories.map((c) => ({ value: c.id, label: c.nameUk })),
            ]}
          />
        </div>
        <div>
          <label className={labelClass}>Товар</label>
          <CustomSelect
            name="productId"
            defaultValue={activeProductId ?? ""}
            placeholder="Усі"
            options={[
              { value: "", label: "Усі" },
              ...products.map((p) => ({ value: p.id, label: p.nameUk })),
            ]}
          />
        </div>
        <div className="col-span-2 md:col-span-5 flex gap-3">
          <button type="submit" className={primaryButtonClass}>
            Застосувати
          </button>
          <Link href="/admin/zamovlennia" className={secondaryButtonClass}>
            Скинути
          </Link>
        </div>
      </form>

      {orders.length === 0 ? (
        <p className="text-navy-soft">Замовлень за цими фільтрами не знайдено.</p>
      ) : (
        <>
          <div className="bg-white rounded-card border border-navy/10 divide-y divide-navy/10">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/zamovlennia/${order.id}`}
                className="flex items-center gap-4 p-4 hover:bg-powder-pink/40 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-navy">{order.orderNumber}</p>
                    <span
                      className={
                        "shrink-0 text-xs font-bold px-2 py-0.5 rounded-field " +
                        ORDER_STATUS_BADGE_CLASS[order.status]
                      }
                    >
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-navy-soft truncate">
                    {order.recipientName} · {formatDate(order.createdAt, "uk", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </p>
                </div>
                <p className="shrink-0 font-bold text-navy">{formatPrice(order.subtotal.toString())}</p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
