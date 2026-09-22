/**
 * Єдиний стиль кнопок за дизайн-системою (design/VL Design System (reference).html,
 * розділ «Кнопки та посилання»). Використовувати ці константи всюди — не вигадувати
 * стиль кнопки наново в кожній формі.
 */

export const primaryButtonClass =
  "rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-all hover:bg-indigo-hover hover:-translate-y-[3px] focus:outline-none focus:ring-4 focus:ring-indigo/25 disabled:opacity-60 disabled:hover:translate-y-0";

export const secondaryButtonClass =
  "rounded-button border-[1.5px] border-navy/18 px-6 py-3.5 font-heading font-bold text-navy transition-all hover:border-indigo hover:text-indigo hover:-translate-y-[3px] focus:outline-none focus:ring-4 focus:ring-indigo/20 disabled:border-navy/10 disabled:text-navy/35 disabled:hover:translate-y-0";
