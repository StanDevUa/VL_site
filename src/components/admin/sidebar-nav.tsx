"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_TOP = [{ href: "/admin", label: "Головна" }];

const SHOP_CHILDREN = [
  { href: "/admin/kategorii", label: "Категорії" },
  { href: "/admin/tovary", label: "Товари" },
  // наступний — "Замовлення", з'явиться, коли буде готовий.
];

const NAV_REST = [
  { href: "/admin/roboty", label: "Мої роботи" },
  { href: "/admin/novyny", label: "Новини та анонси" },
  { href: "/admin/vidguky", label: "Відгуки" },
  { href: "/admin/dyplomy", label: "Дипломи" },
  { href: "/admin/faq", label: "FAQ" },
];

function linkClass(isActive: boolean, bold = true) {
  return (
    "block rounded-field px-4 py-3 text-sm hover:bg-powder-pink " +
    (bold ? "font-bold " : "") +
    (isActive ? "text-magenta" : "text-navy")
  );
}

export function AdminSidebarNav() {
  const pathname = usePathname();
  const isShopActive = SHOP_CHILDREN.some((c) => pathname.startsWith(c.href));
  const [shopOpen, setShopOpen] = useState(isShopActive);

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {NAV_TOP.map((item) => (
        <Link key={item.href} href={item.href} className={linkClass(pathname === item.href)}>
          {item.label}
        </Link>
      ))}

      <button
        type="button"
        onClick={() => setShopOpen((v) => !v)}
        className={
          "w-full flex items-center justify-between rounded-field px-4 py-3 text-sm font-bold hover:bg-powder-pink " +
          (isShopActive ? "text-magenta" : "text-navy")
        }
      >
        Магазин
        <span className={"transition-transform " + (shopOpen ? "rotate-180" : "")}>▾</span>
      </button>
      {shopOpen && (
        <div className="pl-4 space-y-1">
          {SHOP_CHILDREN.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(pathname.startsWith(item.href), false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      {NAV_REST.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={linkClass(pathname.startsWith(item.href))}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
