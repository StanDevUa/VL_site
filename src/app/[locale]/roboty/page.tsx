import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";

const PAGE_SIZE = 6;

export default async function WorksListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Works");

  const [works, total] = await Promise.all([
    prisma.portfolioWork.findMany({
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.portfolioWork.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-10">
        {t("pageTitle")}
      </h1>

      {works.length === 0 ? (
        <p className="text-navy-soft">{t("empty")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {works.map((work) => (
              <Link
                key={work.id}
                href={`/roboty/${work.slug}`}
                className="group block rounded-card bg-white border border-navy/10 overflow-hidden hover:shadow-card-hover transition-shadow"
              >
                <Image
                  src={getPublicUrl(work.mainPhoto)!}
                  alt=""
                  width={400}
                  height={260}
                  className="w-full h-[200px] object-cover"
                />
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-navy mb-2">
                    {pickLocalized(work, "title", locale)}
                  </h3>
                  <p className="text-sm text-navy-soft line-clamp-2">
                    {pickLocalized(work, "excerpt", locale)}
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
                  href={`/roboty?page=${p}`}
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
    </main>
  );
}
