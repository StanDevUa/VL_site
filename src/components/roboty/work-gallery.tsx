"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const PER_VIEW = 3;
const PER_VIEW_MOBILE = 2;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function sync() {
      setIsMobile(window.innerWidth <= 640);
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return isMobile;
}

export function WorkGallery({ photos, title }: { photos: string[]; title: string }) {
  const t = useTranslations("Works");
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [start, setStart] = useState(0);
  const [modal, setModal] = useState(-1);
  const [loadedIndex, setLoadedIndex] = useState(-1);
  const modalLoaded = loadedIndex === modal;

  const perView = isMobile ? PER_VIEW_MOBILE : PER_VIEW;
  const maxStart = Math.max(0, photos.length - perView);
  const clampedStart = Math.min(start, maxStart);
  const shown = photos.slice(clampedStart, clampedStart + perView);
  const hasArrows = photos.length > perView;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModal(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function goPrev() {
    const el = trackRef.current;
    if (el && el.scrollWidth > el.clientWidth + 4) {
      el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
      return;
    }
    setStart((s) => Math.max(0, s - 1));
  }

  function goNext() {
    const el = trackRef.current;
    if (el && el.scrollWidth > el.clientWidth + 4) {
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      return;
    }
    setStart((s) => Math.min(maxStart, s + 1));
  }

  if (photos.length === 0) return null;

  return (
    <div className="pt-9 max-sm:flex max-sm:flex-wrap max-sm:items-center">
      <div className="mb-[18px] text-center font-heading text-base font-bold text-navy-soft max-sm:order-1 max-sm:mr-auto max-sm:mb-0 max-sm:text-left">
        {t("galleryHeading")}
      </div>
      <div className="flex items-center justify-center gap-4 max-sm:contents">
        {hasArrows && (
          <button
            type="button"
            onClick={goPrev}
            aria-label={t("galleryPrevAria")}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta max-sm:order-2"
          >
            ←
          </button>
        )}
        <div
          ref={trackRef}
          className="flex flex-wrap justify-center gap-4 max-sm:order-4 max-sm:mt-4 max-sm:w-full max-sm:flex-nowrap max-sm:justify-start max-sm:gap-2.5 max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory"
        >
          {shown.map((src, i) => {
            const realIndex = clampedStart + i;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setModal(realIndex)}
                className="relative h-[120px] w-[calc((100%-10px)/2)] shrink-0 cursor-pointer overflow-hidden rounded-field border border-navy/12 p-0 transition-[translate,box-shadow] duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_18px_30px_-18px_rgba(30,42,90,.45)] max-sm:snap-start sm:h-[140px] sm:w-[190px]"
              >
                <Image src={src} alt={`${title} ${realIndex + 1}`} fill sizes="190px" className="object-cover" />
              </button>
            );
          })}
        </div>
        {hasArrows && (
          <button
            type="button"
            onClick={goNext}
            aria-label={t("galleryNextAria")}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta max-sm:order-3 max-sm:ml-[10px]"
          >
            →
          </button>
        )}
      </div>

      {modal >= 0 && (
        <div
          onClick={() => setModal(-1)}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#1A2450]/72 p-8 backdrop-blur-[4px]"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-[min(920px,100%)]">
            <div className="relative h-[min(70vh,560px)] w-full overflow-hidden rounded-card bg-navy/5">
              {!modalLoaded && (
                <div aria-hidden className="absolute inset-0 animate-pulse bg-navy/10" />
              )}
              <Image
                src={photos[modal]}
                alt={`${title} ${modal + 1}`}
                fill
                sizes="920px"
                className="object-contain transition-opacity duration-300 ease-in-out"
                style={{ opacity: modalLoaded ? 1 : 0 }}
                onLoad={() => setLoadedIndex(modal)}
              />
            </div>
            <button
              type="button"
              onClick={() => setModal(-1)}
              title={t("closeAria")}
              className="absolute -top-[18px] -right-[18px] flex h-11 w-11 items-center justify-center rounded-full border-0 bg-white text-xl text-navy shadow-[0_12px_24px_-10px_rgba(0,0,0,.4)]"
            >
              ×
            </button>
            {photos.length > 1 && (
              <div className="mt-[18px] flex justify-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal((m) => (m - 1 + photos.length) % photos.length);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModal((m) => (m + 1) % photos.length);
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
