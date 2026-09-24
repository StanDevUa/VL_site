"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Work = {
  slug: string;
  title: string;
  excerpt: string;
  photoUrl: string;
};

export function WorksCarousel({ works }: { works: Work[] }) {
  const t = useTranslations("HomeWorks");
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return;
    track.scrollBy({ left: dir * (first.getBoundingClientRect().width + 22), behavior: "smooth" });
  }

  return (
    <>
      <div className="mb-11 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div className="max-w-[640px]">
          <div className="mb-4 text-sm font-bold tracking-[1.6px] text-violet uppercase">{t("eyebrow")}</div>
          <h2 className="font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
            {t("h2")}
          </h2>
        </div>
        <div className="flex w-full shrink-0 items-center justify-between gap-5 sm:w-auto sm:justify-start">
          <Link
            href="/roboty"
            className="shrink-0 border-b-2 border-magenta/40 pb-[3px] font-heading text-base font-bold text-navy transition-[color,border-color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
          >
            {t("ctaAllWorks")}
          </Link>
          <div className="hidden shrink-0 gap-2.5 max-lg:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={t("prevAria")}
              className="flex h-11 w-11 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-[19px] text-navy"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={t("nextAria")}
              className="flex h-11 w-11 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-[19px] text-navy"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-[22px] overflow-x-auto pb-1 lg:grid lg:grid-cols-3 lg:overflow-visible"
      >
        {works.map((w) => (
          <Link
            key={w.slug}
            href={`/roboty/${w.slug}`}
            className="block shrink-0 basis-full overflow-hidden rounded-card border border-navy/12 bg-white text-inherit transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-1.5 hover:shadow-[0_26px_46px_-28px_rgba(30,42,90,.4)] sm:basis-[calc((100%-22px)/2)] lg:basis-auto"
          >
            <div className="relative h-[240px] w-full">
              <Image src={w.photoUrl} alt={w.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="px-[26px] pt-6 pb-7">
              <h3 className="mb-2 font-heading text-[18px] font-bold text-navy sm:text-[19px]">{w.title}</h3>
              <p className="line-clamp-2 text-[15px] leading-[1.6] text-navy-soft">{w.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
