import { NewsForm } from "@/components/admin/news-form";
import { createNews } from "@/server/actions/news";

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Нова новина
      </h1>
      <NewsForm action={createNews} />
    </div>
  );
}
