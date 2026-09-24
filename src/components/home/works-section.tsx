import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";
import { WorksCarousel } from "./works-carousel";

export async function WorksSection() {
  const locale = (await getLocale()) as AppLocale;
  const portfolioWorks = await prisma.portfolioWork.findMany({
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  if (portfolioWorks.length === 0) return null;

  const works = portfolioWorks.map((w) => ({
    slug: w.slug,
    title: pickLocalized(w, "title", locale),
    excerpt: pickLocalized(w, "excerpt", locale),
    photoUrl: getPublicUrl(w.mainPhoto)!,
  }));

  return (
    <section
      id="works"
      className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:pt-24 sm:pb-[104px] lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(250,244,234,0) 0%, #FAF4EA 12%, #FAF4EA 88%, rgba(250,244,234,0) 100%)",
      }}
    >
      <div className="relative mx-auto max-w-[1240px]">
        <WorksCarousel works={works} />
      </div>
    </section>
  );
}
