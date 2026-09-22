import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized, newsCategoryKey } from "@/lib/i18n-content";
import { publishedNewsWhere } from "@/lib/news-visibility";
import { formatDate } from "@/lib/format-date";
import type { AppLocale } from "@/i18n/routing";

const PAGE_SIZE = 6;

const CATEGORY_FILTERS: { value?: NewsCategory; key: string }[] = [
  { value: undefined, key: "categoryAll" },
  { value: "ANNOUNCEMENT", key: "categoryAnnouncement" },
  { value: "NEWS", key: "categoryNews" },
  { value: "FOR_PSYCHOLOGISTS", key: "categoryForPsychologists" },
];

export default async function NewsListPage({
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

  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("News");

  const where = publishedNewsWhere(activeCategory ? { category: activeCategory } : {});

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
    <main className="max-w-6xl mx-auto px-8 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 className="font-heading font-extrabold text-3xl text-navy">
          {t("pageTitle")}
        </h1>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((filter) => (
            <Link
              key={filter.key}
              href={filter.value ? `/novyny?category=${filter.value}` : "/novyny"}
              className={
                "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
                (activeCategory === filter.value
                  ? "bg-indigo text-white"
                  : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
              }
            >
              {t(filter.key)}
            </Link>
          ))}
        </div>
      </div>

      {news.length === 0 ? (
        <p className="text-navy-soft">{t("empty")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/novyny/${item.slug}`}
                className="group block rounded-card bg-white border border-navy/10 overflow-hidden hover:shadow-card-hover transition-shadow"
              >
                <Image
                  src={getPublicUrl(item.photo)!}
                  alt=""
                  width={400}
                  height={220}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wide text-magenta bg-magenta/10 px-2 py-1 rounded-field">
                      {t(newsCategoryKey(item.category))}
                    </span>
                    <span className="text-xs text-navy-soft">
                      {formatDate(item.date, locale)}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-lg text-navy mb-2">
                    {pickLocalized(item, "title", locale)}
                  </h3>
                  <p className="text-sm text-navy-soft line-clamp-2">
                    {pickLocalized(item, "excerpt", locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={
                    activeCategory
                      ? `/novyny?category=${activeCategory}&page=${p}`
                      : `/novyny?page=${p}`
                  }
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
    </main>
  );
}
