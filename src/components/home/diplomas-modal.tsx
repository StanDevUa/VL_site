"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Diploma = {
  imageUrl: string;
  caption: string;
};

/** Той самий лайтбокс-патерн, що й у ProductGallery/WorkGallery (оверлей,
 * stopPropagation на вмісті, стрілки з тим самим wrap-around через %) —
 * тут додано підпис під фото, бо в дипломів (на відміну від фото товару/
 * роботи) він смислово важливий, а не завжди присутній. */
export function DiplomasModal({ diplomas }: { diplomas: Diploma[] }) {
  const t = useTranslations("HomeAbout");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (diplomas.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="w-full rounded-field border-[1.5px] border-navy/18 bg-white/90 px-7 py-[15px] text-center font-heading text-base font-bold text-navy transition-[border-color,translate] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-magenta hover:text-magenta sm:w-auto"
      >
        {t("ctaQualifications")}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1A2450]/72 p-6 backdrop-blur-[4px]"
        >
          <div onClick={(e) => e.stopPropagation()} className="relative w-[min(720px,100%)]">
            <div className="relative h-[min(70vh,560px)] w-full overflow-hidden rounded-card bg-navy/5">
              <Image
                src={diplomas[index].imageUrl}
                alt={diplomas[index].caption || t("ctaQualifications")}
                fill
                sizes="720px"
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              title={t("diplomasCloseAria")}
              className="absolute -top-[18px] -right-[18px] flex h-11 w-11 items-center justify-center rounded-full border-0 bg-white text-xl text-navy shadow-[0_12px_24px_-10px_rgba(0,0,0,.4)]"
            >
              ×
            </button>

            {diplomas[index].caption && (
              <p className="mt-4 text-center font-heading text-lg font-bold text-white">
                {diplomas[index].caption}
              </p>
            )}

            {diplomas.length > 1 && (
              <div className="mt-[18px] flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex((i) => (i - 1 + diplomas.length) % diplomas.length);
                  }}
                  aria-label={t("diplomasPrevAria")}
                  className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  ←
                </button>
                <span className="font-heading text-sm font-bold text-white">
                  {index + 1} / {diplomas.length}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex((i) => (i + 1) % diplomas.length);
                  }}
                  aria-label={t("diplomasNextAria")}
                  className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
