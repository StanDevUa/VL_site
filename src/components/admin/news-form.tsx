"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";
import { FieldError } from "@/components/admin/field-error";
import { defaultScheduleDateTime } from "@/lib/format-date";
import type { FormState } from "@/server/actions/form-state";

type ExistingNews = {
  titleUk: string;
  titleEn: string | null;
  titleRu: string | null;
  excerptUk: string;
  excerptEn: string | null;
  excerptRu: string | null;
  textUk: string;
  textEn: string | null;
  textRu: string | null;
  category: string;
  date: string; // yyyy-MM-ddTHH:mm, готове для <input type="datetime-local">
  isScheduled: boolean; // date у майбутньому — форма відкриється у режимі "заплановано"
  photoUrl: string;
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

const CATEGORY_OPTIONS = [
  { value: "ANNOUNCEMENT", label: "Анонс" },
  { value: "NEWS", label: "Новина" },
  { value: "FOR_PSYCHOLOGISTS", label: "Для психологів" },
];

export function NewsForm({
  action,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  existing?: ExistingNews;
}) {
  const fields = existing as unknown as Record<string, string | null> | undefined;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const resolve = (key: string) => state?.values?.[key] ?? fields?.[key] ?? "";

  const [publishMode, setPublishMode] = useState<"now" | "scheduled">(
    existing?.isScheduled ? "scheduled" : "now",
  );
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // React скидає незкеровані поля форми після завершення Server Action —
  // тож publishMode (кероване через checked) і застарілі помилки (dismissed)
  // треба синхронізувати щоразу, коли з сервера повертається новий стан.
  // Робимо це під час рендеру (офіційний React-патерн "adjusting state when
  // a prop changes"), а не в useEffect — інакше зайвий цикл рендеру й лінт-помилка.
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    setDismissed(new Set());
    if (state?.values?.publishMode === "scheduled") {
      setPublishMode("scheduled");
    } else if (state?.values?.publishMode === "now") {
      setPublishMode("now");
    }
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
                    Заголовок{suffix === "Uk" && " *"}
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
                    Короткий опис (у списку та на сторінці новини)
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
                    Текст новини{suffix === "Uk" && " *"}
                  </label>
                  <textarea
                    name={`text${suffix}`}
                    defaultValue={resolve(`text${suffix}`)}
                    onChange={
                      suffix === "Uk" ? (e) => dismissOnFill("textUk", e.target.value) : undefined
                    }
                    rows={8}
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("textUk")} />}
                </div>
              </div>
            )}
          </LocaleTabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-card bg-white border border-navy/10 p-6">
            <h2 className="font-heading font-bold text-lg text-navy mb-4">
              Параметри
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Категорія *</label>
                <select
                  name="category"
                  defaultValue={state?.values?.category || existing?.category || "NEWS"}
                  onChange={(e) => dismissOnFill("category", e.target.value)}
                  className={inputClass}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FieldError message={errorFor("category")} />
              </div>
              <div>
                <label className={labelClass}>Публікація *</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-navy">
                    <input
                      type="radio"
                      name="publishMode"
                      value="now"
                      checked={publishMode === "now"}
                      onChange={() => setPublishMode("now")}
                    />
                    Опублікувати зараз
                  </label>
                  <label className="flex items-center gap-2 text-sm text-navy">
                    <input
                      type="radio"
                      name="publishMode"
                      value="scheduled"
                      checked={publishMode === "scheduled"}
                      onChange={() => setPublishMode("scheduled")}
                    />
                    Запланувати на
                  </label>
                  {publishMode === "scheduled" && (
                    <input
                      type="datetime-local"
                      name="scheduledDate"
                      defaultValue={
                        state?.values?.scheduledDate || existing?.date || defaultScheduleDateTime()
                      }
                      onChange={(e) => dismissOnFill("scheduledDate", e.target.value)}
                      className={inputClass}
                    />
                  )}
                </div>
                <FieldError message={errorFor("scheduledDate")} />
                {publishMode === "scheduled" && !errorFor("scheduledDate") && (
                  <p className="text-xs text-navy-soft mt-2">
                    Новина сама з&apos;явиться на сайті у вказаний момент —
                    нічого додатково робити не треба.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-card bg-white border border-navy/10 p-6">
            <h2 className="font-heading font-bold text-lg text-navy mb-4">
              Фото {!existing && "*"}
            </h2>
            <PhotoPicker
              name="photo"
              existingUrl={existing?.photoUrl}
              required={!existing}
              error={errorFor("photo")}
              onPick={() => dismissOnFill("photo", "x")}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover disabled:opacity-60"
        >
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link
          href="/admin/novyny"
          className="rounded-button border border-navy/15 px-8 py-3 font-heading font-bold text-navy hover:border-indigo hover:text-indigo transition-colors"
        >
          Скасувати
        </Link>
      </div>
    </form>
  );
}
