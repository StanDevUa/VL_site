"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = { ref: string; name: string };

const fieldClass =
  "w-full rounded-field border border-indigo/30 bg-white px-4 py-3 text-navy outline-none transition-colors focus:border-indigo focus:ring-4 focus:ring-indigo/15 disabled:cursor-not-allowed disabled:bg-navy/5 disabled:text-navy-soft";
const dropdownClass =
  "absolute top-[calc(100%+6px)] left-0 right-0 z-20 max-h-60 overflow-y-auto rounded-field border border-indigo/50 bg-white shadow-card-hover";
const optionClass =
  "block w-full px-3 py-2 text-left text-sm text-navy transition-colors hover:bg-indigo/5";
const labelClass = "block text-sm font-bold text-navy mb-2";

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
    <div className="space-y-4">
      <div ref={cityBoxRef} className="relative">
        <label className={labelClass}>{cityLabel}</label>
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
        <label className={labelClass}>{warehouseLabel}</label>
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
