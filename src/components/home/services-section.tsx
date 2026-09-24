"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type ServiceVisual = {
  key: string;
  bg: string;
  wash: string;
  dot: string;
  icon: [string, string, string];
};

const SERVICES: ServiceVisual[] = [
  {
    key: "joint",
    bg: "rgba(255,253,252,.96)",
    wash: "radial-gradient(circle, rgba(242,102,47,.12), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #F2662F, #C9307C)",
    icon: [
      "M10.1 6.6a2.1 2.1 0 1 1-4.2 0 2.1 2.1 0 0 1 4.2 0",
      "M4.4 19v-2.3a3.6 3.6 0 0 1 7.2 0V19",
      "M17.7 12.4a1.6 1.6 0 1 1-3.2 0 1.6 1.6 0 0 1 3.2 0M13.7 19v-1.5a2.4 2.4 0 0 1 4.8 0V19",
    ],
  },
  {
    key: "parents",
    bg: "linear-gradient(165deg, rgba(251,239,236,.85), rgba(255,253,252,.96))",
    wash: "radial-gradient(circle, rgba(201,48,124,.1), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #C9307C, #7A3AA0)",
    icon: [
      "M6.7 7.3a2 2 0 1 1-4 0 2 2 0 0 1 4 0M1.6 19v-2.4a3.1 3.1 0 0 1 5.4-2.1",
      "M21.3 7.3a2 2 0 1 1-4 0 2 2 0 0 1 4 0M22.4 19v-2.4a3.1 3.1 0 0 0-5.4-2.1",
      "M13.8 11.9a1.8 1.8 0 1 1-3.6 0 1.8 1.8 0 0 1 3.6 0M9 19v-1.8a3 3 0 0 1 6 0V19",
    ],
  },
  {
    key: "teens",
    bg: "rgba(255,253,252,.96)",
    wash: "radial-gradient(circle, rgba(122,58,160,.1), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #7A3AA0, #2B6BB8)",
    icon: [
      "M14.6 7.9a2.6 2.6 0 1 1-5.2 0 2.6 2.6 0 0 1 5.2 0",
      "M5.6 19.4a6.4 6.4 0 0 1 12.8 0",
      "M19.2 3.9l.6 1.5 1.5.6-1.5.6-.6 1.5-.6-1.5-1.5-.6 1.5-.6z",
    ],
  },
  {
    key: "women",
    bg: "linear-gradient(165deg, rgba(250,244,234,.9), rgba(255,253,252,.96))",
    wash: "radial-gradient(circle, rgba(201,48,124,.1), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #C9307C, #F2662F)",
    icon: ["M16 8.4a4.1 4.1 0 1 1-8.2 0 4.1 4.1 0 0 1 8.2 0", "M11.9 12.5V20", "M8.9 17.1h6"],
  },
  {
    key: "professionals",
    bg: "rgba(255,253,252,.96)",
    wash: "radial-gradient(circle, rgba(242,102,47,.1), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #F2662F, #7A3AA0)",
    icon: [
      "M3.6 8.4h16.8a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H3.6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
      "M9.1 8.4V6.6a1.4 1.4 0 0 1 1.4-1.4h3a1.4 1.4 0 0 1 1.4 1.4v1.8",
      "M2.6 12.9h18.8M11 12.9v1.6h2v-1.6",
    ],
  },
  {
    key: "training",
    bg: "linear-gradient(160deg, #EDE9F7, #F6EFF0)",
    wash: "radial-gradient(circle, rgba(82,82,172,.16), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #5252AC, #7A3AA0)",
    icon: [
      "M4.4 5.4h15.2a1 1 0 0 1 1 1v8.1a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1V6.4a1 1 0 0 1 1-1z",
      "M12 15.5v3.1M9.2 20.3 12 18.6l2.8 1.7",
      "M7.4 11.9l2.5-3 2.4 2.5 2-2.6 2.3 3.1",
    ],
  },
  {
    key: "onsite",
    bg: "rgba(255,253,252,.96)",
    wash: "radial-gradient(circle, rgba(43,107,184,.1), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #2B6BB8, #5252AC)",
    icon: ["M12 4.6 4 8.2l8 3.6 8-3.6-8-3.6z", "M6.4 10v4.8c0 1.6 2.5 2.9 5.6 2.9s5.6-1.3 5.6-2.9V10", "M20 8.4v5"],
  },
  {
    key: "groups",
    bg: "linear-gradient(165deg, rgba(251,239,236,.85), rgba(255,253,252,.96))",
    wash: "radial-gradient(circle, rgba(201,48,124,.1), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #C9307C, #2B6BB8)",
    icon: [
      "M11.3 8.5a2.2 2.2 0 1 1-4.4 0 2.2 2.2 0 0 1 4.4 0",
      "M3 19.4a6.1 6.1 0 0 1 12.2 0",
      "M15.7 6.6a2.1 2.1 0 0 1 0 4.2M17 12.8a5 5 0 0 1 3.4 4.7",
    ],
  },
  {
    key: "mentoring",
    bg: "rgba(255,253,252,.96)",
    wash: "radial-gradient(circle, rgba(242,102,47,.12), rgba(255,255,255,0) 70%)",
    dot: "linear-gradient(135deg, #F2662F, #5252AC)",
    icon: [
      "M12 19.9s-6.6-4-6.6-8.4a3.7 3.7 0 0 1 6.6-2.3 3.7 3.7 0 0 1 6.6 2.3c0 4.4-6.6 8.4-6.6 8.4z",
      "M2.9 11.6A9.1 9.1 0 0 1 7.6 3.9",
      "M21.1 11.6a9.1 9.1 0 0 0-4.7-7.7",
    ],
  },
];

