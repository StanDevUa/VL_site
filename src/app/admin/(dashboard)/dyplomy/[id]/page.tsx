import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";
import { DiplomaForm } from "@/components/admin/diploma-form";
import { updateDiploma } from "@/server/actions/diplomas";

export default async function EditDiplomaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diploma = await prisma.diploma.findUnique({ where: { id } });

  if (!diploma) {
    notFound();
  }

  const updateDiplomaWithId = updateDiploma.bind(null, id);

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
