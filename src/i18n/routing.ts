import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uk", "en", "ru"],
  defaultLocale: "uk",
  // uk без префіксу (наприклад /shop), en/ru з префіксом (/en/shop, /ru/shop)
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
