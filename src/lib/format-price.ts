/** Формат ціни для публічних сторінок магазину — "890 ₴", "1 250 ₴" (як у макеті). */
export function formatPrice(value: number | string): string {
  const amount = Number(value);
  return `${amount.toLocaleString("uk-UA", { maximumFractionDigits: 2 })} ₴`;
}
