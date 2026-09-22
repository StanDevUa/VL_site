"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Головна" },
  { href: "/admin/roboty", label: "Мої роботи" },
  { href: "/admin/novyny", label: "Новини та анонси" },
  { href: "/admin/vidguky", label: "Відгуки" },
  { href: "/admin/dyplomy", label: "Дипломи" },
  { href: "/admin/faq", label: "FAQ" },
  // наступний розділ — "Магазин" (Категорії/Товари/Замовлення), з'явиться
  // як розкривний пункт одразу під "Головна", коли почнемо його будувати.
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {NAV.map((item) => {
        const isActive =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "block rounded-field px-4 py-3 text-sm font-bold hover:bg-powder-pink " +
              (isActive ? "bg-powder-pink text-magenta" : "text-navy")
            }
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
