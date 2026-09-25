import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized, newsCategoryKey } from "@/lib/i18n-content";
import { publishedNewsWhere } from "@/lib/news-visibility";
import { formatDate } from "@/lib/format-date";
import { ShareButton } from "@/components/ui/share-button";
import { NewsOthersSidebar } from "@/components/novyny/news-others-sidebar";
import type { AppLocale } from "@/i18n/routing";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("News");

  const news = await prisma.newsPost.findFirst({
    where: publishedNewsWhere({ slug }),
  });
  if (!news) {
    notFound();
  }

  const [prevNews, nextNews, otherNews] = await Promise.all([
    prisma.newsPost.findFirst({
      where: publishedNewsWhere({ date: { lt: news.date } }),
      orderBy: { date: "desc" },
      select: { slug: true },
    }),
    prisma.newsPost.findFirst({
      where: publishedNewsWhere({ date: { gt: news.date } }),
      orderBy: { date: "asc" },
      select: { slug: true },
    }),
    prisma.newsPost.findMany({
      where: publishedNewsWhere({ id: { not: news.id } }),
      orderBy: { date: "desc" },
      take: 5,
    }),
  ]);

  const others = otherNews.map((o) => ({
    slug: o.slug,
    category: o.category,
    date: formatDate(o.date, locale),
    title: pickLocalized(o, "title", locale),
    photoUrl: getPublicUrl(o.photo)!,
  }));

  return (
    <main
      className="relative px-[18px] pt-12 pb-12 sm:px-6 sm:pt-[52px] sm:pb-[90px] lg:px-8"
      style={{ background: "linear-gradient(180deg, #FBEFEC 0%, rgba(251,239,236,0) 46%), #FFFDFC" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[130px] -right-[110px] h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(242,102,47,.16), rgba(201,48,124,.09) 55%, rgba(43,107,184,0) 72%)",
          animation: "vlPulse 12s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[120px] right-[12%] h-8 w-5 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-[.35]"
        style={{
          background: "linear-gradient(140deg, #7A3AA0, #2B6BB8)",
          animation: "vlFloat 11s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-11 lg:grid-cols-[2fr_1fr] lg:gap-14">
        <article>
          <div className="mb-[14px] text-sm font-bold tracking-[1.6px] text-violet uppercase">
            {t("pageTitle")}
          </div>
          <h1 className="mb-4 font-heading text-[36px] leading-[1.12] font-extrabold tracking-[-.6px] text-navy sm:text-[42px] sm:tracking-[-.9px]">
            {pickLocalized(news, "title", locale)}
          </h1>
          <div className="mb-[26px] flex items-center gap-3">
            <span className="rounded-[7px] bg-magenta/9 px-3 py-[6px] text-xs font-bold tracking-[.6px] text-magenta uppercase">
              {t(newsCategoryKey(news.category))}
            </span>
            <span className="text-[14.5px] text-navy-soft">
              {formatDate(news.date, locale, { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>

          <div className="relative mb-[30px] h-[440px] w-full overflow-hidden rounded-card border border-navy/12">
            <Image
              src={getPublicUrl(news.photo)!}
              alt={pickLocalized(news, "title", locale)}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <p className="mb-[22px] font-heading text-xl leading-[1.45] font-bold text-navy">
            {pickLocalized(news, "excerpt", locale)}
          </p>

          <div className="mb-[34px] text-[17px] leading-[1.75] whitespace-pre-line text-navy-soft">
            {pickLocalized(news, "text", locale)}
          </div>

          <div className="border-b border-navy/12 pb-[34px]">
            <ShareButton />
          </div>

          {(prevNews || nextNews) && (
            <div className="mt-10 flex items-center justify-between gap-3 sm:gap-5">
              {prevNews ? (
                <Link
                  href={`/novyny/${prevNews.slug}`}
                  className="group inline-flex flex-1 items-center gap-[9px] font-heading text-[13.5px] font-bold text-navy transition-colors duration-[250ms] ease-in-out hover:text-magenta sm:flex-initial sm:gap-3 sm:text-[15.5px]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 text-xl transition-colors duration-[250ms] ease-in-out group-hover:border-magenta group-hover:text-magenta">
                    ←
                  </span>
                  {t("prevNews")}
                </Link>
              ) : (
                <span className="flex-1 sm:flex-initial" />
              )}
              {nextNews && (
                <Link
                  href={`/novyny/${nextNews.slug}`}
                  className="group inline-flex flex-1 items-center justify-end gap-[9px] text-right font-heading text-[13.5px] font-bold text-navy transition-colors duration-[250ms] ease-in-out hover:text-magenta sm:flex-initial sm:justify-start sm:gap-3 sm:text-[15.5px]"
                >
                  {t("nextNews")}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 text-xl transition-colors duration-[250ms] ease-in-out group-hover:border-magenta group-hover:text-magenta">
                    →
                  </span>
                </Link>
              )}
            </div>
          )}
        </article>

        <NewsOthersSidebar others={others} />
      </div>
    </main>
  );
}
