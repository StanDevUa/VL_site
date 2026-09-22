"use client";

import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";

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
  date: string; // yyyy-mm-dd, готове для <input type="date">
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
  action: (formData: FormData) => void;
  existing?: ExistingNews;
}) {
  const fields = existing as unknown as Record<string, string | null> | undefined;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
        <div className="lg:col-span-2 rounded-card bg-white border border-navy/10 p-6">
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
                <label className={labelClass}>Дата *</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={existing?.date ?? today}
                  className={inputClass}
                />
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

      <button
        type="submit"
        className="rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover"
      >
        Зберегти
      </button>
    </form>
  );
}
