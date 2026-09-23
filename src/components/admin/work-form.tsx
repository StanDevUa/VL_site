"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";
import { GalleryPicker } from "@/components/admin/gallery-picker";
import { FieldError } from "@/components/admin/field-error";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import type { FormState } from "@/server/actions/form-state";

type ExistingWork = {
  titleUk: string;
  titleEn: string | null;
  titleRu: string | null;
  excerptUk: string;
  excerptEn: string | null;
  excerptRu: string | null;
  descriptionUk: string;
  descriptionEn: string | null;
  descriptionRu: string | null;
  mainPhotoUrl: string;
  gallery: { key: string; url: string }[];
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

export function WorkForm({
  action,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  existing?: ExistingWork;
}) {
  const fields = existing as unknown as Record<string, string | null> | undefined;
  const [state, formAction, isPending] = useActionState(action, undefined);
  // Після невдалої спроби зберегти форма ремаунтиться (Server Action повернув
  // новий стан), тож defaultValue має брати щойно введене (state.values),
  // а не відкочуватись до fields з existing/порожнього рядка.
  const resolve = (key: string) => state?.values?.[key] ?? fields?.[key] ?? "";

  // Live-скидання застарілих помилок: щойно людина щось вписує в поле —
  // ховаємо повідомлення про цю помилку, не чекаючи наступного збереження.
  // Синхронізуємо під час рендеру (React-патерн "adjusting state when a
  // prop changes"), не в useEffect — інакше зайвий цикл рендеру.
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
    <form action={formAction} noValidate className="max-w-5xl @container">
      <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-6 mb-6 items-start">
        <div className="@2xl:col-span-2 rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">
            Текст (три мовні версії)
          </h2>
          <LocaleTabs>
            {(suffix: LocaleSuffix) => (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Назва{suffix === "Uk" && " *"}
                  </label>
                  <input
                    name={`title${suffix}`}
                    defaultValue={resolve(`title${suffix}`)}
                    onChange={
                      suffix === "Uk" ? (e) => dismissOnFill("titleUk", e.target.value) : undefined
                    }
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("titleUk")} />}
                </div>
                <div>
                  <label className={labelClass}>
                    Короткий опис (у списку та на сторінці роботи)
                    {suffix === "Uk" && " *"}
                  </label>
                  <textarea
                    name={`excerpt${suffix}`}
                    defaultValue={resolve(`excerpt${suffix}`)}
                    onChange={
                      suffix === "Uk" ? (e) => dismissOnFill("excerptUk", e.target.value) : undefined
                    }
                    rows={2}
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("excerptUk")} />}
                </div>
                <div>
                  <label className={labelClass}>
                    Повний опис{suffix === "Uk" && " *"}
                  </label>
                  <textarea
                    name={`description${suffix}`}
                    defaultValue={resolve(`description${suffix}`)}
                    onChange={
                      suffix === "Uk"
                        ? (e) => dismissOnFill("descriptionUk", e.target.value)
                        : undefined
                    }
                    rows={6}
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("descriptionUk")} />}
                </div>
              </div>
            )}
          </LocaleTabs>
        </div>

        <div className="rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">
            Головне фото {!existing && "*"}
          </h2>
          <PhotoPicker
            name="mainPhoto"
            existingUrl={existing?.mainPhotoUrl}
            required={!existing}
            error={errorFor("mainPhoto")}
            onPick={() => dismissOnFill("mainPhoto", "x")}
          />
        </div>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-8">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Галерея (необов&apos;язково)
        </h2>
        <GalleryPicker existing={existing?.gallery ?? []} />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className={primaryButtonClass}
        >
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link
          href="/admin/roboty"
          className={secondaryButtonClass}
        >
          Скасувати
        </Link>
      </div>
    </form>
  );
}
