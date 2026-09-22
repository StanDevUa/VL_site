import type { AppLocale } from "@/i18n/routing";

const INTL_LOCALE: Record<AppLocale, string> = {
  uk: "uk-UA",
  en: "en-US",
  ru: "ru-RU",
};

/** Формат для <input type="datetime-local"> — обов'язково в локальному часі, не UTC. */
export function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

export function formatDate(
  date: Date,
  locale: AppLocale,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" },
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], options).format(date);
}

export function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now();
}

/** "Зараз + 1 година" у форматі для <input type="datetime-local"> — розумний початковий варіант при перемиканні на "Запланувати". */
export function defaultScheduleDateTime(): string {
  return toDatetimeLocalValue(new Date(Date.now() + 60 * 60 * 1000));
}
