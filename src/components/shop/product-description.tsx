"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShareButton } from "@/components/ui/share-button";

/** Перший абзац — завжди видимий вступ, решта — під розгортанням "Детальніше про товар" (за рішенням Стаса 2026-09-25, точного поля "короткий/повний опис" у БД нема). */
function splitDescription(text: string): { intro: string; rest: string } {
  const [intro, ...restParts] = text.split(/\n\s*\n/);
  return { intro: intro ?? "", rest: restParts.join("\n\n") };
}

export function ProductDescription({ description }: { description: string }) {
  const t = useTranslations("Shop");
  const [open, setOpen] = useState(false);
  const { intro, rest } = splitDescription(description);

  return (
    <div>
      <p className="mb-3.5 text-[16.5px] leading-[1.7] text-navy-soft text-pretty">{intro}</p>

      {rest && (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 border-0 bg-transparent p-0 font-heading text-[15px] font-bold text-indigo transition-colors duration-[250ms] ease-in-out hover:text-magenta"
            >
              {open ? t("collapseDescription") : t("readMoreAboutProduct")}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .25s ease" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <div
            className="overflow-hidden"
            style={{
              maxHeight: open ? "2000px" : "0px",
              transition: "max-height .45s cubic-bezier(.22,.7,.25,1)",
            }}
          >
            <div className="pt-4">
              {rest.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="mb-3.5 text-base leading-[1.75] text-navy-soft text-pretty last:mb-[18px]">
                  {para}
                </p>
              ))}
              <ShareButton size="compact" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
