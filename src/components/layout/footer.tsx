"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS, navHref } from "@/lib/nav-items";

const FOOTER_NAV = NAV_ITEMS.slice(0, 4); // Про мене / Мої послуги / Авторська методика / Магазин

const LEGAL_LINKS: { slug: string; labelKey: string }[] = [
  { slug: "pryvatnist", labelKey: "privacyPolicy" },
  { slug: "umovy-vykorystannia", labelKey: "termsOfUse" },
  { slug: "dostavka", labelKey: "paymentDelivery" },
  { slug: "povernennia", labelKey: "returnPolicy" },
];

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.4c0-.9.3-1.4 1.4-1.4h1.8V4.2C16.2 4.1 15.2 4 14 4c-2.4 0-4 1.5-4 4.1V10H7.5v3H10v8z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 4.3 2.9 11.4c-.6.2-.6 1.1.1 1.3l4.3 1.3 1.6 4.8c.2.6 1 .7 1.4.2l2.2-2.5 4.3 3.1c.5.4 1.2.1 1.3-.5l3.3-13.9c.2-.6-.4-1.1-1-.9zM9.6 14.3l8-5.6-6.1 6.4-.2 3z" />
    </svg>
  );
}

const SOCIALS = [
  {
    title: "Facebook",
    href: "https://facebook.com/",
    gradient: "linear-gradient(135deg, #2B6BB8, #7A3AA0)",
    hoverShadowClass: "hover:shadow-[0_12px_22px_-10px_rgba(43,107,184,.6)]",
    Icon: FacebookIcon,
  },
  {
    title: "Instagram",
    href: "https://instagram.com/",
    gradient: "linear-gradient(135deg, #F2662F, #C9307C)",
    hoverShadowClass: "hover:shadow-[0_12px_22px_-10px_rgba(201,48,124,.32)]",
    Icon: InstagramIcon,
  },
  {
    title: "Telegram",
    href: "https://t.me/",
    gradient: "linear-gradient(135deg, #7A3AA0, #2B6BB8)",
    hoverShadowClass: "hover:shadow-[0_12px_22px_-10px_rgba(122,58,160,.6)]",
    Icon: TelegramIcon,
  },
];

export function Footer() {
  const t = useTranslations("Nav");
  const footerT = useTranslations("Footer");
  const pathname = usePathname();

  return (
    <>
      <footer
        className="relative px-[18px] pt-12 pb-7 text-navy sm:px-8 sm:pt-[72px] sm:pb-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,232,226,0) 0%, #F7E7E1 10%, #F1DCD4 100%), #FFFDFC",
        }}
      >
        {pathname === "/" && (
          <div
            aria-hidden
            className="pointer-events-none absolute -top-[190px] h-[360px] w-[360px] rounded-full bg-magenta/[.04]"
            style={{ left: "calc(50% - 446px)" }}
          />
        )}
        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 gap-[22px] border-b border-navy/14 pb-11 sm:grid-cols-2 sm:gap-9 lg:grid-cols-[1.25fr_.8fr_1.6fr] lg:items-start lg:gap-12">
            <div className="max-w-[340px] max-sm:col-span-full max-sm:max-w-none">
              <Image
                src="/logo.png"
                alt="Viktoriia Lemeshko"
                width={298}
                height={312}
                className="mx-auto mb-[22px] h-24 w-auto"
              />
              <p className="text-center text-[15px] leading-[1.7] text-navy-soft">
                {footerT("tagline")}
              </p>
            </div>

            <nav className="flex flex-col gap-[13px] pt-2 text-[15px]">
              {FOOTER_NAV.map((item) => (
                <Link
                  key={item.key}
                  href={navHref(pathname, item)}
                  className={
                    item.accent
                      ? "font-bold text-magenta hover:text-coral"
                      : "text-navy-soft hover:text-magenta"
                  }
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <div className="col-span-full grid grid-cols-1 gap-9 sm:grid-cols-[.9fr_.7fr] lg:col-span-1 lg:items-stretch lg:gap-12">
              <nav className="flex flex-col gap-[13px] pt-2 text-[15px]">
                {LEGAL_LINKS.map((link) => (
                  <Link
                    key={link.slug}
                    href={`/legal/${link.slug}`}
                    className="text-navy-soft hover:text-magenta"
                  >
                    {footerT(link.labelKey)}
                  </Link>
                ))}
              </nav>

              <div className="flex flex-row items-center justify-between pt-2 max-sm:col-span-full sm:flex-col sm:items-end sm:justify-between">
                <div className="flex justify-end gap-2.5 sm:w-40">
                  {SOCIALS.map(({ title, href, gradient, hoverShadowClass, Icon }) => (
                    <a
                      key={title}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      title={title}
                      className={
                        "flex h-[46px] w-[46px] items-center justify-center rounded-[12px] text-white transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[3px] " +
                        hoverShadowClass
                      }
                      style={{ background: gradient }}
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
                <div className="sm:flex sm:w-40 sm:justify-center">
                  <Image src="/wayforpay.png" alt="WayForPay" width={753} height={331} className="h-12 w-auto" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-[10px] pt-6 text-[13.5px] text-navy-soft sm:flex-row sm:gap-6">
            <span>{footerT("copyright")}</span>
            <span>{footerT("trademark")}</span>
          </div>
        </div>
      </footer>

      <ScrollTopButton />
    </>
  );
}

function ScrollTopButton() {
  const t = useTranslations("Footer");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Точні значення з макета (onScroll у скрипті прототипу): y > 600, буфер до низу 80px.
      const y = window.scrollY;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      setVisible(y > 600 && !atBottom);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      title={t("scrollTop")}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{
        filter: "drop-shadow(0 0 9px rgba(30,42,90,.22))",
        transition: "opacity .35s ease, rotate 1s cubic-bezier(.3,.7,.2,1)",
      }}
      className={
        "fixed right-7 bottom-7 z-[70] h-[68px] w-[68px] max-sm:right-4 max-sm:bottom-4 max-sm:h-[52px] max-sm:w-[52px] rounded-full border-0 bg-transparent p-0 rotate-0 hover:rotate-[360deg] " +
        (visible ? "opacity-100" : "pointer-events-none opacity-0")
      }
    >
      <Image
        src="/scroll-top-icon.png"
        alt={t("scrollTop")}
        width={68}
        height={68}
        className="block h-full w-full rounded-full"
      />
    </button>
  );
}
