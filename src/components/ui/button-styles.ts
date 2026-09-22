/**
 * Єдиний стиль кнопок за дизайн-системою (design/VL Design System (reference).html,
 * розділ «Кнопки та посилання»). Використовувати ці константи всюди — не вигадувати
 * стиль кнопки наново в кожній формі.
 *
 * В адмінці навмисно без transform/translate-ефектів при hover — це робочий
 * інструмент, а не маркетингова сторінка.
 */

export const primaryButtonClass =
  "rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover focus:outline-none focus:ring-4 focus:ring-indigo/25 disabled:opacity-60";

export const secondaryButtonClass =
  "rounded-button border border-navy/18 px-8 py-3 font-heading font-bold text-navy transition-colors hover:border-indigo hover:text-indigo active:bg-indigo active:text-white active:border-indigo focus:outline-none focus:ring-4 focus:ring-indigo/20 disabled:border-navy/10 disabled:text-navy/35";
