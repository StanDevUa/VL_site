"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Review = {
  text: string;
  name: string;
  detail: string;
};

function useReviewsPerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    function sync() {
      const w = window.innerWidth;
      setPerView(w <= 640 ? 1 : w <= 1024 ? 2 : 3);
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return perView;
}

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("HomeReviews");
  const common = useTranslations("Common");
  const perView = useReviewsPerView();
  const [review, setReview] = useState(0);

  const maxIndex = Math.max(0, reviews.length - perView);
  const idx = Math.min(review, maxIndex);
  const cardWidth = `calc((100% - ${(perView - 1) * 22}px) / ${perView})`;
  const shift = `translateX(calc(${-idx} * (${cardWidth} + 22px)))`;

  function prevReview() {
    setReview((r) => Math.max(0, Math.min(r, maxIndex) - 1));
  }
  function nextReview() {
    setReview((r) => Math.min(maxIndex, r + 1));
  }

  return (
    <section id="reviews" className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-11 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-[620px]">
            <div className="mb-4 text-sm font-bold tracking-[1.6px] text-blue uppercase">{t("eyebrow")}</div>
            <h2 className="font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
              {t("h2")}
            </h2>
          </div>
          <div className="flex shrink-0 gap-2.5">
            <button
              type="button"
              onClick={prevReview}
              aria-label={t("prevAria")}
              className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextReview}
              aria-label={t("nextAria")}
              className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-[22px] transition-transform duration-[550ms] ease-[cubic-bezier(.22,.7,.25,1)]"
            style={{ transform: shift }}
          >
            {reviews.map((r) => (
              <div
                key={r.name}
                className="rounded-card border border-navy/12 px-[30px] py-8"
                style={{
                  flex: `0 0 ${cardWidth}`,
                  background: "linear-gradient(170deg, rgba(251,239,236,.75), rgba(255,253,252,1))",
                }}
              >
                <div className="mb-3 font-heading text-[44px] leading-none text-magenta opacity-50">“</div>
                <p className="mb-6 h-[138.6px] overflow-hidden text-[16.5px] leading-[1.68] text-navy">
                  {r.text}
                </p>
                <div className="flex items-center gap-3 border-t border-navy/12 pt-5">
                  <div
                    className="h-10 w-10 rounded-[10px] opacity-[.85]"
                    style={{
                      background:
                        "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
                    }}
                  />
                  <div>
                    <div className="text-[15px] font-bold text-navy">{r.name}</div>
                    <div className="text-[13.5px] text-navy-soft">{r.detail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6">
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={t("dotAria", { n: i + 1 })}
                onClick={() => setReview(i)}
                className="h-2 cursor-pointer rounded-full border-0 p-0 transition-[width,background] duration-300 ease-in-out"
                style={{
                  width: i === idx ? "30px" : "8px",
                  background: i === idx ? "linear-gradient(90deg, #F2662F, #C9307C)" : "rgba(30,42,90,.18)",
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-[34px]">
            <span
              aria-hidden
              className="h-[34px] w-[22px] shrink-0 rounded-tl-[60%] rounded-tr-[10%] rounded-br-[60%] rounded-bl-[10%] opacity-40"
              style={{
                background: "linear-gradient(140deg, #C9307C, #7A3AA0)",
                animation: "vlFloatSlow 11s ease-in-out infinite",
              }}
            />
            <Link
              href="#cta"
              className="w-full rounded-field bg-indigo px-7 py-[15px] text-center font-heading text-base font-bold text-white shadow-[0_12px_26px_-12px_rgba(82,82,172,.34)] transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_18px_34px_-14px_rgba(82,82,172,.34)] sm:w-auto"
            >
              {common("bookConsultation")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