function ServiceCard({ visual }: { visual: ServiceVisual }) {
  const t = useTranslations("HomeServices");
  const [open, setOpen] = useState(false);
  const points = t.raw(`items.${visual.key}.points`) as string[];

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-card border border-navy/12 p-6 transition-[translate,box-shadow,border-color] duration-300 ease-in-out hover:-translate-y-1.5 hover:border-magenta/30 hover:shadow-[0_24px_44px_-26px_rgba(30,42,90,.35)]"
      style={{ background: visual.bg }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-[130px] w-[130px] rounded-full"
        style={{ background: visual.wash }}
      />

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex w-full items-center gap-[15px] bg-transparent p-0 text-left"
      >
        <span
          className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px]"
          style={{ background: visual.dot }}
        >
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d={visual.icon[0]} />
            <path d={visual.icon[1]} />
            <path d={visual.icon[2]} />
          </svg>
        </span>
        <span className="flex min-h-[92px] flex-1 items-center font-heading text-[18.5px] leading-[1.25] font-bold text-navy">
          {t(`items.${visual.key}.title`)}
        </span>
        <span
          className={
            "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-indigo/10 text-indigo transition-[rotate] duration-[350ms] ease-in-out " +
            (open ? "rotate-180" : "rotate-0")
          }
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="relative">
          <div className="pt-[18px] text-[14.5px] leading-[1.5] font-semibold text-navy-soft">
            {t(`items.${visual.key}.subtitle`)}
          </div>
          <ul className="mt-3.5 flex list-none flex-col gap-2.5 p-0">
            {points.map((p) => (
              <li key={p} className="flex gap-2.5 text-[15.5px] leading-[1.6] text-navy-soft">
                <span className="mt-2 h-[7px] w-[7px] shrink-0 rounded-full bg-navy" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ServicesSection() {
  const t = useTranslations("HomeServices");
  const common = useTranslations("Common");

  return (
    <section
      id="services"
      className="relative scroll-mt-24 px-[18px] py-14 sm:px-6 sm:pt-24 sm:pb-[104px] lg:px-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(250,244,234,0) 0%, #FAF4EA 12%, #FAF4EA 88%, rgba(250,244,234,0) 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute top-[130px] right-[14%] h-[26px] w-4 rounded-tl-[60%] rounded-br-[60%] rounded-tr-[10%] rounded-bl-[10%] opacity-[.42]"
        style={{
          background: "linear-gradient(140deg, #F2662F, #C9307C)",
          animation: "vlFloatSlow 13s ease-in-out infinite",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[90px] -right-[70px] h-[300px] w-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(242,102,47,.14), rgba(255,255,255,0) 70%)",
          animation: "vlPulse 13s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto max-w-[1240px]">
        <div className="mb-[52px] max-w-[680px]">
          <div className="mb-4 text-sm font-bold tracking-[1.6px] text-violet uppercase">{t("eyebrow")}</div>
          <h2 className="mb-[18px] font-heading text-[28px] leading-[1.14] font-extrabold tracking-[-.4px] text-navy sm:text-[42px] sm:tracking-[-.8px]">
            {t("h2")}
          </h2>
          <p className="text-lg leading-[1.65] text-navy-soft">{t("p")}</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {SERVICES.map((visual) => (
            <ServiceCard key={visual.key} visual={visual} />
          ))}
        </div>

        <div className="mt-11 flex flex-wrap items-center gap-[18px]">
          <Link
            href="#cta"
            className="w-full rounded-field bg-indigo px-[30px] py-4 text-center font-heading text-base font-bold text-white shadow-button transition-[translate,box-shadow,background-color] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
          >
            {common("bookConsultation")}
          </Link>
          <span className="text-[15.5px] text-navy-soft">{t("ctaNote")}</span>
        </div>
      </div>
    </section>
  );
}
