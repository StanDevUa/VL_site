import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.4c0-.9.3-1.4 1.4-1.4h1.8V4.2C16.2 4.1 15.2 4 14 4c-2.4 0-4 1.5-4 4.1V10H7.5v3H10v8z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="#fff" stroke="none" />
    </svg>
  );
}

export async function VideoSection() {
  const t = await getTranslations("HomeVideo");
  const common = await getTranslations("Common");

  return (
    <section id="video" className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:py-24 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[110px] right-[6%] h-7 w-[18px] rounded-tl-[60%] rounded-tr-[10%] rounded-br-[60%] rounded-bl-[10%] opacity-40"
        style={{
          background: "linear-gradient(140deg, #F2662F, #7A3AA0)",
          animation: "vlFloatSlow 9s ease-in-out infinite",
        }}
      />

      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-6 sm:grid-cols-[1.25fr_.75fr] sm:gap-12">
        <div
          className="relative flex h-[300px] items-center justify-center overflow-hidden rounded-card border border-navy/12 sm:h-[420px]"
          style={{
            backgroundColor: "#F0E6E1",
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(30,42,90,.09) 0 10px, rgba(30,42,90,0) 10px 20px)",
          }}
        >
          <button
            type="button"
            className="flex h-[92px] w-[92px] items-center justify-center rounded-full border-0 pl-1.5 text-2xl text-white shadow-[0_20px_40px_-16px_rgba(201,48,124,.32)] transition-transform duration-300 ease-in-out hover:scale-[1.07]"
            style={{
              background: "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
            }}
          >
            ▶
          </button>
          <span className="absolute bottom-4 left-4 rounded-[6px] bg-white/92 px-2 py-[5px] font-mono text-[11.5px] text-navy-soft">
            {t("previewCaption")}
          </span>
        </div>

        <div>
          <h2 className="mb-[18px] font-heading text-[28px] leading-[1.16] font-extrabold tracking-[-.4px] text-navy sm:text-[36px] sm:tracking-[-.7px]">
            {t("h2")}
          </h2>
          <p className="mb-7 text-[17px] leading-[1.7] text-navy-soft">{t("p")}</p>

          <div className="mb-3.5 text-[15px] font-bold text-navy">{t("followLabel")}</div>
          <div className="mb-7 flex flex-wrap gap-3">
            <a
              href="https://www.facebook.com/lemeshkoviktoriia"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-field border-[1.5px] border-navy/16 px-5 py-[13px] text-[15px] font-bold text-navy transition-[border-color,color,translate] duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:border-blue hover:text-blue"
            >
              <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px]"
                style={{ background: "linear-gradient(135deg, #2B6BB8, #7A3AA0)" }}
              >
                <FacebookIcon />
              </span>
              Facebook
            </a>
            <a
              href="https://www.instagram.com/viktoriya.lemeshko"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 rounded-field border-[1.5px] border-navy/16 px-5 py-[13px] text-[15px] font-bold text-navy transition-[border-color,color,translate] duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:border-magenta hover:text-magenta"
            >
              <span
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px]"
                style={{ background: "linear-gradient(135deg, #F2662F, #C9307C)" }}
              >
                <InstagramIcon />
              </span>
              Instagram
            </a>
          </div>

          <Link
            href="#cta"
            className="inline-block w-full rounded-field bg-indigo px-[30px] py-4 text-center font-heading text-base font-bold text-white shadow-button transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
          >
            {common("bookConsultation")}
          </Link>
        </div>
      </div>
    </section>
  );
}
