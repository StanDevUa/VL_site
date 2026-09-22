"use client";

import Image from "next/image";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";

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
  action: (formData: FormData) => void;
  existing?: ExistingWork;
}) {
  const fields = existing as unknown as Record<string, string | null> | undefined;

  return (
    <form action={action} className="max-w-2xl space-y-8">
      <div className="rounded-card bg-white border border-navy/10 p-6">
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
                  defaultValue={fields?.[`title${suffix}`] ?? ""}
                  required={suffix === "Uk"}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Короткий опис (у списку та на сторінці роботи)
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
                  Повний опис{suffix === "Uk" && " *"}
                </label>
                <textarea
                  name={`description${suffix}`}
                  defaultValue={fields?.[`description${suffix}`] ?? ""}
                  required={suffix === "Uk"}
                  rows={6}
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </LocaleTabs>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Головне фото {!existing && "*"}
        </h2>
        {existing?.mainPhotoUrl && (
          <Image
            src={existing.mainPhotoUrl}
            alt=""
            width={200}
            height={150}
            className="rounded-card object-cover mb-4"
          />
        )}
        <input
          type="file"
          name="mainPhoto"
          accept="image/*"
          required={!existing}
          className="block text-sm text-navy-soft"
        />
        {existing && (
          <p className="text-xs text-navy-soft mt-2">
            Залиш порожнім, щоб не змінювати поточне фото.
          </p>
        )}
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Галерея (додаткові фото, необов&apos;язково)
        </h2>

        {existing && existing.gallery.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {existing.gallery.map((photo) => (
              <label key={photo.key} className="relative block cursor-pointer">
                <Image
                  src={photo.url}
                  alt=""
                  width={120}
                  height={90}
                  className="rounded-field object-cover w-full h-[90px]"
                />
                <span className="mt-1 flex items-center gap-1 text-xs text-navy-soft">
                  <input type="checkbox" name="removeGallery" value={photo.key} />
                  видалити
                </span>
              </label>
            ))}
          </div>
        )}

        <input
          type="file"
          name="gallery"
          accept="image/*"
          multiple
          className="block text-sm text-navy-soft"
        />
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
