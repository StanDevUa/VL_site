"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = { ref: string; name: string };

const fieldClass =
  "w-full rounded-field border-[1.5px] border-magenta/45 bg-white px-4 py-3.5 text-base text-navy outline-none transition-shadow duration-200 ease-in-out focus:shadow-[0_0_0_4px_rgba(201,48,124,.12)] disabled:cursor-not-allowed disabled:border-navy/16 disabled:bg-navy/5 disabled:text-navy-soft";
const dropdownClass =
  "absolute top-[calc(100%+6px)] left-0 right-0 z-20 max-h-60 overflow-y-auto rounded-field border-[1.5px] border-magenta/45 bg-white shadow-[0_20px_40px_-20px_rgba(30,42,90,.4)] [scrollbar-width:none]";
const optionClass =
  "block w-full px-4 py-3 text-left text-[15.5px] text-navy transition-colors duration-200 ease-in-out hover:bg-magenta/7";
const labelClass = "mb-2 block text-sm font-bold text-navy";

/** Живий пошук міста + залежний пошук відділення через проксі /api/nova-poshta/*. */
export function NovaPoshtaFields({
  cityLabel,
  warehouseLabel,
  cityPlaceholder,
  warehousePlaceholder,
  warehouseDisabledHint,
  defaultCityName = "",
  defaultCityRef = "",
  defaultWarehouseName = "",
  defaultWarehouseRef = "",
  onCityInput,
  onWarehouseInput,
}: {
  cityLabel: string;
  warehouseLabel: string;
  cityPlaceholder: string;
  warehousePlaceholder: string;
  warehouseDisabledHint: string;
  defaultCityName?: string;
  defaultCityRef?: string;
  defaultWarehouseName?: string;
  defaultWarehouseRef?: string;
  onCityInput?: (value: string) => void;
  onWarehouseInput?: (value: string) => void;
}) {
  const [cityQuery, setCityQuery] = useState(defaultCityName);
  const [cityRef, setCityRef] = useState(defaultCityRef);
  const [cityOpen, setCityOpen] = useState(false);
  const [cityResults, setCityResults] = useState<Suggestion[]>([]);
  const cityBoxRef = useRef<HTMLDivElement>(null);

  const [warehouseQuery, setWarehouseQuery] = useState(defaultWarehouseName);
  const [warehouseRef, setWarehouseRef] = useState(defaultWarehouseRef);
  const [warehouseOpen, setWarehouseOpen] = useState(false);
  const [warehouseResults, setWarehouseResults] = useState<Suggestion[]>([]);
  const warehouseBoxRef = useRef<HTMLDivElement>(null);

  const cityQueryTooShort = cityRef !== "" || cityQuery.trim().length < 2;

  useEffect(() => {
    if (cityQueryTooShort) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(`/api/nova-poshta/cities?q=${encodeURIComponent(cityQuery)}`)
        .then((r) => r.json())
        .then((data: Suggestion[]) => {
          if (!cancelled) setCityResults(data);
        })
        .catch(() => {
          if (!cancelled) setCityResults([]);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cityQuery, cityQueryTooShort]);

  const warehouseSearchDisabled = !cityRef || warehouseRef !== "";

  useEffect(() => {
    if (warehouseSearchDisabled) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      fetch(
        `/api/nova-poshta/warehouses?cityRef=${encodeURIComponent(cityRef)}&q=${encodeURIComponent(warehouseQuery)}`,
      )
        .then((r) => r.json())
        .then((data: Suggestion[]) => {
          if (!cancelled) setWarehouseResults(data);
        })
        .catch(() => {
          if (!cancelled) setWarehouseResults([]);
        });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cityRef, warehouseQuery, warehouseSearchDisabled]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityBoxRef.current && !cityBoxRef.current.contains(e.target as Node)) {
        setCityOpen(false);
      }
      if (warehouseBoxRef.current && !warehouseBoxRef.current.contains(e.target as Node)) {
        setWarehouseOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div ref={cityBoxRef} className="relative">
        <label className={labelClass}>
          {cityLabel} <span className="text-[#C0322C]">*</span>
        </label>
        <input type="hidden" name="novaPoshtaCityRef" value={cityRef} />
        <input
          type="text"
          name="novaPoshtaCityName"
          value={cityQuery}
          placeholder={cityPlaceholder}
          autoComplete="off"
          onChange={(e) => {
            setCityQuery(e.target.value);
            setCityRef("");
            setCityOpen(true);
            setWarehouseQuery("");
            setWarehouseRef("");
            onCityInput?.(e.target.value);
          }}
          onFocus={() => setCityOpen(true)}
          className={fieldClass}
        />
        {cityOpen && !cityQueryTooShort && cityResults.length > 0 && (
          <div className={dropdownClass}>
            {cityResults.map((c) => (
              <button
                key={c.ref}
                type="button"
                onClick={() => {
                  setCityQuery(c.name);
                  setCityRef(c.ref);
                  setCityOpen(false);
                  onCityInput?.(c.name);
                }}
                className={optionClass}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={warehouseBoxRef} className="relative">
        <label className={labelClass}>
          {warehouseLabel} <span className="text-[#C0322C]">*</span>
        </label>
        <input type="hidden" name="novaPoshtaWarehouseRef" value={warehouseRef} />
        <input
          type="text"
          name="novaPoshtaWarehouseName"
          value={warehouseQuery}
          placeholder={cityRef ? warehousePlaceholder : warehouseDisabledHint}
          disabled={!cityRef}
          autoComplete="off"
          onChange={(e) => {
            setWarehouseQuery(e.target.value);
            setWarehouseRef("");
            setWarehouseOpen(true);
            onWarehouseInput?.(e.target.value);
          }}
          onFocus={() => setWarehouseOpen(true)}
          className={fieldClass}
        />
        {warehouseOpen && !warehouseSearchDisabled && warehouseResults.length > 0 && (
          <div className={dropdownClass}>
            {warehouseResults.map((w) => (
              <button
                key={w.ref}
                type="button"
                onClick={() => {
                  setWarehouseQuery(w.name);
                  setWarehouseRef(w.ref);
                  setWarehouseOpen(false);
                  onWarehouseInput?.(w.name);
                }}
                className={optionClass}
              >
                {w.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
