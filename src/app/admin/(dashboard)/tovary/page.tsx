import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { deleteProduct } from "@/server/actions/products";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/ui/button-styles";
import { formatDate } from "@/lib/format-date";

const PAGE_SIZE = 12;

const CATEGORY_BADGE_GRADIENT =
  "linear-gradient(120deg, #F2662F 0%, #C9307C 42%, #7A3AA0 70%, #2B6BB8 100%)";

export default async function AdminProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page, category } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, nameUk: true },
  });
  const activeCategory = categories.some((c) => c.id === category) ? category : undefined;

  const where = activeCategory ? { categoryId: activeCategory } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: { select: { nameUk: true } } },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const pageHref = (p: number) =>
    activeCategory ? `/admin/tovary?category=${activeCategory}&page=${p}` : `/admin/tovary?page=${p}`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">Товари</h1>
        <Link href="/admin/tovary/new" className={primaryButtonClass}>
          + Додати товар
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/tovary"
            className={
              "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
              (!activeCategory
                ? "bg-indigo text-white"
                : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
            }
          >
            Усі
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/tovary?category=${c.id}`}
              className={
                "rounded-field px-4 py-2 text-sm font-bold transition-colors " +
                (activeCategory === c.id
                  ? "bg-indigo text-white"
                  : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
              }
            >
              {c.nameUk}
            </Link>
          ))}
        </div>
        <p className="text-sm text-navy-soft shrink-0">
          Знайдено: <span className="font-bold text-navy">{total}</span>
        </p>
      </div>

      {products.length === 0 ? (
        <p className="text-navy-soft">
          {activeCategory
            ? "У цій категорії товарів ще немає."
            : "Товарів ще немає. Натисни «Додати товар», щоб створити перший."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-card border border-navy/10 overflow-hidden flex flex-col"
              >
                <div className="relative h-32 bg-navy/5">
                  <Image
                    src={getPublicUrl(item.mainPhoto)!}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                  />
                  <span
                    className="absolute top-2.5 left-2.5 text-[11px] font-bold uppercase tracking-wide text-white px-2.5 py-1 rounded-[7px]"
                    style={{ background: CATEGORY_BADGE_GRADIENT }}
                  >
                    {item.category.nameUk}
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-1 flex-1">
                  <div className="flex justify-end">
                    {item.showOnHome ? (
                      <span className="text-xs font-bold text-indigo bg-indigo/10 px-2 py-0.5 rounded-field">
                        На головній
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-navy-soft bg-navy/5 px-2 py-0.5 rounded-field">
                        Приховано
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-navy truncate">{item.nameUk}</p>
                  <p className="text-xs text-navy-soft">
                    Додано: {formatDate(item.createdAt, "uk", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </p>
                  <p className="text-sm font-bold text-navy">
                    {Number(item.price).toFixed(2)} грн
                  </p>
                  <p className="text-xs text-navy-soft">
                    Галерея: {item.gallery.length > 0 ? "Так" : "Ні"}
                  </p>
                  <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/tovary/${item.id}`}
                      className="text-sm font-bold text-indigo hover:underline"
                    >
                      Редагувати
                    </Link>
                    <DeleteButton action={deleteProduct.bind(null, item.id)} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
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
    </div>
  );
}
