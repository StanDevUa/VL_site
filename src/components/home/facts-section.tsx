import { getTranslations } from "next-intl/server";

const FACT_KEYS = [
  { key: "kids", num: "150+" },
  { key: "reviews", num: "50+" },
  { key: "developments", num: "6" },
  { key: "talks", num: "30+" },
];

export async function FactsSection() {
  const t = await getTranslations("HomeFacts");

  return (
    <section className="px-[18px] pt-[30px] pb-[34px] sm:px-6 sm:pt-11 sm:pb-12 lg:px-8">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {FACT_KEYS.map((f) => (
          <div
            key={f.key}
            className="rounded-card border border-navy/12 px-[26px] py-7"
            style={{ background: "linear-gradient(170deg, rgba(251,239,236,.9), rgba(250,244,234,.7))" }}
          >
            <div
              className="mb-2.5 bg-clip-text font-heading text-[46px] leading-none font-extrabold tracking-[-1.5px] text-transparent"
              style={{
                background:
                  "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
            >
              {f.num}
            </div>
            <div className="mb-[5px] text-base font-semibold text-navy">{t(`items.${f.key}.label`)}</div>
            <div className="text-sm leading-[1.5] text-navy-soft">{t(`items.${f.key}.note`)}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
