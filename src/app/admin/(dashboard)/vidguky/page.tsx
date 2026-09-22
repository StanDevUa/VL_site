import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteTestimonial } from "@/server/actions/testimonials";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/ui/button-styles";

const PAGE_SIZE = 10;

export default async function AdminTestimonialsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [testimonials, total] = await Promise.all([
    prisma.testimonial.findMany({
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.testimonial.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">Відгуки</h1>
        <Link
          href="/admin/vidguky/new"
          className={primaryButtonClass}
        >
          + Додати відгук
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <p className="text-navy-soft">
          Відгуків ще немає. Натисни «Додати відгук», щоб створити перший.
        </p>
      ) : (
        <>
          <div className="bg-white rounded-card border border-navy/10 divide-y divide-navy/10">
            {testimonials.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-navy truncate">{item.author}</p>
                    {item.showOnHome && (
                      <span className="shrink-0 text-xs font-bold text-indigo bg-indigo/10 px-2 py-0.5 rounded-field">
                        На головній
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-navy-soft truncate">{item.textUk}</p>
                </div>
                <Link
                  href={`/admin/vidguky/${item.id}`}
                  className="shrink-0 text-sm font-bold text-indigo hover:underline"
                >
                  Редагувати
                </Link>
                <div className="shrink-0">
                  <DeleteButton action={deleteTestimonial.bind(null, item.id)} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/vidguky?page=${p}`}
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
