import Link from "next/link";
import Image from "next/image";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { deleteNews } from "@/server/actions/news";
import { isFutureDate } from "@/lib/format-date";
import { DeleteButton } from "@/components/admin/delete-button";

const PAGE_SIZE = 10;

const CATEGORY_LABELS: Record<string, string> = {
  ANNOUNCEMENT: "Анонс",
  NEWS: "Новина",
  FOR_PSYCHOLOGISTS: "Для психологів",
};

const CATEGORY_FILTERS: { value?: NewsCategory; label: string }[] = [
  { value: undefined, label: "Усі" },
  { value: "ANNOUNCEMENT", label: "Анонс" },
  { value: "NEWS", label: "Новина" },
  { value: "FOR_PSYCHOLOGISTS", label: "Для психологів" },
];

export default async function AdminNewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const activeCategory =
    category && Object.values(NewsCategory).includes(category as NewsCategory)
      ? (category as NewsCategory)
      : undefined;

  const where = activeCategory ? { category: activeCategory } : {};

  const [news, total] = await Promise.all([
    prisma.newsPost.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.newsPost.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">
          Новини та анонси
        </h1>
        <Link
          href="/admin/novyny/new"
          className="rounded-button bg-indigo px-5 py-3 font-heading font-bold text-white shadow-button hover:bg-indigo-hover"
        >
          + Додати новину
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((filter) => (
            <Link
              key={filter.label}
              href={
                filter.value
                  ? `/admin/novyny?category=${filter.value}`
                  : "/admin/novyny"
              }
              className={
                "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
                (activeCategory === filter.value
                  ? "bg-indigo text-white"
                  : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
              }
            >
              {filter.label}
            </Link>
          ))}
        </div>
        <p className="text-sm text-navy-soft shrink-0">
          Знайдено: <span className="font-bold text-navy">{total}</span>
        </p>
      </div>

      {news.length === 0 ? (
        <p className="text-navy-soft">
          {activeCategory
            ? "У цій категорії новин ще немає."
            : "Новин ще немає. Натисни «Додати новину», щоб створити першу."}
        </p>
      ) : (
        <>
          <div className="bg-white rounded-card border border-navy/10 divide-y divide-navy/10">
            {news.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <Image
                  src={getPublicUrl(item.photo)!}
                  alt=""
                  width={72}
                  height={54}
                  className="rounded-field object-cover w-[72px] h-[54px] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-magenta bg-magenta/10 px-2 py-0.5 rounded-field">
                      {CATEGORY_LABELS[item.category]}
                    </span>
                    <span className="shrink-0 text-xs text-navy-soft">
                      {item.date.toLocaleDateString("uk-UA")}
                    </span>
                    {isFutureDate(item.date) && (
                      <span className="shrink-0 text-xs font-bold text-indigo bg-indigo/10 px-2 py-0.5 rounded-field">
                        Заплановано
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-navy truncate">{item.titleUk}</p>
                </div>
                <Link
                  href={`/admin/novyny/${item.id}`}
                  className="shrink-0 text-sm font-bold text-indigo hover:underline"
                >
                  Редагувати
                </Link>
                <div className="shrink-0">
                  <DeleteButton action={deleteNews.bind(null, item.id)} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={
                    activeCategory
                      ? `/admin/novyny?category=${activeCategory}&page=${p}`
                      : `/admin/novyny?page=${p}`
                  }
                  className={
                    "w-10 h-10 flex items-center justify-center rounded-field font-bold text-sm " +
                    (p === currentPage
                      ? "bg-indigo text-white"
                      : "bg-white border border-navy/15 text-navy hover:border-indigo")
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
