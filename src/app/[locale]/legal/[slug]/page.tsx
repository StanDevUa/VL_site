import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { LegalWriteToMeTrigger } from "@/components/legal/write-to-me-trigger";
import { LEGAL_DOCS, LEGAL_DOC_META } from "@/lib/legal-content";

export default async function LegalDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Legal");

  const doc = LEGAL_DOCS[locale].find((d) => d.slug === slug);
  if (!doc) {
    notFound();
  }

  const related = LEGAL_DOC_META[locale].filter((d) => d.slug !== slug);

  return (
    <main
      className="relative px-[18px] pt-12 pb-12 sm:px-6 sm:pt-14 sm:pb-[90px] lg:px-8"
      style={{ background: "linear-gradient(180deg, #FBEFEC 0%, rgba(251,239,236,0) 40%), #FFFDFC" }}
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

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 items-start gap-[30px] lg:grid-cols-[260px_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-[110px]">
            <div className="mb-[14px] text-[13px] font-bold tracking-[1.2px] text-navy-soft uppercase">
              {t("contents")}
            </div>
            <nav className="flex flex-col gap-[2px] border-l-2 border-navy/12 pl-[2px]">
              {doc.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="-ml-[2px] border-l-2 border-transparent px-[14px] py-[9px] text-[14.5px] leading-[1.45] text-navy-soft transition-colors duration-200 ease-in-out hover:border-magenta hover:text-magenta"
                >
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-[26px] rounded-[12px] border border-navy/12 bg-powder-beige/60 px-[18px] py-4">
              <div className="mb-[6px] text-[13px] text-navy-soft">{t("questionAboutDocument")}</div>
              <LegalWriteToMeTrigger />
            </div>
          </aside>

          <article className="max-w-[760px]">
            <div className="mb-3 text-sm font-bold tracking-[1.6px] text-coral uppercase">
              {t("eyebrow")}
            </div>
            <h1 className="mb-[14px] font-heading text-[36px] font-extrabold leading-[1.12] tracking-[-.6px] text-navy text-pretty sm:text-[42px] sm:tracking-[-.9px]">
              {doc.title}
            </h1>
            <div className="mb-[30px] border-b border-navy/12 pb-[26px] text-[14.5px] text-navy-soft">
              {t("updated", { date: doc.updated })}
            </div>

            {doc.intro}

            {doc.sections.map((s) => (
              <div key={s.id} id={s.id} className="scroll-mt-[110px]">
                <h2 className="mt-[38px] mb-[14px] font-heading text-[21px] font-extrabold leading-[1.25] tracking-[-.4px] text-navy sm:text-[26px]">
                  {s.title}
                </h2>
                {s.body}
              </div>
            ))}

            <div className="flex flex-col items-start gap-3 border-t border-navy/12 pt-[30px] sm:flex-row sm:flex-wrap">
              {related.map((d) => (
                <Link
                  key={d.slug}
                  href={`/legal/${d.slug}`}
                  className="rounded-field border-[1.5px] border-navy/18 px-5 py-3 font-heading text-[14.5px] font-bold text-navy transition-colors duration-200 ease-in-out hover:border-magenta hover:text-magenta"
                >
                  {d.pill}
                </Link>
              ))}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
