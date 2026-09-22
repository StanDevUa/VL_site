import type { AppLocale } from "@/i18n/routing";
import type { NewsCategory } from "@prisma/client";

/**
 * Обирає локалізоване поле сутності за конвенцією {field}Uk/{field}En/{field}Ru
 * (усі контентні моделі — Product, PortfolioWork, NewsPost, Testimonial тощо).
 * Якщо переклад для locale не заповнений — фолбек на українську (за ТЗ,
 * розділ «Мультимовність»: не показуємо порожнє поле).
 */
export function pickLocalized<T extends Record<string, unknown>>(
  entity: T,
  field: string,
  locale: AppLocale,
): string {
  const suffix = locale.charAt(0).toUpperCase() + locale.slice(1);
  const localizedKey = `${field}${suffix}`;
  const fallbackKey = `${field}Uk`;

  const value = entity[localizedKey];
  if (typeof value === "string" && value.trim() !== "") {
    return value;
  }

  return (entity[fallbackKey] as string) ?? "";
}

/** Ключ next-intl (namespace "News") для фіксованого (неперекладного в БД) значення категорії. */
export function newsCategoryKey(category: NewsCategory): string {
  switch (category) {
    case "ANNOUNCEMENT":
      return "categoryAnnouncement";
    case "FOR_PSYCHOLOGISTS":
      return "categoryForPsychologists";
    case "NEWS":
    default:
      return "categoryNews";
  }
}
