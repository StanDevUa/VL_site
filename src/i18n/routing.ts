import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en", "ru"],
  defaultLocale: "uk",
  // uk без префіксу (наприклад /shop), en/ru з префіксом (/en/shop, /ru/shop)
  localePrefix: "as-needed",
  // За замовчуванням next-intl підбирає мову з Accept-Language браузера
  // відвідувача — сайт відкривався б англійською для будь-кого з англомовним
  // браузером. Це не той сайт, де це доречно: завжди uk, поки відвідувач сам
  // не перемкне мову перемикачем (тоді next-intl запам'ятовує вибір у cookie).
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
