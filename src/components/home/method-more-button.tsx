"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

/** Сайт ТМ «Єнот ЕМО» ще не запущено — кнопка "Детальніше про методику"
 * задумувалась як перехід на нього, тож поки що замість посилання показує
 * повідомлення "скоро запрацює". */
export function MethodMoreButton() {
  const t = useTranslations("HomeMethod");
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-field border-[1.5px] border-navy/18 bg-white/90 px-6 py-4 text-center font-heading text-base font-bold text-navy transition-[border-color,translate] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:border-magenta hover:text-magenta sm:w-auto"
      >
        {t("ctaMore")}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1A2450]/72 p-7 backdrop-blur-[4px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(480px,100%)] rounded-block bg-white px-10 pt-11 pb-9 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,.5)]"
          >
            <span className="mb-[22px] inline-block h-[72px] w-[72px] overflow-hidden rounded-full">
              <Image src="/scroll-top-icon.png" alt="" width={72} height={72} className="h-full w-full object-cover" />
            </span>
            <div className="mb-3.5 font-heading text-[22px] leading-[1.25] font-extrabold text-navy">
              {t("comingSoonTitle")}
            </div>
            <p className="mb-7 text-base leading-[1.7] text-navy-soft">{t("comingSoonText")}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-field bg-indigo px-[34px] py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
            >
              {t("comingSoonClose")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
