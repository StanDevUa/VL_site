/**
 * Єдиний стиль кнопок — звірено з РЕАЛЬНИМИ затвердженими макетами сторінок
 * (design/*.html: Product, Cart, Checkout, Legal, News, Works, Home), а не
 * лише зі зведеної сторінки дизайн-системи, яка в деталях hover-кольору
 * контурних кнопок розходиться з тим, що фактично на сторінках. На всіх
 * сторінках без винятку контурна (secondary) кнопка при hover стає
 * magenta, не indigo — це і є фактичний стандарт.
 *
 * В адмінці навмисно без transform/translate-ефектів при hover — це робочий
 * інструмент, а не маркетингова сторінка.
 */

export const primaryButtonClass =
  "rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover focus:outline-none focus:ring-4 focus:ring-indigo/25 disabled:opacity-60";

export const secondaryButtonClass =
  "rounded-button border border-navy/18 px-8 py-3 font-heading font-bold text-navy transition-colors hover:border-magenta hover:text-magenta focus:outline-none focus:ring-4 focus:ring-magenta/20 disabled:border-navy/10 disabled:text-navy/35";
