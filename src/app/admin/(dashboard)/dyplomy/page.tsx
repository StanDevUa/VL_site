import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { deleteDiploma } from "@/server/actions/diplomas";
import { DeleteButton } from "@/components/admin/delete-button";
import { primaryButtonClass } from "@/components/ui/button-styles";

const PAGE_SIZE = 12;

export default async function AdminDiplomasListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [diplomas, total] = await Promise.all([
    prisma.diploma.findMany({
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.diploma.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">Дипломи</h1>
        <Link href="/admin/dyplomy/new" className={primaryButtonClass}>
          + Додати диплом
        </Link>
      </div>

      {diplomas.length === 0 ? (
        <p className="text-navy-soft">
          Дипломів ще немає. Натисни «Додати диплом», щоб додати перший.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {diplomas.map((item) => (
              <div key={item.id} className="bg-white rounded-card border border-navy/10 overflow-hidden">
                <Image
                  src={getPublicUrl(item.image)!}
                  alt=""
                  width={300}
                  height={220}
                  className="w-full h-[160px] object-cover"
                />
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {item.showOnSite ? (
                      <span className="text-xs font-bold text-indigo bg-indigo/10 px-2 py-0.5 rounded-field">
                        На головній
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-navy-soft bg-navy/5 px-2 py-0.5 rounded-field">
                        Приховано
                      </span>
                    )}
                  </div>
                  {item.captionUk && (
                    <p className="text-sm text-navy-soft truncate mb-2">{item.captionUk}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/admin/dyplomy/${item.id}`}
                      className="text-sm font-bold text-indigo hover:underline"
                    >
                      Редагувати
                    </Link>
                    <DeleteButton action={deleteDiploma.bind(null, item.id)} />
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
                  href={`/admin/dyplomy?page=${p}`}
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
