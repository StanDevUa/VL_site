export type NavItem = { key: string; hash?: string; exact?: string; accent?: boolean };

/**
 * 6 якорів навігації (architecture.md, розд. 4): усі ведуть скролом до секцій
 * на "/", окрім Магазин/Новини, які завжди ведуть на власні маршрути.
 */
export const NAV_ITEMS: NavItem[] = [
  { key: "about", hash: "about" },
  { key: "services", hash: "services" },
  { key: "method", hash: "method", accent: true },
  { key: "shop", exact: "/shop" },
  { key: "news", exact: "/novyny" },
  { key: "faq", hash: "faq" },
];

export function navHref(pathname: string, item: NavItem): string {
  if (item.exact) return item.exact;
  return pathname === "/" ? `#${item.hash}` : `/#${item.hash}`;
}
