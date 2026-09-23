import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/product-card";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";

const PAGE_SIZE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Shop");

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, nameUk: true, nameEn: true, nameRu: true },
  });
  const activeCategory = categories.some((c) => c.id === category) ? category : undefined;

  const where = activeCategory ? { categoryId: activeCategory } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { nameUk: true, nameEn: true, nameRu: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) =>
    activeCategory ? `/shop?category=${activeCategory}&page=${p}` : `/shop?page=${p}`;

  return (
    <main className="max-w-6xl mx-auto px-8 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <h1 className="font-heading font-extrabold text-3xl text-navy">{t("pageTitle")}</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={
              "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
              (!activeCategory
                ? "bg-indigo text-white"
                : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
            }
          >
            {t("categoryAll")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.id}`}
              className={
                "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
                (activeCategory === c.id
                  ? "bg-indigo text-white"
                  : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
              }
            >
              {pickLocalized(c, "name", locale)}
            </Link>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-navy-soft">
          {activeCategory ? t("emptyInCategory") : t("empty")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                locale={locale}
                product={{ ...item, price: item.price.toString() }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={
                    "w-10 h-10 flex items-center justify-center rounded-field font-bold text-sm " +
                    (p === currentPage
                      ? "bg-indigo text-white"
                      : "bg-white border border-navy/15 text-navy hover:border-magenta hover:text-magenta")
                  }
                >
                  {p}
                </Link>
              ))}
            </nav>
          )}
        </>
      )}
    </main>
  );
}
