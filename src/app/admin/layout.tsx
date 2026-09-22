import type { Metadata } from "next";
import { Nunito, Mulish } from "next/font/google";
import "../globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  weight: ["600", "700", "800"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Адмін-панель — Вікторія Лемешко",
};

// Інтерфейс адмінки завжди українською, без next-intl (див. architecture.md, розділ 5).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={`${nunito.variable} ${mulish.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
