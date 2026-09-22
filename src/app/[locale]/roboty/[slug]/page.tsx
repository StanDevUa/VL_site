import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Works");
  const common = await getTranslations("Common");

  const work = await prisma.portfolioWork.findUnique({ where: { slug } });
  if (!work) {
    notFound();
  }

  const [prevWork, nextWork, otherWorks] = await Promise.all([
    prisma.portfolioWork.findFirst({
      where: { createdAt: { lt: work.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true, titleUk: true, titleEn: true, titleRu: true },
    }),
    prisma.portfolioWork.findFirst({
      where: { createdAt: { gt: work.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true, titleUk: true, titleEn: true, titleRu: true },
    }),
    prisma.portfolioWork.findMany({
      where: { id: { not: work.id } },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
  ]);

  return (
    <main className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
      <article className="lg:col-span-2">
        <h1 className="font-heading font-extrabold text-3xl text-navy mb-6">
          {pickLocalized(work, "title", locale)}
        </h1>

        <Image
          src={getPublicUrl(work.mainPhoto)!}
          alt=""
          width={800}
          height={450}
          className="w-full rounded-card object-cover mb-6"
        />

        <p className="text-xl font-bold text-navy mb-4">
          {pickLocalized(work, "excerpt", locale)}
        </p>

        <div className="text-navy-soft leading-relaxed whitespace-pre-line mb-10">
          {pickLocalized(work, "description", locale)}
        </div>

        {work.gallery.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
            {work.gallery.map((key) => (
              <Image
                key={key}
                src={getPublicUrl(key)!}
                alt=""
                width={260}
                height={180}
                className="rounded-card object-cover w-full h-[140px]"
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-navy/10 pt-6">
          {prevWork ? (
            <Link
              href={`/roboty/${prevWork.slug}`}
              className="font-bold text-navy hover:text-indigo"
            >
              ← {t("prevWork")}
            </Link>
          ) : (
            <span />
          )}
          {nextWork && (
            <Link
              href={`/roboty/${nextWork.slug}`}
              className="font-bold text-navy hover:text-indigo"
            >
              {t("nextWork")} →
            </Link>
          )}
        </div>
      </article>

      <aside>
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          {t("otherWorks")}
        </h2>
        <div className="space-y-4 mb-6">
          {otherWorks.map((other) => (
            <Link
              key={other.id}
              href={`/roboty/${other.slug}`}
              className="flex gap-3 group"
            >
              <Image
                src={getPublicUrl(other.mainPhoto)!}
                alt=""
                width={80}
                height={60}
                className="rounded-field object-cover w-20 h-[60px] shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-sm text-navy group-hover:text-indigo truncate">
                  {pickLocalized(other, "title", locale)}
                </p>
                <p className="text-xs text-navy-soft line-clamp-2">
                  {pickLocalized(other, "excerpt", locale)}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/roboty"
          className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
        >
          {common("allWorks")}
        </Link>
      </aside>
    </main>
  );
}
