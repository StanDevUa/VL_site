"use client";

import { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type NewsItem = {
  slug: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  photoUrl: string;
};

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const t = useTranslations("HomeNews");
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
        <div className="max-w-[620px]">
          <div className="mb-4 text-sm font-bold tracking-[1.6px] text-blue uppercase">{t("eyebrow")}</div>
          <h2 className="font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
            {t("h2")}
          </h2>
        </div>
        <div className="flex w-full shrink-0 items-center justify-between gap-5 sm:w-auto sm:justify-start">
          <Link
            href="/novyny"
            className="shrink-0 border-b-2 border-blue/40 pb-[3px] font-heading text-base font-bold text-navy transition-[color,border-color] duration-[250ms] ease-in-out hover:border-blue hover:text-blue"
          >
            {t("ctaAllNews")}
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
        {items.map((n) => (
          <Link
            key={n.slug}
            href={`/novyny/${n.slug}`}
            className="block shrink-0 basis-full overflow-hidden rounded-card border border-navy/12 bg-white text-inherit transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-1.5 hover:shadow-[0_26px_46px_-28px_rgba(30,42,90,.4)] sm:basis-[calc((100%-22px)/2)] lg:basis-auto"
          >
            <div className="relative h-[180px] w-full">
              <Image src={n.photoUrl} alt={n.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="px-6 pt-[22px] pb-[26px]">
              <div className="mb-3 flex items-center justify-between gap-2.5">
                <span className="rounded-[7px] bg-magenta/9 px-2.5 py-[5px] text-xs font-bold tracking-[.6px] text-magenta uppercase">
                  {n.tag}
                </span>
                <span className="text-[13.5px] text-navy-soft">{n.date}</span>
              </div>
              <h3 className="mb-2.5 font-heading text-[18px] leading-[1.3] font-bold text-navy sm:text-[19px]">
                {n.title}
              </h3>
              <p className="line-clamp-2 text-[15px] leading-[1.6] text-navy-soft">{n.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
