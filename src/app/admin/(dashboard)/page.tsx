import { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format-price";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { StatCard, PeriodFilterBar } from "@/components/admin/stat-card";

type LeadsPeriod = "today" | "7d" | "30d" | "all";
type FinancePeriod = "month" | "all";

const LEADS_PERIODS: { value: LeadsPeriod; label: string }[] = [
  { value: "today", label: "Сьогодні" },
  { value: "7d", label: "7 днів" },
  { value: "30d", label: "30 днів" },
  { value: "all", label: "Весь час" },
];

const FINANCE_PERIODS: { value: FinancePeriod; label: string }[] = [
  { value: "month", label: "Цей місяць" },
  { value: "all", label: "Весь час" },
];

function periodStart(period: LeadsPeriod | FinancePeriod): Date | undefined {
  const now = new Date();
  switch (period) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "all":
      return undefined;
  }
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ leadsPeriod?: string; financePeriod?: string }>;
}) {
  const { leadsPeriod: leadsPeriodRaw, financePeriod: financePeriodRaw } = await searchParams;

  const leadsPeriod: LeadsPeriod = LEADS_PERIODS.some((p) => p.value === leadsPeriodRaw)
    ? (leadsPeriodRaw as LeadsPeriod)
    : "7d";
  const financePeriod: FinancePeriod = financePeriodRaw === "all" ? "all" : "month";

  const leadsSince = periodStart(leadsPeriod);
  const financeSince = periodStart(financePeriod);

  const [
    pendingShipmentCount,
    faqCount,
    consultationCount,
    statusGroups,
    revenue,
    productsCount,
    worksCount,
    newsCount,
    testimonialsCount,
  ] = await Promise.all([
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.faqQuestion.count({ where: leadsSince ? { createdAt: { gte: leadsSince } } : undefined }),
    prisma.consultationRequest.count({
      where: leadsSince ? { createdAt: { gte: leadsSince } } : undefined,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: financeSince ? { createdAt: { gte: financeSince } } : undefined,
    }),
    prisma.order.aggregate({
      where: {
        status: { in: ["PAID", "SHIPPED"] },
        ...(financeSince ? { createdAt: { gte: financeSince } } : {}),
      },
      _sum: { subtotal: true },
    }),
    prisma.product.count(),
    prisma.portfolioWork.count(),
    prisma.newsPost.count(),
    prisma.testimonial.count(),
  ]);

  const leadsTotal = faqCount + consultationCount;
  const revenueTotal = formatPrice(revenue._sum.subtotal?.toString() ?? "0");

  const statusCounts: Record<OrderStatus, number> = {
    PENDING_PAYMENT: 0,
    PAID: 0,
    SHIPPED: 0,
    CANCELLED: 0,
  };
  for (const group of statusGroups) {
    statusCounts[group.status] = group._count._all;
  }

  const leadsHref = (value: string) => `/admin?leadsPeriod=${value}&financePeriod=${financePeriod}`;
  const financeHref = (value: string) => `/admin?leadsPeriod=${leadsPeriod}&financePeriod=${value}`;

  return (
    <div className="space-y-8">
      <h1 className="font-heading font-extrabold text-2xl text-navy">Актуальні показники</h1>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-lg text-navy">Що потребує уваги</h2>
          <PeriodFilterBar hrefFor={leadsHref} options={LEADS_PERIODS} active={leadsPeriod} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard
            label="В обробці"
            value={pendingShipmentCount}
            caption="Оплачено, ще не відправлено"
            href="/admin/zamovlennia?status=PAID"
          />
          <StatCard
            label="Нові заявки"
            value={leadsTotal}
            caption={`Питання з FAQ: ${faqCount} · Записи на консультацію: ${consultationCount}`}
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-lg text-navy">Мої фінансові показники</h2>
          <PeriodFilterBar hrefFor={financeHref} options={FINANCE_PERIODS} active={financePeriod} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard label="Виручка" value={revenueTotal} caption="Оплачені замовлення" />
          {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
            <StatCard key={status} label={ORDER_STATUS_LABELS[status]} value={statusCounts[status]} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading font-bold text-lg text-navy mb-3">Мій контент на сайті</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Товари" value={productsCount} href="/admin/tovary" compact />
          <StatCard label="Мої роботи" value={worksCount} href="/admin/roboty" compact />
          <StatCard label="Новини" value={newsCount} href="/admin/novyny" compact />
          <StatCard label="Відгуки" value={testimonialsCount} href="/admin/vidguky" compact />
        </div>
      </section>
    </div>
  );
}
