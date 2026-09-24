import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized, newsCategoryKey } from "@/lib/i18n-content";
import { publishedNewsWhere } from "@/lib/news-visibility";
import { formatDate } from "@/lib/format-date";
import type { AppLocale } from "@/i18n/routing";
import { NewsCarousel } from "./news-carousel";

export async function NewsSection() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("News");
  const posts = await prisma.newsPost.findMany({
    where: publishedNewsWhere(),
    orderBy: { date: "desc" },
    take: 3,
  });

  if (posts.length === 0) return null;

  const items = posts.map((p) => ({
    slug: p.slug,
    tag: t(newsCategoryKey(p.category)),
    date: formatDate(p.date, locale),
    title: pickLocalized(p, "title", locale),
    excerpt: pickLocalized(p, "excerpt", locale),
    photoUrl: getPublicUrl(p.photo)!,
  }));

  return (
    <section
      id="news"
      className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:pt-24 sm:pb-[104px] lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(251,239,236,0) 0%, #FBEFEC 12%, #FBEFEC 88%, rgba(251,239,236,0) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[110px] -right-[60px] h-[260px] w-[260px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(43,107,184,.12), rgba(255,255,255,0) 70%)" }}
      />

      <div className="relative mx-auto max-w-[1240px]">
        <NewsCarousel items={items} />
      </div>
    </section>
  );
}
