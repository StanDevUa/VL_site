import { getTranslations } from "next-intl/server";
import { CtaForm } from "./cta-form";

const BULLET_KEYS = ["bullet1", "bullet2", "bullet3"];

export async function CtaSection() {
  const t = await getTranslations("HomeCta");

  return (
    <section id="cta" className="scroll-mt-24 px-[18px] pt-6 pb-0 sm:px-6 sm:pt-[40px] lg:px-8">
      <div
        className="relative mx-auto max-w-[1240px] overflow-hidden rounded-block px-5 py-9 sm:px-8 sm:py-12 lg:px-16 lg:py-[68px]"
        style={{
          background: "linear-gradient(125deg, #F2662F 0%, #C9307C 40%, #7A3AA0 68%, #2B6BB8 100%)",
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[120px] -right-[60px] h-[380px] w-[380px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,.16), rgba(255,255,255,0) 68%)",
            animation: "vlPulse 12s ease-in-out infinite",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-[190px] h-[360px] w-[360px] rounded-full bg-white/[.07]"
          style={{ left: "calc(50% - 446px)" }}
        />

        <div className="relative grid grid-cols-1 items-center gap-6 sm:gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="mb-5 font-heading text-[28px] leading-[1.1] font-extrabold tracking-[-.4px] text-white sm:text-[44px] sm:tracking-[-1px]">
              {t("h2")}
            </h2>
            <p className="mb-7 text-lg leading-[1.65] text-white/95">{t("p")}</p>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-base text-white/95">
              {BULLET_KEYS.map((key) => (
                <li key={key} className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </div>

          <CtaForm />
        </div>
      </div>
    </section>
  );
}
