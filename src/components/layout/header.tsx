"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { NAV_ITEMS, navHref } from "@/lib/nav-items";
import type { AppLocale } from "@/i18n/routing";

const LOCALES: { code: AppLocale; label: string }[] = [
  { code: "uk", label: "Українська" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

function UkFlag() {
  return (
    <svg width="24" height="17" viewBox="0 0 28 20" className="block">
      <rect width="28" height="10" fill="#0057B7" />
      <rect y="10" width="28" height="10" fill="#FFD700" />
    </svg>
  );
}

function EnFlag() {
  return (
    <svg width="24" height="17" viewBox="0 0 60 40" className="block">
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0l60 40M60 0L0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  );
}

function RuFlag() {
  return (
    <svg width="24" height="17" viewBox="0 0 30 21" className="block">
      <rect width="30" height="7" fill="#fff" />
      <rect y="7" width="30" height="7" fill="#0039A6" />
      <rect y="14" width="30" height="7" fill="#D52B1E" />
    </svg>
  );
}

const FLAGS: Record<AppLocale, () => React.ReactNode> = {
  uk: UkFlag,
  en: EnFlag,
  ru: RuFlag,
};

function CartIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h13l-1.4 8.4a2 2 0 0 1-2 1.6H9.3a2 2 0 0 1-2-1.7L6 7 5.4 4H3" />
      <circle cx="10" cy="20" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 4.3 2.9 11.4c-.6.2-.6 1.1.1 1.3l4.3 1.3 1.6 4.8c.2.6 1 .7 1.4.2l2.2-2.5 4.3 3.1c.5.4 1.2.1 1.3-.5l3.3-13.9c.2-.6-.4-1.1-1-.9zM9.6 14.3l8-5.6-6.1 6.4-.2 3z" />
    </svg>
  );
}

export function Header() {
  const t = useTranslations("Nav");
  const common = useTranslations("Common");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function switchLocale(code: AppLocale) {
    router.replace(pathname, { locale: code });
  }

  return (
    <header className="sticky top-0 z-[60] border-b border-navy/10 bg-white/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-6 px-8 py-2">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Viktoriia Lemeshko" width={160} height={62} className="h-[56px] w-auto" priority />
        </Link>

        <div className="min-w-0">
          <nav className="hidden items-center justify-center gap-6 text-[15px] font-semibold lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={navHref(pathname, item)}
                className={
                  item.accent
                    ? "font-bold text-magenta transition-colors hover:text-coral"
                    : "text-navy transition-colors hover:text-magenta"
                }
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <Link
            href="/#cta"
            className="flex w-full items-center justify-center whitespace-nowrap rounded-field bg-indigo px-5 py-3 font-heading text-[15px] font-bold text-white shadow-button transition-colors hover:bg-indigo-hover lg:hidden"
          >
            {common("bookConsultation")}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            title={common("cart")}
            className="relative flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-field border-[1.5px] border-navy/15 text-navy transition-colors hover:border-indigo hover:text-indigo"
          >
            <CartIcon />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-[19px] min-w-[19px] items-center justify-center rounded-full bg-magenta px-1 font-heading text-[11px] font-extrabold text-white">
                {totalCount}
              </span>
            )}
          </Link>

          <div className="mr-0.5 hidden items-center gap-1.5 border-r border-navy/10 pr-1.5 md:flex">
            {LOCALES.map((l) => {
              const Flag = FLAGS[l.code];
              return (
                <button
                  key={l.code}
                  type="button"
                  title={l.label}
                  onClick={() => switchLocale(l.code)}
                  className={
                    "h-[18px] w-[26px] overflow-hidden rounded border border-navy/10 transition-opacity " +
                    (locale === l.code ? "opacity-100" : "opacity-45 hover:opacity-100")
                  }
                >
                  <Flag />
                </button>
              );
            })}
          </div>

          <a
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            title="Telegram"
            className="hidden h-[42px] w-[42px] shrink-0 items-center justify-center rounded-field text-white transition-transform hover:-translate-y-0.5 sm:flex"
            style={{ background: "linear-gradient(135deg, #7A3AA0, #2B6BB8)" }}
          >
            <TelegramIcon />
          </a>

          <Link
            href="/#cta"
            className="hidden whitespace-nowrap rounded-field bg-indigo px-5 py-3 font-heading text-[15px] font-bold text-white shadow-button transition-colors hover:bg-indigo-hover lg:inline-flex"
          >
            {common("bookConsultation")}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className="flex h-11 w-11 items-center justify-center rounded-field border-[1.5px] border-navy/15 lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E2A5A" strokeWidth="2" strokeLinecap="round">
              <path d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-navy/10 bg-white px-6 py-5 lg:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={navHref(pathname, item)}
              onClick={() => setMenuOpen(false)}
              className={
                "border-b border-navy/10 py-3 font-semibold " +
                (item.accent ? "font-bold text-magenta" : "text-navy")
              }
            >
              {t(item.key)}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-4">
            {LOCALES.map((l) => {
              const Flag = FLAGS[l.code];
              return (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => switchLocale(l.code)}
                  className={
                    "h-[21px] w-[30px] overflow-hidden rounded border border-navy/10 " +
                    (locale === l.code ? "" : "opacity-50")
                  }
                >
                  <Flag />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
