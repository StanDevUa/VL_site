import { TestimonialForm } from "@/components/admin/testimonial-form";
import { createTestimonial } from "@/server/actions/testimonials";

export default function NewTestimonialPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Новий відгук
      </h1>
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
