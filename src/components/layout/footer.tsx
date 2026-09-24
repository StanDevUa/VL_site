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
  { title: "Facebook", href: "https://facebook.com/", gradient: "linear-gradient(135deg, #2B6BB8, #7A3AA0)", Icon: FacebookIcon },
  { title: "Instagram", href: "https://instagram.com/", gradient: "linear-gradient(135deg, #F2662F, #C9307C)", Icon: InstagramIcon },
  { title: "Telegram", href: "https://t.me/", gradient: "linear-gradient(135deg, #7A3AA0, #2B6BB8)", Icon: TelegramIcon },
];

export function Footer() {
  const t = useTranslations("Nav");
  const footerT = useTranslations("Footer");
  const pathname = usePathname();

  return (
    <>
      <footer
        className="relative px-8 pt-[72px] pb-10 text-navy"
        style={{
          background:
            "linear-gradient(180deg, rgba(248,232,226,0) 0%, #F7E7E1 10%, #F1DCD4 100%)",
        }}
      >
        <div className="relative mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 gap-12 border-b border-navy/10 pb-11 sm:grid-cols-2 lg:grid-cols-[1.25fr_.8fr_.9fr_.7fr]">
            <div className="max-w-[340px]">
              <Image
                src="/logo.png"
                alt="Viktoriia Lemeshko"
                width={298}
                height={312}
                className="mx-auto mb-5 h-24 w-auto"
              />
              <p className="text-center text-[15px] leading-relaxed text-navy-soft">
                {footerT("tagline")}
              </p>
            </div>

            <nav className="flex flex-col gap-3 pt-2 text-[15px]">
              {FOOTER_NAV.map((item) => (
                <Link
                  key={item.key}
                  href={navHref(pathname, item)}
                  className={
                    item.accent
                      ? "font-bold text-magenta transition-colors hover:text-coral"
                      : "text-navy-soft transition-colors hover:text-magenta"
                  }
                >
                  {t(item.key)}
                </Link>
              ))}
            </nav>

            <nav className="flex flex-col gap-3 pt-2 text-[15px]">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.slug}
                  href={`/legal/${link.slug}`}
                  className="text-navy-soft transition-colors hover:text-magenta"
                >
                  {footerT(link.labelKey)}
                </Link>
              ))}
            </nav>

            <div className="flex justify-start gap-2.5 pt-2 sm:justify-end">
              {SOCIALS.map(({ title, href, gradient, Icon }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={title}
                  className="flex h-[46px] w-[46px] items-center justify-center rounded-field text-white transition-transform hover:-translate-y-1"
                  style={{ background: gradient }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 pt-6 text-[13.5px] text-navy-soft sm:flex-row">
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
      // "З другого блоку" — на головній ще немає реальних секцій (заглушка),
      // тимчасовий орієнтир: невеликий фіксований відступ у пікселях (а не
      // % висоти екрана — на короткій сторінці-заглушці такої прокрутки може
      // фізично не існувати). Уточнити поріг, коли з'являться реальні блоки.
      const pastFirstBlock = window.scrollY > 150;
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      setVisible(pastFirstBlock && !atBottom);
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
        transition: "opacity .35s ease, transform 1s cubic-bezier(.3,.7,.2,1)",
      }}
      className={
        "fixed right-7 bottom-7 z-[70] h-[68px] w-[68px] rounded-full border-0 bg-transparent p-0 rotate-0 hover:rotate-[360deg] " +
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
