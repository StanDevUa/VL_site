import { useTranslations } from "next-intl";

export default function HomePage() {
  const nav = useTranslations("Nav");
  const common = useTranslations("Common");

  return (
    <main className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-xl text-center space-y-4">
        <p className="text-xs font-bold tracking-[1.6px] uppercase text-violet">
          {nav("about")} · {nav("services")} · {nav("method")} ·{" "}
          {nav("shop")} · {nav("news")} · {nav("faq")}
        </p>
        <h1 className="font-heading font-extrabold text-4xl text-navy">
          Вікторія Лемешко
        </h1>
        <p className="text-navy-soft">
          Каркас проєкту готовий: Next.js, Prisma, next-intl, дизайн-токени.
          Наступний крок — верстка секцій головної сторінки за макетом.
        </p>
        <button className="rounded-button bg-indigo px-6 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover">
          {common("bookConsultation")}
        </button>
      </div>
    </main>
  );
}
