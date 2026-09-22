import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { deleteWork } from "@/server/actions/works";
import { DeleteButton } from "@/components/admin/delete-button";

const PAGE_SIZE = 10;

export default async function AdminWorksListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const [works, total] = await Promise.all([
    prisma.portfolioWork.findMany({
      orderBy: { createdAt: "asc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.portfolioWork.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading font-extrabold text-2xl text-navy">
          Мої роботи
        </h1>
        <Link
          href="/admin/roboty/new"
          className="rounded-button bg-indigo px-5 py-3 font-heading font-bold text-white shadow-button hover:bg-indigo-hover"
        >
          + Додати роботу
        </Link>
      </div>

      {works.length === 0 ? (
        <p className="text-navy-soft">
          Робіт ще немає. Натисни «Додати роботу», щоб створити першу.
        </p>
      ) : (
        <>
          <div className="bg-white rounded-card border border-navy/10 divide-y divide-navy/10">
            {works.map((work) => (
              <div key={work.id} className="flex items-center gap-4 p-4">
                <Image
                  src={getPublicUrl(work.mainPhoto)!}
                  alt=""
                  width={72}
                  height={54}
                  className="rounded-field object-cover w-[72px] h-[54px] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-navy truncate">{work.titleUk}</p>
                  <p className="text-sm text-navy-soft truncate">
                    {work.excerptUk}
                  </p>
                </div>
                <Link
                  href={`/admin/roboty/${work.id}`}
                  className="shrink-0 text-sm font-bold text-indigo hover:underline"
                >
                  Редагувати
                </Link>
                <div className="shrink-0">
                  <DeleteButton action={deleteWork.bind(null, work.id)} />
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/admin/roboty?page=${p}`}
                  className={
                    "w-10 h-10 flex items-center justify-center rounded-field font-bold text-sm " +
                    (p === currentPage
                      ? "bg-indigo text-white"
                      : "bg-white border border-navy/15 text-navy hover:border-indigo")
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
