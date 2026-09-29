import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { DiplomaForm } from "@/components/admin/diploma-form";
import { updateDiploma } from "@/server/actions/diplomas";

export default async function EditDiplomaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const diploma = await prisma.diploma.findUnique({ where: { id } });

  if (!diploma) {
    notFound();
  }

  const returnTo = page ? `/admin/dyplomy?page=${page}` : "/admin/dyplomy";
  const updateDiplomaWithId = updateDiploma.bind(null, id, returnTo);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування диплома
      </h1>
      <DiplomaForm
        action={updateDiplomaWithId}
        existing={{
          captionUk: diploma.captionUk,
          captionEn: diploma.captionEn,
          captionRu: diploma.captionRu,
          showOnSite: diploma.showOnSite,
          imageUrl: getPublicUrl(diploma.image)!,
        }}
      />
    </div>
  );
}
