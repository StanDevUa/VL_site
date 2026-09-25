import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { publishedNewsWhere } from "@/lib/news-visibility";
import { formatDate } from "@/lib/format-date";
import { NewsListPage as NewsListPageContent } from "@/components/novyny/news-list-grid";
import type { AppLocale } from "@/i18n/routing";

export default async function NewsListPage() {
  const locale = (await getLocale()) as AppLocale;

  const posts = await prisma.newsPost.findMany({
    where: publishedNewsWhere(),
    orderBy: { date: "desc" },
  });

  const items = posts.map((p) => ({
    slug: p.slug,
    category: p.category,
    date: formatDate(p.date, locale),
    title: pickLocalized(p, "title", locale),
    excerpt: pickLocalized(p, "excerpt", locale),
    photoUrl: getPublicUrl(p.photo)!,
  }));

  return (
    <main className="bg-white">
      <NewsListPageContent items={items} />
    </main>
  );
}
