import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FaqForm } from "@/components/admin/faq-form";
import { updateFaqEntry } from "@/server/actions/faq";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await prisma.faqEntry.findUnique({ where: { id } });

  if (!entry) {
    notFound();
  }

  const updateFaqEntryWithId = updateFaqEntry.bind(null, id);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування питання
      </h1>
      <FaqForm action={updateFaqEntryWithId} existing={entry} />
    </div>
  );
}
