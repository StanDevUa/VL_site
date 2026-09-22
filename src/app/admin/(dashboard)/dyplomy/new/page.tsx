import { DiplomaForm } from "@/components/admin/diploma-form";
import { createDiploma } from "@/server/actions/diplomas";

export default function NewDiplomaPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-2xl text-navy mb-6">
        Новий диплом
      </h1>
      <DiplomaForm action={createDiploma} />
    </div>
  );
}
