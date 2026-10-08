"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function FacebookIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.4c0-.9.3-1.4 1.4-1.4h1.8V4.2C16.2 4.1 15.2 4 14 4c-2.4 0-4 1.5-4 4.1V10H7.5v3H10v8z" />
    </svg>
  );
}

function TelegramIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.6 4.3 2.9 11.4c-.6.2-.6 1.1.1 1.3l4.3 1.3 1.6 4.8c.2.6 1 .7 1.4.2l2.2-2.5 4.3 3.1c.5.4 1.2.1 1.3-.5l3.3-13.9c.2-.6-.4-1.1-1-.9zM9.6 14.3l8-5.6-6.1 6.4-.2 3z" />
    </svg>
  );
}

function ShareNodesIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

/**
 * `default` — Works/News detail (44px кола, тригер 22/13px, розгортання інлайн).
 * `compact` — Product detail (42px, тригер 18/11px, розгортання інлайн).
 * `icon` — Header (42px кружечок без підпису, варіанти випадають у попапі під кнопкою,
 * а не інлайн — в хедері немає місця, щоб розсувати сусідні елементи).
 */
export function ShareButton({ size = "default" }: { size?: "default" | "compact" | "icon" }) {
  const t = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (size !== "icon") return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [size]);

  function toggle() {
    setOpen((v) => !v);
    setCopied(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // clipboard unavailable — ignore, matches source behaviour
    }
    setCopied(true);
  }

  function openShareWindow(url: string) {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=520");
  }

  function shareToFacebook() {
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    );
  }

  function shareToTelegram() {
    openShareWindow(
      `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`,
    );
  }

  const circleClass =
    size === "default"
      ? "flex h-11 w-11 items-center justify-center rounded-field text-white transition-transform duration-200 ease-in-out hover:-translate-y-0.5"
      : size === "compact"
        ? "flex h-[42px] w-[42px] items-center justify-center rounded-field text-white transition-transform duration-200 ease-in-out hover:-translate-y-0.5"
        : "flex h-[34px] w-[34px] items-center justify-center rounded-field text-white transition-transform duration-200 ease-in-out hover:-translate-y-0.5";
  const circleIconSize = size === "default" ? 19 : size === "compact" ? 18 : 15;
  const copyIconSize = size === "default" ? 18 : size === "compact" ? 17 : 14;

  const optionsPanel = (
    <div className={size === "icon" ? "flex items-center gap-2" : "flex gap-2.5"}>
      <button
        type="button"
        onClick={shareToFacebook}
        title="Facebook"
        className={circleClass}
        style={{ background: "linear-gradient(135deg, #2B6BB8, #7A3AA0)" }}
      >
        <FacebookIcon size={circleIconSize} />
      </button>
      <button
        type="button"
        onClick={shareToTelegram}
        title="Telegram"
        className={circleClass}
        style={{ background: "linear-gradient(135deg, #7A3AA0, #2B6BB8)" }}
      >
        <TelegramIcon size={circleIconSize} />
      </button>
      <button
        type="button"
        onClick={copyLink}
        title={t("copyLinkTitle")}
        className={
          size === "default"
            ? "flex h-11 w-11 items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-transparent text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
            : size === "compact"
              ? "flex h-[42px] w-[42px] items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-transparent text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
              : "flex h-[34px] w-[34px] items-center justify-center rounded-field border-[1.5px] border-navy/18 bg-transparent text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
        }
      >
        <svg width={copyIconSize} height={copyIconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10 13a5 5 0 007.5.5l2-2A5 5 0 0012.5 4.5l-1 1" />
          <path d="M14 11a5 5 0 00-7.5-.5l-2 2A5 5 0 0011.5 19.5l1-1" />
        </svg>
      </button>
      {copied && <span className="self-center text-sm text-navy-soft whitespace-nowrap">{t("copiedLabel")}</span>}
    </div>
  );

  if (size === "icon") {
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={toggle}
          title={t("share")}
          aria-label={t("share")}
          className={
            "flex h-[42px] w-[42px] items-center justify-center rounded-field border-[1.5px] transition-colors duration-[250ms] ease-in-out " +
            (open
              ? "border-indigo text-indigo"
              : "border-navy/15 text-navy hover:border-indigo hover:text-indigo")
          }
        >
          <ShareNodesIcon size={18} />
        </button>
        {open && (
          <div className="absolute top-[calc(100%+8px)] right-0 z-20 rounded-field border border-navy/10 bg-white p-2.5 shadow-card-hover">
            {optionsPanel}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3.5">
      <button
        type="button"
        onClick={toggle}
        className={
          size === "compact"
            ? "inline-flex items-center gap-[9px] rounded-field border-[1.5px] border-navy/18 bg-transparent px-[18px] py-[11px] font-heading text-[14.5px] font-bold text-navy transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
            : "inline-flex items-center gap-2.5 rounded-field border-[1.5px] border-navy/18 bg-transparent px-[22px] py-[13px] font-heading text-[15px] font-bold text-navy transition-[border-color,color,translate] duration-200 ease-in-out hover:-translate-y-0.5 hover:border-magenta hover:text-magenta"
        }
      >
        <ShareNodesIcon size={size === "compact" ? 16 : 17} />
        {t("share")}
      </button>
      {open && optionsPanel}
    </div>
  );
}
