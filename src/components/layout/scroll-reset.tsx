"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Макет має `html { scroll-behavior: smooth }` (буквально з оригіналу — там кожна
 * сторінка є окремим документом, тож цей рядок ніколи не проявлявся як анімація).
 * У SPA-навігації Next.js той самий `<html>` лишається живим між переходами, і його
 * власний скидання скролу нагору успадковує smooth — сторінка "летить" нагору замість
 * миттєвого відкриття. Тут інлайновим style.scrollBehavior примусово вимикаємо smooth
 * лише на момент цього скидання (якщо перехід не на якір), інлайн-стиль завжди
 * переважає над правилом з stylesheet.
 */
export function ScrollResetOnNavigate() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (window.location.hash) return;
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);

    // Поки контент нової сторінки ще стрімиться/гідрується, Next.js може ще раз
    // сам смикнути скрол нагору (вже після цього ефекту) — тримаємо smooth вимкненим
    // трохи довше й перестраховуємось повторним scrollTo, а не скидаємо behavior одразу.
    // ВАЖЛИВО: повертаємо саме "" (а не запам'ятоване "попереднє" значення) — інакше
    // React StrictMode у dev-режимі подвійно викликає ефект (mount→cleanup→mount), і
    // друге спрацювання запам'ятовує вже зіпсоване "auto" з першого як "попереднє",
    // назавжди залишаючи інлайновий scrollBehavior застряглим на "auto".
    const id = window.setTimeout(() => {
      window.scrollTo(0, 0);
      html.style.scrollBehavior = "";
    }, 400);

    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
