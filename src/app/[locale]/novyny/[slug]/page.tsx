import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized, newsCategoryKey } from "@/lib/i18n-content";
import { formatDate } from "@/lib/format-date";
import type { AppLocale } from "@/i18n/routing";

const CATEGORY_FILTERS: { value?: NewsCategory; key: string }[] = [
  { value: undefined, key: "categoryAll" },
  { value: "ANNOUNCEMENT", key: "categoryAnnouncement" },
  { value: "NEWS", key: "categoryNews" },
  { value: "FOR_PSYCHOLOGISTS", key: "categoryForPsychologists" },
];

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("News");
  const common = await getTranslations("Common");

  const news = await prisma.newsPost.findUnique({ where: { slug } });
  if (!news) {
    notFound();
  }

  const [prevNews, nextNews, otherNews] = await Promise.all([
    prisma.newsPost.findFirst({
      where: { date: { lt: news.date } },
      orderBy: { date: "desc" },
      select: { slug: true },
    }),
    prisma.newsPost.findFirst({
      where: { date: { gt: news.date } },
      orderBy: { date: "asc" },
      select: { slug: true },
    }),
    prisma.newsPost.findMany({
      where: { id: { not: news.id } },
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <article className="lg:col-span-2">
        <p className="text-xs font-bold tracking-[1.6px] uppercase text-violet mb-3">
          {t("pageTitle")}
        </p>
        <h1 className="font-heading font-extrabold text-3xl text-navy mb-4">
          {pickLocalized(news, "title", locale)}
        </h1>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-wide text-magenta bg-magenta/10 px-2 py-1 rounded-field">
            {t(newsCategoryKey(news.category))}
          </span>
          <span className="text-sm text-navy-soft">
            {formatDate(news.date, locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>

        {news.photo && (
          <Image
            src={getPublicUrl(news.photo)!}
            alt=""
            width={800}
            height={450}
            className="w-full rounded-card object-cover mb-6"
          />
        )}

        <p className="text-xl font-bold text-navy mb-4">
          {pickLocalized(news, "excerpt", locale)}
        </p>

        <div className="text-navy-soft leading-relaxed whitespace-pre-line mb-10">
          {pickLocalized(news, "text", locale)}
        </div>

        <div className="flex items-center justify-between border-t border-navy/10 pt-6">
          {prevNews ? (
            <Link
              href={`/novyny/${prevNews.slug}`}
              className="font-bold text-navy hover:text-indigo"
            >
              ← {t("prevNews")}
            </Link>
          ) : (
            <span />
          )}
          {nextNews && (
            <Link
              href={`/novyny/${nextNews.slug}`}
              className="font-bold text-navy hover:text-indigo"
            >
              {t("nextNews")} →
            </Link>
          )}
        </div>
      </article>

      <aside>
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          {t("otherNews")}
        </h2>

        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORY_FILTERS.map((filter) => (
            <Link
              key={filter.key}
              href={filter.value ? `/novyny?category=${filter.value}` : "/novyny"}
              className="rounded-field px-3 py-1.5 text-xs font-bold bg-white border border-navy/15 text-navy-soft hover:text-navy"
            >
              {t(filter.key)}
            </Link>
          ))}
        </div>

        <div className="space-y-4 mb-6">
          {otherNews.map((other) => (
            <Link key={other.id} href={`/novyny/${other.slug}`} className="block group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wide text-magenta bg-magenta/10 px-2 py-0.5 rounded-field">
                  {t(newsCategoryKey(other.category))}
                </span>
                <span className="text-xs text-navy-soft">
                  {formatDate(other.date, locale)}
                </span>
              </div>
              <p className="font-bold text-sm text-navy group-hover:text-indigo">
                {pickLocalized(other, "title", locale)}
              </p>
            </Link>
          ))}
        </div>

        <Link
          href="/novyny"
          className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
        >
          {common("allNews")}
        </Link>
      </aside>
    </main>
  );
}
