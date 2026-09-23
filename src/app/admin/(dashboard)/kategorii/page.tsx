import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { deleteCategory } from "@/server/actions/categories";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/ui/button-styles";
import { formatDate } from "@/lib/format-date";
import { CATEGORY_BADGE_GRADIENT } from "@/lib/category-badge";

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
      include: {
        _count: { select: { products: true } },
        products: { take: 1, orderBy: { createdAt: "asc" }, select: { mainPhoto: true } },
      },
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
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((item) => {
              const thumbnail = item.products[0]?.mainPhoto;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-card border border-navy/10 overflow-hidden flex flex-col"
                >
                  <div className="relative h-28 bg-navy/5">
                    {thumbnail && (
                      <Image
                        src={getPublicUrl(thumbnail)!}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover"
                      />
                    )}
                    <span
                      className="absolute top-2.5 left-2.5 text-[11px] font-bold uppercase tracking-wide text-white px-2.5 py-1 rounded-[7px]"
                      style={{ background: CATEGORY_BADGE_GRADIENT }}
                    >
                      {item.nameUk}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <p className="text-sm font-bold text-navy">
                      Товарів: {item._count.products}
                    </p>
                    <p className="text-xs text-navy-soft">
                      Додано: {formatDate(item.createdAt, "uk", { day: "2-digit", month: "2-digit", year: "numeric" })}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/kategorii/${item.id}`}
                        className="text-sm font-bold text-indigo hover:underline"
                      >
                        Редагувати
                      </Link>
                      <DeleteButton
                        action={deleteCategory.bind(null, item.id)}
                        disabled={item._count.products > 0}
                        disabledReason="Не можна видалити категорію, поки в ній є товари."
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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
