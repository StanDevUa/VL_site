"use client";

import { useState } from "react";
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

function MainPhotoPicker({
  existingUrl,
  required,
}: {
  existingUrl?: string;
  required?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <label className="relative block w-52 h-40 rounded-card border-2 border-dashed border-navy/20 cursor-pointer overflow-hidden hover:border-indigo transition-colors bg-powder-beige/40">
        <input
          type="file"
          name="mainPhoto"
          accept="image/*"
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- локальний blob-прев'ю, не для next/image
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : existingUrl ? (
          <Image src={existingUrl} alt="" fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-navy-soft text-sm gap-1 px-4 text-center">
            <span className="font-bold">+ Обрати фото</span>
            <span className="text-xs">Натисни, щоб завантажити</span>
          </div>
        )}
      </label>
      {preview && (
        <p className="text-xs text-indigo font-bold mt-2">
          Нове фото обрано — натисни «Зберегти» внизу, щоб застосувати.
        </p>
      )}
      {!preview && existingUrl && (
        <p className="text-xs text-navy-soft mt-2">
          Натисни на фото, щоб замінити.
        </p>
      )}
    </div>
  );
}

function GalleryPicker({ existing }: { existing: { key: string; url: string }[] }) {
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  return (
    <div>
      {existing.length > 0 && (
        <>
          <p className="text-sm font-bold text-navy mb-2">Поточні фото</p>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {existing.map((photo) => (
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
        </>
      )}

      {newPreviews.length > 0 && (
        <>
          <p className="text-sm font-bold text-indigo mb-2">
            Нові фото (додадуться після збереження)
          </p>
          <div className="grid grid-cols-4 gap-3 mb-5">
            {newPreviews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- локальні blob-прев'ю
              <img
                key={i}
                src={src}
                alt=""
                className="rounded-field object-cover w-full h-[90px] ring-2 ring-indigo/50"
              />
            ))}
          </div>
        </>
      )}

      <label className="inline-flex items-center gap-2 rounded-field border-2 border-dashed border-navy/20 px-5 py-3 cursor-pointer hover:border-indigo text-sm font-bold text-navy-soft hover:text-navy transition-colors">
        + Додати фото до галереї
        <input
          type="file"
          name="gallery"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            setNewPreviews(files.map((f) => URL.createObjectURL(f)));
          }}
        />
      </label>
    </div>
  );
}

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
        <MainPhotoPicker existingUrl={existing?.mainPhotoUrl} required={!existing} />
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Галерея (додаткові фото, необов&apos;язково)
        </h2>
        <GalleryPicker existing={existing?.gallery ?? []} />
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
