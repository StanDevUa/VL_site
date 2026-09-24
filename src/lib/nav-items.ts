export type NavItem = { key: string; hash: string; accent?: boolean };

/**
 * 6 якорів навігації — точна відповідність макету (`href="#about"`, `href="#shop"` тощо
 * у самому `<header>`): усі однаково ведуть скролом до відповідної секції на "/", включно
 * з Магазин/Новини — тепер, коли на Головній є реальні секції «Магазин»/«Новини та анонси»
 * з посиланням на повну сторінку (`/shop`, `/novyny`) вже всередині самої секції.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: "about", hash: "about" },
  { key: "services", hash: "services" },
  { key: "method", hash: "method", accent: true },
  { key: "shop", hash: "shop" },
  { key: "news", hash: "news" },
  { key: "faq", hash: "faq" },
];

export function navHref(pathname: string, item: NavItem): string {
  return pathname === "/" ? `#${item.hash}` : `/#${item.hash}`;
}
