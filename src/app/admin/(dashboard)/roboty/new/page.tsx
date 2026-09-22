import { WorkForm } from "@/components/admin/work-form";
import { createWork } from "@/server/actions/works";

export default function NewWorkPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Нова робота
      </h1>
      <WorkForm action={createWork} />
    </div>
  );
}
