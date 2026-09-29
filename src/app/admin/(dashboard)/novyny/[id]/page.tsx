import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { toDatetimeLocalValue, isFutureDate } from "@/lib/format-date";
import { NewsForm } from "@/components/admin/news-form";
import { updateNews } from "@/server/actions/news";

export default async function EditNewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { id } = await params;
  const { page, category } = await searchParams;
  const news = await prisma.newsPost.findUnique({ where: { id } });

  if (!news) {
    notFound();
  }

  const returnParams = new URLSearchParams();
  if (category) returnParams.set("category", category);
  if (page) returnParams.set("page", page);
  const returnQuery = returnParams.toString();
  const returnTo = `/admin/novyny${returnQuery ? `?${returnQuery}` : ""}`;
  const updateNewsWithId = updateNews.bind(null, id, returnTo);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування новини
      </h1>
      <NewsForm
        action={updateNewsWithId}
        existing={{
          titleUk: news.titleUk,
          titleEn: news.titleEn,
          titleRu: news.titleRu,
          excerptUk: news.excerptUk,
          excerptEn: news.excerptEn,
          excerptRu: news.excerptRu,
          textUk: news.textUk,
          textEn: news.textEn,
          textRu: news.textRu,
          category: news.category,
          date: toDatetimeLocalValue(news.date),
          isScheduled: isFutureDate(news.date),
          photoUrl: getPublicUrl(news.photo)!,
        }}
      />
    </div>
  );
}
