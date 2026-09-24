import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export async function HeroSection() {
  const t = await getTranslations("HomeHero");
  const common = await getTranslations("Common");

  return (
    <section
      className="relative px-[18px] py-14 sm:px-6 sm:pt-[84px] sm:pb-[120px] lg:px-8"
      style={{ background: "linear-gradient(180deg, #FBEFEC 0%, #FBEFEC 60%, #FFFDFC 100%)" }}
    >
      {/* Декоративні плаваючі елементи (без scroll-parallax — статичне позиціювання) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[140px] -right-[120px] h-[300px] w-[520px] rounded-full sm:h-[520px]"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(242,102,47,.22), rgba(201,48,124,.14) 55%, rgba(43,107,184,0) 72%)",
          animation: "vlPulse 11s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[120px] left-[7%] h-10 w-[26px] rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-50"
        style={{
          background: "linear-gradient(140deg, #7A3AA0, #2B6BB8)",
          animation: "vlFloat 9s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[320px] left-[3%] h-7 w-[18px] rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-45"
        style={{
          background: "linear-gradient(140deg, #F2662F, #C9307C)",
          animation: "vlFloatSlow 12s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[210px] right-[11%] h-3.5 w-3.5 rounded-full opacity-40"
        style={{ background: "#F2662F", animation: "vlFloat 7s ease-in-out infinite" }}
      />

      <div className="relative mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-6 sm:grid-cols-[1.05fr_.95fr] sm:gap-[56px]">
        <div className="contents sm:block">
          <div className="order-1 mb-[26px] inline-flex items-center gap-[9px] rounded-full border border-navy/10 bg-white/75 px-4 py-2 text-sm font-semibold text-navy-soft">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #F2662F, #C9307C)" }}
            />
            {t("badge")}
          </div>

          <h1 className="order-2 mb-[22px] font-heading text-[36px] leading-[1.06] font-extrabold tracking-[-.6px] text-navy sm:text-[60px] sm:tracking-[-1.2px]">
            {t("h1")}
          </h1>

          <p className="order-3 -mt-1.5 mb-[22px] max-w-[560px] font-heading text-[26px] leading-[1.3] font-bold text-magenta">
            {t("subtitle")}
          </p>

          <p className="order-5 mb-3.5 max-w-[560px] text-lg leading-[1.62] text-navy-soft">
            {t("p1")}
          </p>
          <p className="order-6 mb-3.5 max-w-[560px] text-lg leading-[1.62] text-navy-soft">
            {t("p2")}
          </p>
          <p className="order-7 mb-[34px] max-w-[560px] text-lg leading-[1.62] text-navy-soft">
            {t("p3")}
          </p>

          <div className="order-8 mb-9 flex flex-wrap gap-3.5">
            <Link
              href="#cta"
              className="w-full rounded-field bg-indigo px-8 py-[17px] text-center font-heading text-[17px] font-bold text-white shadow-button transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
            >
              {common("bookConsultation")}
            </Link>
            <Link
              href="#shop"
              className="w-full rounded-field border-[1.5px] border-navy/18 bg-white/90 px-8 py-[17px] text-center font-heading text-[17px] font-bold text-navy transition-[border-color,translate] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-magenta hover:text-magenta sm:w-auto"
            >
              {common("toShop")}
            </Link>
          </div>

          <div className="hidden flex-wrap gap-7 text-[15px] font-semibold text-navy-soft sm:flex">
            <span>{t("stat1")}</span>
            <span className="text-navy/25">·</span>
            <span>{t("stat2")}</span>
            <span className="text-navy/25">·</span>
            <span>{t("stat3")}</span>
          </div>
        </div>

        <div className="order-4 relative">
          <div
            className="absolute -top-[22px] -right-[18px] bottom-6 left-[22px] rounded-block opacity-[.16] blur-[2px]"
            style={{
              background:
                "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
            }}
          />
          <div className="relative h-[380px] w-full overflow-hidden rounded-card shadow-photo sm:h-[460px] lg:h-[560px]">
            <Image
              src="/home/hero.jpg"
              alt="Вікторія Лемешко"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 8%" }}
              priority
            />
          </div>
          <div className="relative -mt-[46px] ml-6 inline-block rounded-field border border-navy/10 bg-white/95 px-[22px] py-4 shadow-[0_18px_34px_-20px_rgba(30,42,90,.35)] backdrop-blur-sm">
            <p className="font-heading text-lg font-extrabold text-navy">{t("photoCaption")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
