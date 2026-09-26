"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Той самий підхід, що й на публічній частині (`src/components/layout/scroll-reset.tsx`) —
 * скролиться саме `window` (адмінка тепер має ту саму архітектуру: сайдбар
 * `sticky`, скрол — на рівні документа, а не вкладеного div з overflow-y-auto).
 * `globals.css` (спільний із публічною частиною) має `html{scroll-behavior:smooth}`,
 * тож без інлайнового вимкнення скидання нагору "їхало б" плавно замість
 * миттєвого. На відміну від публічної частини, тут нема потреби відновлювати
 * позицію (перемикання мови в адмінці нема) — завжди скидаємо в 0.
 */
export function AdminScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    const id = window.setTimeout(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = "";
    }, 400);

    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
