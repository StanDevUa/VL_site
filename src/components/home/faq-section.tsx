import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";
import { FaqAccordion } from "./faq-accordion";
import { AskQuestionModal } from "./ask-question-modal";

export async function FaqSection() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("HomeFaq");
  const entries = await prisma.faqEntry.findMany({
    where: { showOnHome: true },
    orderBy: { createdAt: "asc" },
  });

  if (entries.length === 0) return null;

  const items = entries.map((e) => ({
    id: e.id,
    question: pickLocalized(e, "question", locale),
    answer: pickLocalized(e, "answer", locale),
  }));

  return (
    <section id="faq" className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-32 left-[33%] h-[33px] w-[21px] rounded-tl-[60%] rounded-tr-[10%] rounded-br-[60%] rounded-bl-[10%] opacity-[.33]"
        style={{
          background: "linear-gradient(140deg, #2B6BB8, #7A3AA0)",
          animation: "vlFloat 12s ease-in-out infinite",
        }}
      />

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-start gap-6 sm:gap-10 lg:grid-cols-[.82fr_1.18fr] lg:gap-14">
        <div>
          <div className="mb-4 text-sm font-bold tracking-[1.6px] text-violet uppercase">{t("eyebrow")}</div>
          <h2 className="mb-[18px] font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[40px] sm:tracking-[-.8px]">
            {t("h2")}
          </h2>
          <p className="mb-[26px] text-[17px] leading-[1.68] text-navy-soft">{t("p")}</p>
          <div className="relative mb-[26px] h-[300px] w-full overflow-hidden rounded-card border border-navy/12">
            <Image
              src="/home/faq.jpg"
              alt="Вікторія Лемешко"
              fill
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "58% 40%" }}
            />
          </div>
          <AskQuestionModal />
        </div>

        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
