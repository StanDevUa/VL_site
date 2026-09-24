import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type EmoPartVisual = {
  key: string;
  dot: string;
  icon: [string, string, string];
};

const EMO_PARTS: EmoPartVisual[] = [
  {
    key: "toy",
    dot: "linear-gradient(135deg, #F2662F, #C9307C)",
    icon: [
      "M12 20.3c-3.9 0-6.9-2.7-6.9-6.3 0-2.1 1-3.9 2.6-5",
      "M7.7 9a4.6 4.6 0 0 1 8.6 0c1.6 1.1 2.6 2.9 2.6 5 0 3.6-3 6.3-6.9 6.3",
      "M6.6 6.2 5.2 3.6l2.9.6M17.4 6.2l1.4-2.6-2.9.6M9.9 13.2h.1M14.1 13.2h.1M10.7 16.4c.8.6 1.8.6 2.6 0",
    ],
  },
  {
    key: "stories",
    dot: "linear-gradient(135deg, #C9307C, #7A3AA0)",
    icon: [
      "M12 7.2C10.4 5.9 8.4 5.3 5.2 5.3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1c3.2 0 5.2.6 6.8 1.9",
      "M12 7.2c1.6-1.3 3.6-1.9 6.8-1.9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1c-3.2 0-5.2.6-6.8 1.9",
      "M12 7.2v13",
    ],
  },
  {
    key: "cards",
    dot: "linear-gradient(135deg, #7A3AA0, #2B6BB8)",
    icon: [
      "M9.4 4.6h8.1a1.2 1.2 0 0 1 1.2 1.2v9.8a1.2 1.2 0 0 1-1.2 1.2H9.4a1.2 1.2 0 0 1-1.2-1.2V5.8a1.2 1.2 0 0 1 1.2-1.2z",
      "M5.6 7.4a1.2 1.2 0 0 0-1.2 1.2v9.8a1.2 1.2 0 0 0 1.2 1.2h8.1a1.2 1.2 0 0 0 1.2-1.2",
      "M13.4 8.6a1.6 1.6 0 0 0-2.8 1 1.6 1.6 0 0 0 2.8-1zM11.5 12.6h4",
    ],
  },
  {
    key: "guide",
    dot: "linear-gradient(135deg, #2B6BB8, #F2662F)",
    icon: ["M6.2 3.6h9l3.6 3.6v12.2a1 1 0 0 1-1 1H6.2a1 1 0 0 1-1-1V4.6a1 1 0 0 1 1-1z", "M14.8 3.8v3.6h3.8", "M8.4 11.4h7.2M8.4 14.4h7.2M8.4 17.4h4.4"],
  },
];

export async function MethodSection() {
  const t = await getTranslations("HomeMethod");

  return (
    <section
      id="method"
      className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:pt-24 sm:pb-[104px] lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(251,239,236,0) 0%, #FBEFEC 12%, #FBEFEC 88%, rgba(251,239,236,0) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-[90px] h-[340px] w-[340px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(122,58,160,.14), rgba(255,255,255,0) 70%)" }}
      />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-[.95fr_1.05fr] sm:gap-14">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -top-5 -left-[18px] right-[18px] h-[320px] rounded-block opacity-[.14] sm:h-[470px]"
              style={{
                background: "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
              }}
            />
            <div className="relative h-[320px] w-full overflow-hidden rounded-card shadow-[0_26px_54px_-30px_rgba(30,42,90,.4)] sm:h-[470px]">
              <Image
                src="/home/method.jpg"
                alt="Вікторія Лемешко з єнотом Емо"
                fill
                sizes="(min-width: 640px) 47vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 14%" }}
              />
            </div>
            <div className="relative mt-[22px] text-center font-heading text-[26px] font-extrabold tracking-[-.4px] text-navy">
              {t("photoLine1")}
              <br />
              {t("photoLine2")}
            </div>
          </div>

          <div>
            <div className="mb-4 text-sm font-bold tracking-[1.6px] text-coral uppercase">{t("eyebrow")}</div>
            <h2 className="mb-5 font-heading text-[28px] leading-[1.12] font-extrabold tracking-[-.4px] text-navy sm:text-[44px] sm:tracking-[-.9px]">
              {t("h2")}
            </h2>
            <p className="mb-[30px] text-lg leading-[1.68] text-navy-soft">{t("p")}</p>

            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-[14px]">
              {EMO_PARTS.map((p) => (
                <div
                  key={p.key}
                  className="rounded-card border border-navy/12 bg-[rgba(255,253,252,.95)] px-5 pt-5 pb-[22px] transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[5px] hover:shadow-[0_22px_40px_-26px_rgba(30,42,90,.4)]"
                >
                  <div
                    className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px]"
                    style={{ background: p.dot }}
                  >
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d={p.icon[0]} />
                      <path d={p.icon[1]} />
                      <path d={p.icon[2]} />
                    </svg>
                  </div>
                  <h3 className="mb-[7px] font-heading text-[18px] font-bold text-navy sm:text-[17px]">
                    {t(`parts.${p.key}.title`)}
                  </h3>
                  <p className="text-[14.5px] leading-[1.55] text-navy-soft">{t(`parts.${p.key}.text`)}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-[14px]">
              <Link
                href="#shop"
                className="w-full rounded-field bg-indigo px-[30px] py-4 text-center font-heading text-base font-bold text-white shadow-button transition-[translate,box-shadow,background-color] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
              >
                {t("ctaBuy")}
              </Link>
              <Link
                href="#method"
                className="w-full rounded-field border-[1.5px] border-navy/18 bg-transparent px-6 py-4 text-center font-heading text-base font-bold text-navy transition-[border-color,translate] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-violet hover:text-violet sm:w-auto"
              >
                {t("ctaMore")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
