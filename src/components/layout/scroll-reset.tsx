"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";

const SCROLL_PRESERVE_KEY = "vl_preserve_scroll_y";

/**
 * Перемикання мови міняє параметр [locale] у layout.tsx, тому Next.js повністю
 * перемонтовує весь layout (включно з цим компонентом) — ефект нижче запускається
 * як на справжньому переході. Викликати цю функцію ПЕРЕД router.replace(...,
 * { locale }), щоб зафіксувати поточний скрол — тоді компонент після
 * перемонтування відновить саме його, а не скине сторінку нагору.
 */
export function preserveScrollForLocaleSwitch() {
  try {
    sessionStorage.setItem(SCROLL_PRESERVE_KEY, String(window.scrollY));
  } catch {
    // sessionStorage недоступний (приватний режим тощо) — просто скролимо нагору, як завжди.
  }
}

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

    // Не видаляємо ключ одразу тут (лише читаємо) — React StrictMode у dev-режимі
    // подвійно викликає цей ефект (mount→cleanup→mount), і дострокове видалення
    // "з'їло" б значення до того, як спрацює той виклик, що насправді лишається.
    let preservedY = 0;
    try {
      const raw = sessionStorage.getItem(SCROLL_PRESERVE_KEY);
      if (raw !== null) preservedY = Number(raw) || 0;
    } catch {
      // ignore
    }

    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, preservedY);

    // Поки контент нової сторінки ще стрімиться/гідрується, Next.js може ще раз
    // сам смикнути скрол нагору (вже після цього ефекту) — тримаємо smooth вимкненим
    // трохи довше й перестраховуємось повторним scrollTo, а не скидаємо behavior одразу.
    // ВАЖЛИВО: повертаємо саме "" (а не запам'ятоване "попереднє" значення) — інакше
    // React StrictMode у dev-режимі подвійно викликає ефект (mount→cleanup→mount), і
    // друге спрацювання запам'ятовує вже зіпсоване "auto" з першого як "попереднє",
    // назавжди залишаючи інлайновий scrollBehavior застряглим на "auto".
    const id = window.setTimeout(() => {
      window.scrollTo(0, preservedY);
      html.style.scrollBehavior = "";
      try {
        sessionStorage.removeItem(SCROLL_PRESERVE_KEY);
      } catch {
        // ignore
      }
    }, 400);

    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
