"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  getQuantity: (productId: string) => number;
  addItem: (productId: string, qty?: number) => void;
  setQuantity: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "vl-cart";

/**
 * Кошик на цьому етапі — тільки localStorage (без БД): окремого логіну
 * покупця до оформлення замовлення ще не існує (акаунт створюється лише
 * під час чекауту), тож "прив'язка до сесії" з architecture.md поки
 * не застосовна. Раннє рішення, узгоджене з користувачем.
 *
 * useSyncExternalStore (а не useState+useEffect) — щоб читання localStorage
 * не викликало розсинхронізацію SSR/гідратації: getServerSnapshot повертає
 * порожній кошик на сервері, а після гідратації React сам підхоплює
 * реальні дані з cachedItems.
 */
let cachedItems: CartItem[] = [];
let listeners: Array<() => void> = [];

function readFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

if (typeof window !== "undefined") {
  cachedItems = readFromStorage();
}

function emitChange() {
  for (const listener of listeners) listener();
}

function writeItems(next: CartItem[]) {
  cachedItems = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // приватний режим / заблоковане сховище — кошик просто не переживе перезавантаження
  }
  emitChange();
}

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return [];
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const getQuantity = useCallback(
    (productId: string) => items.find((i) => i.productId === productId)?.quantity ?? 0,
    [items],
  );

  const addItem = useCallback(
    (productId: string, qty = 1) => {
      const existing = items.find((i) => i.productId === productId);
      const next = existing
        ? items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + qty } : i,
          )
        : [...items, { productId, quantity: qty }];
      writeItems(next);
    },
    [items],
  );

  const setQuantity = useCallback(
    (productId: string, qty: number) => {
      if (qty <= 0) {
        writeItems(items.filter((i) => i.productId !== productId));
        return;
      }
      const existing = items.find((i) => i.productId === productId);
      const next = existing
        ? items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
        : [...items, { productId, quantity: qty }];
      writeItems(next);
    },
    [items],
  );

  const removeItem = useCallback(
    (productId: string) => {
      writeItems(items.filter((i) => i.productId !== productId));
    },
    [items],
  );

  const clear = useCallback(() => writeItems([]), []);

  const totalCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, totalCount, getQuantity, addItem, setQuantity, removeItem, clear }),
    [items, totalCount, getQuantity, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
