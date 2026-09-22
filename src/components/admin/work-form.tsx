"use client";

import { useRef, useState } from "react";
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
      <label className="relative block w-full h-40 rounded-card border-2 border-dashed border-navy/20 cursor-pointer overflow-hidden hover:border-indigo transition-colors bg-powder-beige/40">
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

type PendingFile = { file: File; previewUrl: string };

function GalleryPicker({ existing }: { existing: { key: string; url: string }[] }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [newFiles, setNewFiles] = useState<PendingFile[]>([]);
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(new Set());

  function syncInputFiles(files: PendingFile[]) {
    // Нативний <input type="file"> не вміє "додавати" файли — кожен вибір
    // повністю замінює попередній. Тому самі ведемо повний список у стані
    // і через DataTransfer переписуємо .files інпута перед сабмітом форми.
    const dataTransfer = new DataTransfer();
    files.forEach(({ file }) => dataTransfer.items.add(file));
    if (inputRef.current) {
      inputRef.current.files = dataTransfer.files;
    }
  }

  function handlePick(selected: FileList | null) {
    if (!selected || selected.length === 0) return;
    const picked = Array.from(selected).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    const merged = [...newFiles, ...picked];
    setNewFiles(merged);
    syncInputFiles(merged);
  }

  function removeNewFile(index: number) {
    URL.revokeObjectURL(newFiles[index].previewUrl);
    const updated = newFiles.filter((_, i) => i !== index);
    setNewFiles(updated);
    syncInputFiles(updated);
  }

  function toggleRemoveExisting(key: string) {
    setRemovedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <div>
      {existing.length > 0 && (
        <>
          <p className="text-sm font-bold text-navy mb-2">Поточні фото</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {existing.map((photo) => {
              const marked = removedKeys.has(photo.key);
              return (
                <div key={photo.key}>
                  <div className="relative">
                    <Image
                      src={photo.url}
                      alt=""
                      width={140}
                      height={100}
                      className={
                        "rounded-field object-cover w-full h-[100px] " +
                        (marked ? "opacity-30 grayscale" : "")
                      }
                    />
                    {marked && <input type="hidden" name="removeGallery" value={photo.key} />}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleRemoveExisting(photo.key)}
                    className={
                      "mt-1 w-full rounded-field px-2 py-1.5 text-xs font-bold transition-colors " +
                      (marked
                        ? "bg-navy/10 text-navy hover:bg-navy/15"
                        : "bg-red-50 text-red-600 hover:bg-red-100")
                    }
                  >
                    {marked ? "Скасувати видалення" : "Видалити"}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      {newFiles.length > 0 && (
        <>
          <p className="text-sm font-bold text-indigo mb-2">
            Нові фото (додадуться після збереження)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {newFiles.map(({ previewUrl }, i) => (
              <div key={previewUrl}>
                {/* eslint-disable-next-line @next/next/no-img-element -- локальні blob-прев'ю */}
                <img
                  src={previewUrl}
                  alt=""
                  className="rounded-field object-cover w-full h-[100px] ring-2 ring-indigo/50"
                />
                <button
                  type="button"
                  onClick={() => removeNewFile(i)}
                  className="mt-1 w-full rounded-field bg-red-50 px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Прибрати
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <label className="inline-flex items-center gap-2 rounded-field border-2 border-dashed border-navy/20 px-5 py-3 cursor-pointer hover:border-indigo text-sm font-bold text-navy-soft hover:text-navy transition-colors">
        + Додати фото до галереї
        <input
          ref={inputRef}
          type="file"
          name="gallery"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handlePick(e.target.files)}
        />
      </label>
      <p className="text-xs text-navy-soft mt-2">
        Можна натискати кілька разів — нові фото додаються до вже обраних.
      </p>
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
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-8">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Галерея (необов&apos;язково)
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
