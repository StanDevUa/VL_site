import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { WorkForm } from "@/components/admin/work-form";
import { updateWork } from "@/server/actions/works";

export default async function EditWorkPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const work = await prisma.portfolioWork.findUnique({ where: { id } });

  if (!work) {
    notFound();
  }

  const returnTo = page ? `/admin/roboty?page=${page}` : "/admin/roboty";
  const updateWorkWithId = updateWork.bind(null, id, returnTo);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування роботи
      </h1>
      <WorkForm
        action={updateWorkWithId}
        existing={{
          titleUk: work.titleUk,
          titleEn: work.titleEn,
          titleRu: work.titleRu,
          excerptUk: work.excerptUk,
          excerptEn: work.excerptEn,
          excerptRu: work.excerptRu,
          descriptionUk: work.descriptionUk,
          descriptionEn: work.descriptionEn,
          descriptionRu: work.descriptionRu,
          mainPhotoUrl: getPublicUrl(work.mainPhoto)!,
          gallery: work.gallery.map((key) => ({
            key,
            url: getPublicUrl(key)!,
          })),
        }}
      />
    </div>
  );
}
