"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { FieldError } from "@/components/admin/field-error";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import type { FormState } from "@/server/actions/form-state";

type ExistingCategory = {
  nameUk: string;
  nameEn: string | null;
  nameRu: string | null;
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

export function CategoryForm({
  action,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  existing?: ExistingCategory;
}) {
  const fields = existing as unknown as Record<string, string | null> | undefined;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const resolve = (key: string) => state?.values?.[key] ?? fields?.[key] ?? "";

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    setDismissed(new Set());
  }
  const errorFor = (key: string) => (dismissed.has(key) ? undefined : state?.fieldErrors?.[key]);
  const dismissOnFill = (key: string, value: string) => {
    if (value.trim() === "") return;
    setDismissed((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  return (
    <form action={formAction} noValidate className="max-w-3xl">
      <div className="rounded-card bg-white border border-navy/10 p-6 mb-8">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Назва категорії (три мовні версії)
        </h2>
        <LocaleTabs>
          {(suffix: LocaleSuffix) => (
            <div>
              <label className={labelClass}>Назва{suffix === "Uk" && " *"}</label>
              <input
                name={`name${suffix}`}
                defaultValue={resolve(`name${suffix}`)}
                onChange={
                  suffix === "Uk" ? (e) => dismissOnFill("nameUk", e.target.value) : undefined
                }
                className={inputClass}
              />
              {suffix === "Uk" && <FieldError message={errorFor("nameUk")} />}
            </div>
          )}
        </LocaleTabs>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link href="/admin/kategorii" className={secondaryButtonClass}>
          Скасувати
        </Link>
      </div>
    </form>
  );
}
