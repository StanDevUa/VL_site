import type { AppLocale } from "@/i18n/routing";

const INTL_LOCALE: Record<AppLocale, string> = {
  uk: "uk-UA",
  en: "en-US",
  ru: "ru-RU",
};

export function formatDate(
  date: Date,
  locale: AppLocale,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" },
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], options).format(date);
}
