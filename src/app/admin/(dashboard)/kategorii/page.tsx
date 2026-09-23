import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteCategory } from "@/server/actions/categories";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/ui/button-styles";

const PAGE_SIZE = 10;

export default async function AdminCategoriesListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { products: true } } },
    }),
    prisma.category.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">Категорії</h1>
        <Link href="/admin/kategorii/new" className={primaryButtonClass}>
          + Додати категорію
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-navy-soft">
          Категорій ще немає. Натисни «Додати категорію», щоб створити першу.
        </p>
      ) : (
        <>
          <div className="bg-white rounded-card border border-navy/10 divide-y divide-navy/10">
            {categories.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-navy truncate">{item.nameUk}</p>
                    <span className="shrink-0 text-xs font-bold text-navy-soft bg-navy/5 px-2 py-0.5 rounded-field">
                      Товарів: {item._count.products}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/kategorii/${item.id}`}
                  className="shrink-0 text-sm font-bold text-indigo hover:underline"
                >
                  Редагувати
                </Link>
                <div className="shrink-0">
                  <DeleteButton
                    action={deleteCategory.bind(null, item.id)}
                    disabled={item._count.products > 0}
                    disabledReason="Не можна видалити категорію, поки в ній є товари."
                  />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/kategorii?page=${p}`}
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
