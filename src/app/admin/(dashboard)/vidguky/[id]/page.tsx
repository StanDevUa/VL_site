import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { updateTestimonial } from "@/server/actions/testimonials";

export default async function EditTestimonialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page } = await searchParams;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) {
    notFound();
  }

  const returnTo = page ? `/admin/vidguky?page=${page}` : "/admin/vidguky";
  const updateTestimonialWithId = updateTestimonial.bind(null, id, returnTo);

  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Редагування відгуку
      </h1>
      <TestimonialForm action={updateTestimonialWithId} existing={testimonial} />
    </div>
  );
}
