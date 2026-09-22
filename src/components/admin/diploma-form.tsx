"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import type { FormState } from "@/server/actions/form-state";

type ExistingDiploma = {
  captionUk: string | null;
  captionEn: string | null;
  captionRu: string | null;
  showOnSite: boolean;
  imageUrl: string;
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";

export function DiplomaForm({
  action,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  existing?: ExistingDiploma;
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
    <form action={formAction} noValidate className="max-w-3xl @container">
      <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-6 mb-6 items-start">
        <div className="@2xl:col-span-2 rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">
            Підпис (необов&apos;язково, три мовні версії)
          </h2>
          <LocaleTabs>
            {(suffix: LocaleSuffix) => (
              <input
                name={`caption${suffix}`}
                defaultValue={resolve(`caption${suffix}`)}
                placeholder="Наприклад, «Сертифікат з дитячої психології, 2024»"
                className={inputClass}
              />
            )}
          </LocaleTabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-card bg-white border border-navy/10 p-6">
            <h2 className="font-heading font-bold text-lg text-navy mb-4">
              Фото {!existing && "*"}
            </h2>
            <PhotoPicker
              name="image"
              existingUrl={existing?.imageUrl}
              required={!existing}
              error={errorFor("image")}
              onPick={() => dismissOnFill("image", "x")}
            />
          </div>

          <div className="rounded-card bg-white border border-navy/10 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="showOnSite"
                defaultChecked={existing?.showOnSite ?? false}
                className="w-5 h-5 rounded accent-indigo"
              />
              <span className="font-bold text-navy">Показувати на сайті</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link href="/admin/dyplomy" className={secondaryButtonClass}>
          Скасувати
        </Link>
      </div>
    </form>
  );
}
