import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { deleteWork } from "@/server/actions/works";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminWorksListPage() {
  const works = await prisma.portfolioWork.findMany({
    orderBy: { createdAt: "asc" },
  });

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
                className="text-sm font-bold text-indigo hover:underline"
              >
                Редагувати
              </Link>
              <DeleteButton action={deleteWork.bind(null, work.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
