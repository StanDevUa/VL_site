"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type OtherWork = {
  slug: string;
  title: string;
  excerpt: string;
  photoUrl: string;
};

export function OthersSidebar({ others }: { others: OtherWork[] }) {
  const t = useTranslations("Works");
  const common = useTranslations("Common");
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  if (others.length === 0) return null;

  return (
    <aside className="max-sm:flex max-sm:flex-wrap max-sm:items-center">
      <div className="mb-5 font-heading text-xl font-extrabold text-navy max-sm:order-1 max-sm:mr-auto max-sm:mb-0">
        {t("otherWorks")}
      </div>
      <div className="hidden max-sm:contents">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          aria-label={t("sidePrevAria")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta max-sm:order-2 max-sm:flex"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          aria-label={t("sideNextAria")}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta max-sm:order-3 max-sm:ml-[10px] max-sm:flex"
        >
          →
        </button>
      </div>
      <div
        ref={trackRef}
        className="mb-4 flex flex-col gap-3.5 max-sm:order-4 max-sm:mt-4 max-sm:mb-0 max-sm:w-full max-sm:flex-row max-sm:gap-0 max-sm:overflow-x-auto max-sm:snap-x max-sm:snap-mandatory"
      >
        {others.map((o) => (
          <Link
            key={o.slug}
            href={`/roboty/${o.slug}`}
            className="flex items-center gap-3.5 rounded-field border border-navy/12 bg-white p-3 text-inherit transition-[translate,box-shadow,border-color] duration-200 ease-in-out hover:-translate-y-[3px] hover:border-magenta/30 hover:shadow-[0_18px_32px_-22px_rgba(30,42,90,.4)] max-sm:shrink-0 max-sm:basis-full max-sm:snap-start"
          >
            <span className="relative h-[62px] w-[74px] shrink-0 overflow-hidden rounded-[9px] bg-navy/5">
              <Image src={o.photoUrl} alt={o.title} fill sizes="74px" className="object-cover" />
            </span>
            <span className="block min-w-0">
              <span className="mb-1 block truncate font-heading text-[15.5px] leading-[1.3] font-bold text-navy">
                {o.title}
              </span>
              <span className="line-clamp-2 text-[13px] leading-[1.4] text-navy-soft">{o.excerpt}</span>
            </span>
          </Link>
        ))}
      </div>
      <Link
        href="/roboty"
        className="mt-[22px] inline-block border-b-2 border-magenta/40 pb-[3px] font-heading text-base font-bold text-navy transition-[color,border-color] duration-200 ease-in-out hover:border-magenta hover:text-magenta max-sm:order-5 max-sm:mt-[18px] max-sm:ml-auto"
      >
        {common("allWorks")}
      </Link>
    </aside>
  );
}
