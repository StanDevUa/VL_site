import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FaqForm } from "@/components/admin/faq-form";
import { updateFaqEntry } from "@/server/actions/faq";

export default async function EditFaqPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const entry = await prisma.faqEntry.findUnique({ where: { id } });

  if (!entry) {
    notFound();
  }

  const returnTo = page ? `/admin/faq?page=${page}` : "/admin/faq";
  const updateFaqEntryWithId = updateFaqEntry.bind(null, id, returnTo);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування питання
      </h1>
      <FaqForm action={updateFaqEntryWithId} existing={entry} />
    </div>
  );
}
