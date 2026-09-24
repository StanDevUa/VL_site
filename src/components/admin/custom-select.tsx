"use client";

import { useEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

/**
 * Заміна нативного <select> — у браузерів немає способу стилізувати рамку
 * розкритого попап-списку нативного select (це малює сама ОС, не сторінка).
 * Точна специфікація кнопки/списку — з design/VL - Checkout (client).html.
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
        className="flex w-full items-center justify-between gap-2 rounded-field border-[1.5px] border-magenta/45 bg-white px-4 py-3 text-left text-navy transition-shadow hover:shadow-[0_0_0_4px_rgba(201,48,124,0.1)] focus:outline-none focus:shadow-[0_0_0_4px_rgba(201,48,124,0.15)]"
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
          className={"shrink-0 text-magenta transition-transform " + (open ? "rotate-180" : "")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-20 max-h-60 overflow-y-auto rounded-field border-[1.5px] border-magenta/45 bg-white shadow-[0_20px_40px_-20px_rgba(30,42,90,0.4)]">
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
                "block w-full px-4 py-3 text-left text-[15.5px] transition-colors " +
                (option.value === value
                  ? "bg-magenta/10 font-bold text-magenta"
                  : "text-navy hover:bg-magenta/[0.07]")
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
