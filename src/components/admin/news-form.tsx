"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";
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
  const [publishMode, setPublishMode] = useState<"now" | "scheduled">(
    existing?.isScheduled ? "scheduled" : "now",
  );

  // За замовчуванням — за годину від зараз, щоб поле не було порожнім,
  // коли Вікторія перемикається на "Запланувати". Обчислюється один раз
  // при монтуванні (лінива ініціалізація useState) — щоб не викликати
  // Date.now() безпосередньо в тілі рендеру.
  const [defaultScheduleValue] = useState(
    () => existing?.date ?? new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
  );

  return (
    <form action={formAction} noValidate className="max-w-5xl @container">
      {state?.error && (
        <div className="mb-6 rounded-field bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-red-700">
          {state.error}
        </div>
      )}
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
                    defaultValue={fields?.[`title${suffix}`] ?? ""}
                    required={suffix === "Uk"}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Короткий опис (у списку та на сторінці новини)
                    {suffix === "Uk" && " *"}
                  </label>
                  <textarea
                    name={`excerpt${suffix}`}
                    defaultValue={fields?.[`excerpt${suffix}`] ?? ""}
                    required={suffix === "Uk"}
                    rows={2}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    Текст новини{suffix === "Uk" && " *"}
                  </label>
                  <textarea
                    name={`text${suffix}`}
                    defaultValue={fields?.[`text${suffix}`] ?? ""}
                    required={suffix === "Uk"}
                    rows={8}
                    className={inputClass}
                  />
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
                  required
                  defaultValue={existing?.category ?? "NEWS"}
                  className={inputClass}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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
                      required
                      defaultValue={defaultScheduleValue}
                      className={inputClass}
                    />
                  )}
                </div>
                {publishMode === "scheduled" && (
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
            <PhotoPicker name="photo" existingUrl={existing?.photoUrl} required={!existing} />
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
