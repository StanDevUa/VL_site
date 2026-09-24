"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

/**
 * Заміна нативного <select> — у браузерів немає способу стилізувати рамку
 * розкритого попап-списку нативного select (це малює сама ОС, не сторінка).
 * Структура (кнопка + абсолютно позиційований список) — з design/VL -
 * Checkout (client).html, кольори — наша звичайна схема інпутів (navy/indigo),
 * а не magenta з макета (той був лише прикладом самої ідеї рамки).
 */
export function CustomSelect({
  name,
  options,
  defaultValue = "",
  placeholder = "Оберіть",
  onChange,
  className,
}: {
  name: string;
  options: Option[];
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={containerRef} className={"relative " + (className ?? "")}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={
          "flex w-full items-center justify-between gap-2 rounded-field border bg-white px-4 py-3 text-left text-navy outline-none transition-colors " +
          (open
            ? "border-indigo ring-4 ring-indigo/15"
            : "border-indigo/30 focus:border-indigo focus:ring-4 focus:ring-indigo/15")
        }
      >
        <span className={selected ? "" : "text-navy-soft"}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={"shrink-0 text-navy-soft transition-transform " + (open ? "rotate-180" : "")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-20 max-h-60 overflow-y-auto rounded-field border border-indigo/30 bg-white shadow-card-hover">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setValue(option.value);
                onChange?.(option.value);
                setOpen(false);
              }}
              className={
                "block w-full px-3 py-2 text-left text-sm transition-colors " +
                (option.value === value
                  ? "bg-indigo/10 font-bold text-indigo"
                  : "text-navy hover:bg-indigo/5")
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
