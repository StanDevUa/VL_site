import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "@/server/actions/categories";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Нова категорія
      </h1>
      <CategoryForm action={createCategory} />
    </div>
  );
}
