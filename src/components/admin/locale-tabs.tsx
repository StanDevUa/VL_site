"use client";

import { useState } from "react";

export type LocaleSuffix = "Uk" | "En" | "Ru";

const TABS: { key: LocaleSuffix; label: string }[] = [
  { key: "Uk", label: "УКР *" },
  { key: "En", label: "ENG" },
  { key: "Ru", label: "РОС" },
];

/**
 * Перемикач мов усередині картки редагування (architecture.md, розділ 5.5).
 * Усі три набори полів завжди присутні в DOM (просто приховані стилем display),
 * щоб форма при сабміті відправляла всі мови одразу, незалежно від активної вкладки.
 */
export function LocaleTabs({
  children,
}: {
  children: (suffix: LocaleSuffix) => React.ReactNode;
}) {
  const [active, setActive] = useState<LocaleSuffix>("Uk");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={
              "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
              (active === tab.key
                ? "bg-indigo text-white"
                : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      {TABS.map((tab) => (
        <div key={tab.key} style={{ display: active === tab.key ? "block" : "none" }}>
          {children(tab.key)}
        </div>
      ))}
    </div>
  );
}
