"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AddTestimonialModal } from "./add-testimonial-modal";

// Той самий secondary-стиль, що і в Hero/About (border-navy/18, hover:magenta,
// підйом на hover) — раніше кнопка була навмисно дрібнішою, ніж сусідні
// кнопки в цьому ж рядку, що виглядало неохайно.
const addReviewButtonClass =
  "whitespace-nowrap rounded-field border-[1.5px] border-navy/18 bg-white/90 px-7 py-[15px] text-center font-heading text-base font-bold text-navy transition-[border-color,translate] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-magenta hover:text-magenta";

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

/** Показує кнопку "Читати повністю" лише якщо текст РЕАЛЬНО обрізаний
 * рамкою в 4 рядки — рахувати "на око" за кількістю символів ненадійно,
 * бо перенос рядків залежить від ширини картки на конкретному екрані. */
function ReviewCardBody({ review, onReadMore }: { review: Review; onReadMore: () => void }) {
  const t = useTranslations("HomeReviews");
  const textRef = useRef<HTMLParagraphElement>(null);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (el) setTruncated(el.scrollHeight > el.clientHeight + 1);
  }, [review.text]);

  return (
    <>
      <div className="mb-3 font-heading text-[44px] leading-none text-magenta opacity-50">“</div>
      <p ref={textRef} className="line-clamp-4 h-[110.88px] text-[16.5px] leading-[1.68] text-navy">
        {review.text}
      </p>
      <div className="mt-2 mb-4 flex h-8 items-center justify-end">
        {truncated && (
          <button
            type="button"
            onClick={onReadMore}
            className="border-0 bg-transparent p-0 font-heading text-sm font-bold text-indigo transition-colors duration-[250ms] ease-in-out hover:text-magenta"
          >
            {t("readMore")}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3 border-t border-navy/12 pt-5">
        <div
          className="h-10 w-10 shrink-0 rounded-[10px] opacity-[.85]"
          style={{
            background: "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
          }}
        />
        <div>
          <div className="text-[15px] font-bold text-navy">{review.name}</div>
          <div className="text-[13.5px] text-navy-soft">{review.detail}</div>
        </div>
      </div>
    </>
  );
}

export function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const t = useTranslations("HomeReviews");
  const common = useTranslations("Common");
  const perView = useReviewsPerView();
  const [review, setReview] = useState(0);
  const [modalIndex, setModalIndex] = useState(-1);
  const [addReviewOpen, setAddReviewOpen] = useState(false);

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

  useEffect(() => {
    if (modalIndex < 0) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModalIndex(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalIndex]);

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
          <div className="flex w-full items-center justify-between gap-2.5 sm:w-auto sm:justify-end">
            <button type="button" onClick={() => setAddReviewOpen(true)} className={`${addReviewButtonClass} sm:hidden`}>
              {t("addReview")}
            </button>
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
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-[22px] transition-transform duration-[550ms] ease-[cubic-bezier(.22,.7,.25,1)]"
            style={{ transform: shift }}
          >
            {reviews.map((r, i) => (
              <div
                key={r.name}
                className="rounded-card border border-navy/12 px-[30px] py-8"
                style={{
                  flex: `0 0 ${cardWidth}`,
                  background: "linear-gradient(170deg, rgba(251,239,236,.75), rgba(255,253,252,1))",
                }}
              >
                <ReviewCardBody review={r} onReadMore={() => setModalIndex(i)} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-6 sm:grid sm:grid-cols-3">
          {perView === 1 ? (
            // На мобільному perView=1 -> кількість крапок = кількість відгуків:
            // при 15-20 відгуках вони не влізуть в один рядок і поламають
            // верстку. Замість крапок — текстовий лічильник фіксованої
            // ширини, який ніколи не переповнює рядок. Десктоп/планшет — без змін.
            <span className="font-heading text-sm font-bold text-navy-soft sm:justify-self-start">
              {t("counter", { current: idx + 1, total: maxIndex + 1 })}
            </span>
          ) : (
            <div className="flex gap-2 sm:justify-self-start">
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
          )}
          <button
            type="button"
            onClick={() => setAddReviewOpen(true)}
            className={`hidden sm:inline-flex sm:justify-self-center ${addReviewButtonClass}`}
          >
            {t("addReview")}
          </button>
          <div className="flex items-center gap-[34px] sm:justify-self-end">
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

      {modalIndex >= 0 && (
        <div
          onClick={() => setModalIndex(-1)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1A2450]/72 p-8 backdrop-blur-[4px]"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-[min(640px,100%)]">
            <div
              className="rounded-card border border-navy/12 px-8 py-9"
              style={{ background: "linear-gradient(170deg, rgba(251,239,236,.9), rgba(255,253,252,1))" }}
            >
              <div className="mb-3 font-heading text-[44px] leading-none text-magenta opacity-50">“</div>
              <p className="mb-6 text-[16.5px] leading-[1.68] text-navy text-pretty">{reviews[modalIndex].text}</p>
              <div className="flex items-center gap-3 border-t border-navy/12 pt-5">
                <div
                  className="h-10 w-10 shrink-0 rounded-[10px] opacity-[.85]"
                  style={{
                    background: "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)",
                  }}
                />
                <div>
                  <div className="text-[15px] font-bold text-navy">{reviews[modalIndex].name}</div>
                  <div className="text-[13.5px] text-navy-soft">{reviews[modalIndex].detail}</div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalIndex(-1)}
              title={t("closeAria")}
              className="absolute -top-[18px] -right-[18px] flex h-11 w-11 items-center justify-center rounded-full border-0 bg-white text-xl text-navy shadow-[0_12px_24px_-10px_rgba(0,0,0,.4)]"
            >
              ×
            </button>
            {reviews.length > 1 && (
              <div className="mt-[18px] flex justify-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalIndex((m) => (m - 1 + reviews.length) % reviews.length);
                  }}
                  aria-label={t("prevAria")}
                  className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalIndex((m) => (m + 1) % reviews.length);
                  }}
                  aria-label={t("nextAria")}
                  className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AddTestimonialModal open={addReviewOpen} onClose={() => setAddReviewOpen(false)} />
    </section>
  );
}
