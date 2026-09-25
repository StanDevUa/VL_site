import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { ShareButton } from "@/components/ui/share-button";
import { WorkGallery } from "@/components/roboty/work-gallery";
import { OthersSidebar } from "@/components/roboty/others-sidebar";
import type { AppLocale } from "@/i18n/routing";

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Works");

  const work = await prisma.portfolioWork.findUnique({ where: { slug } });
  if (!work) {
    notFound();
  }

  const [prevWork, nextWork, otherWorks] = await Promise.all([
    prisma.portfolioWork.findFirst({
      where: { createdAt: { lt: work.createdAt } },
      orderBy: { createdAt: "desc" },
      select: { slug: true },
    }),
    prisma.portfolioWork.findFirst({
      where: { createdAt: { gt: work.createdAt } },
      orderBy: { createdAt: "asc" },
      select: { slug: true },
    }),
    prisma.portfolioWork.findMany({
      where: { id: { not: work.id } },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
  ]);

  const title = pickLocalized(work, "title", locale);
  const others = otherWorks.map((o) => ({
    slug: o.slug,
    title: pickLocalized(o, "title", locale),
    excerpt: pickLocalized(o, "excerpt", locale),
    photoUrl: getPublicUrl(o.mainPhoto)!,
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
        className="pointer-events-none absolute top-[240px] left-[5%] h-8 w-5 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-[.35]"
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
          <h1 className="mb-[26px] font-heading text-[36px] leading-[1.12] font-extrabold tracking-[-.6px] text-navy sm:text-[42px] sm:tracking-[-.9px]">
            {title}
          </h1>

          <div className="relative mb-[30px] h-[440px] w-full overflow-hidden rounded-card border border-navy/12">
            <Image
              src={getPublicUrl(work.mainPhoto)!}
              alt={title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <p className="mb-[22px] font-heading text-xl leading-[1.45] font-bold text-navy">
            {pickLocalized(work, "excerpt", locale)}
          </p>

          <div className="mb-[34px] text-[17px] leading-[1.75] whitespace-pre-line text-navy-soft">
            {pickLocalized(work, "description", locale)}
          </div>

          <div className="border-b border-navy/12 pb-[34px]">
            <ShareButton />
          </div>

          <WorkGallery photos={work.gallery.map((k) => getPublicUrl(k)!)} title={title} />

          {(prevWork || nextWork) && (
            <div className="mt-11 flex items-center justify-between gap-3 border-t border-navy/12 pt-[30px] sm:gap-5">
              {prevWork ? (
                <Link
                  href={`/roboty/${prevWork.slug}`}
                  className="group inline-flex flex-1 items-center gap-[9px] font-heading text-[13.5px] font-bold text-navy transition-colors duration-[250ms] ease-in-out hover:text-magenta sm:flex-initial sm:gap-3 sm:text-[15.5px]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 text-xl transition-colors duration-[250ms] ease-in-out group-hover:border-magenta group-hover:text-magenta">
                    ←
                  </span>
                  {t("prevWork")}
                </Link>
              ) : (
                <span className="flex-1 sm:flex-initial" />
              )}
              {nextWork && (
                <Link
                  href={`/roboty/${nextWork.slug}`}
                  className="group inline-flex flex-1 items-center justify-end gap-[9px] text-right font-heading text-[13.5px] font-bold text-navy transition-colors duration-[250ms] ease-in-out hover:text-magenta sm:flex-initial sm:justify-start sm:gap-3 sm:text-[15.5px]"
                >
                  {t("nextWork")}
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 text-xl transition-colors duration-[250ms] ease-in-out group-hover:border-magenta group-hover:text-magenta">
                    →
                  </span>
                </Link>
              )}
            </div>
          )}
        </article>

        <OthersSidebar others={others} />
      </div>
    </main>
  );
}
