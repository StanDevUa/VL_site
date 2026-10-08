import type { Metadata } from "next";
import { Nunito, Mulish } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollResetOnNavigate } from "@/components/layout/scroll-reset";
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

const title = "Вікторія Лемешко — дитячий та сімейний психолог";
const description =
  "Консультації, авторські програми та методика ЕМО-терапії для дітей, підлітків і батьків.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_BASE_URL!),
  title,
  description,
  // Без цього Telegram/Facebook показують превью посилання без картинки —
  // беремо те саме фото, що на головній у hero-секції. JPEG (не webp) і
  // явні width/height/type — краулери деяких месенджерів (Telegram
  // зокрема) ненадійно розпізнають webp і зображення без цих полів.
  openGraph: {
    title,
    description,
    images: [{ url: "/home/hero-og.jpg", width: 1200, height: 1200, type: "image/jpeg" }],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${nunito.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <ScrollResetOnNavigate />
            <Header />
            {children}
            <Footer />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
