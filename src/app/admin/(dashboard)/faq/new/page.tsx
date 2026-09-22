import { FaqForm } from "@/components/admin/faq-form";
import { createFaqEntry } from "@/server/actions/faq";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Нове питання
      </h1>
      <FaqForm action={createFaqEntry} />
    </div>
  );
}
