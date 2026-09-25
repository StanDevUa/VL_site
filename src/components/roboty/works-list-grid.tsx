"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Work = {
  slug: string;
  title: string;
  excerpt: string;
  photoUrl: string;
};

function usePerPage() {
  const [perPage, setPerPage] = useState(6);

  useEffect(() => {
    function sync() {
      setPerPage(window.innerWidth <= 640 ? 4 : 6);
    }
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  return perPage;
}

export function WorksListGrid({ works }: { works: Work[] }) {
  const t = useTranslations("Works");
  const perPage = usePerPage();
  const [page, setPage] = useState(0);

  const pages = Math.max(1, Math.ceil(works.length / perPage));
  const current = Math.min(page, pages - 1);
  const pageItems = works.slice(current * perPage, current * perPage + perPage);

  function goToPage(i: number) {
    setPage(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-[22px] lg:grid-cols-3">
        {pageItems.map((w) => (
          <Link
            key={w.slug}
            href={`/roboty/${w.slug}`}
            className="block overflow-hidden rounded-card border border-navy/12 bg-white text-inherit transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-1.5 hover:shadow-[0_26px_46px_-28px_rgba(30,42,90,.4)]"
          >
            <div className="relative h-[230px] w-full">
              <Image
                src={w.photoUrl}
                alt={w.title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="px-[26px] pt-6 pb-7">
              <h3 className="mb-2 font-heading text-[18px] leading-[1.3] font-bold text-navy sm:text-[19px]">
                {w.title}
              </h3>
              <p className="line-clamp-2 text-[15px] leading-[1.6] text-navy-soft">{w.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-[14px]">
          <button
            type="button"
            onClick={() => goToPage(Math.max(0, current - 1))}
            aria-label={t("prevPageAria")}
            style={{ opacity: current === 0 ? 0.4 : 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={t("goToPageAria", { n: i + 1 })}
                className="h-[38px] min-w-[38px] rounded-[10px] border-[1.5px] px-3 font-heading text-[15px] font-bold transition-all duration-200 ease-in-out"
                style={{
                  background: i === current ? "#5252AC" : "transparent",
                  color: i === current ? "#fff" : "#4A5480",
                  borderColor: i === current ? "#5252AC" : "rgba(30,42,90,.18)",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goToPage(Math.min(pages - 1, current + 1))}
            aria-label={t("nextPageAria")}
            style={{ opacity: current === pages - 1 ? 0.4 : 1 }}
            className="flex h-12 w-12 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-white text-xl text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
          >
            →
          </button>
        </div>
      )}
    </>
  );
}
