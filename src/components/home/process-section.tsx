import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const STEP_KEYS = ["request", "intro", "assessment", "work"];

export async function ProcessSection() {
  const t = await getTranslations("HomeProcess");

  return (
    <section id="process" className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[200px] right-[11%] h-[38px] w-6 rounded-tl-[60%] rounded-tr-[10%] rounded-br-[60%] rounded-bl-[10%] opacity-[.35]"
        style={{
          background: "linear-gradient(140deg, #C9307C, #7A3AA0)",
          animation: "vlFloat 11s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="mb-[52px] max-w-[660px]">
          <div className="mb-4 text-sm font-bold tracking-[1.6px] text-coral uppercase">{t("eyebrow")}</div>
          <h2 className="mb-[18px] font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
            {t("h2")}
          </h2>
          <p className="text-lg leading-[1.65] text-navy-soft">{t("p")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEP_KEYS.map((key, i) => (
            <div key={key}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] border-[1.5px] border-magenta/35 bg-powder-pink/60 font-heading text-[17px] font-extrabold text-magenta">
                  {i + 1}
                </div>
                <div
                  className="h-0.5 flex-1"
                  style={{ background: "linear-gradient(90deg, rgba(201,48,124,.3), rgba(43,107,184,.05))" }}
                />
              </div>
              <h3 className="mb-2.5 font-heading text-[18px] font-bold text-navy sm:text-[20px]">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-navy-soft">{t(`steps.${key}.text`)}</p>
            </div>
          ))}
        </div>

        <div className="mt-[46px] flex flex-wrap items-center gap-4">
          <Link
            href="#cta"
            className="w-full rounded-field bg-indigo px-[30px] py-4 text-center font-heading text-base font-bold text-white shadow-button transition-[translate,box-shadow,background-color] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
          >
            {t("ctaStart")}
          </Link>
          <span className="text-[15.5px] text-navy-soft">{t("ctaNote")}</span>
        </div>
      </div>
    </section>
  );
}
