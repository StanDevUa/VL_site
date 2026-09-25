import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { WorksListGrid } from "@/components/roboty/works-list-grid";
import type { AppLocale } from "@/i18n/routing";

export default async function WorksListPage() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Works");

  const works = await prisma.portfolioWork.findMany({ orderBy: { createdAt: "asc" } });

  const items = works.map((w) => ({
    slug: w.slug,
    title: pickLocalized(w, "title", locale),
    excerpt: pickLocalized(w, "excerpt", locale),
    photoUrl: getPublicUrl(w.mainPhoto)!,
  }));

  return (
    <main className="bg-white">
      <section
        className="relative px-[18px] pt-12 pb-12 sm:px-6 sm:pt-16 sm:pb-[34px] lg:px-8"
        style={{ background: "linear-gradient(180deg, #FBEFEC 0%, rgba(251,239,236,0) 100%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[120px] -right-[100px] h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(242,102,47,.18), rgba(201,48,124,.1) 55%, rgba(43,107,184,0) 72%)",
            animation: "vlPulse 12s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-[90px] left-[6%] h-8 w-5 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-40"
          style={{
            background: "linear-gradient(140deg, #7A3AA0, #2B6BB8)",
            animation: "vlFloat 10s ease-in-out infinite",
          }}
        />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="mb-[14px] text-sm font-bold tracking-[1.6px] text-violet uppercase">
            {t("pageTitle")}
          </div>
          <h1 className="mb-4 font-heading text-[36px] leading-[1.1] font-extrabold tracking-[-.6px] text-navy sm:text-[46px] sm:tracking-[-1px]">
            {t("h1")}
          </h1>
          <p className="max-w-[620px] text-lg leading-[1.65] text-navy-soft">{t("intro")}</p>
        </div>
      </section>

      <section className="px-[18px] pt-12 pb-12 sm:px-6 sm:pt-[10px] sm:pb-[90px] lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          {items.length === 0 ? (
            <p className="text-navy-soft">{t("empty")}</p>
          ) : (
            <WorksListGrid works={items} />
          )}
        </div>
      </section>
    </main>
  );
}
