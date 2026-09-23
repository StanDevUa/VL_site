"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type PendingFile = { file: File; previewUrl: string };

/** Необов'язкова галерея додаткових фото — використовується в "Роботах" і "Товарах". */
export function GalleryPicker({ existing }: { existing: { key: string; url: string }[] }) {
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

  // Та сама причина, що й у PhotoPicker: React скидає file-інпут на рівні
  // DOM після Server Action, тож перевіряємо після кожного рендеру, чи не
  // спорожнів інпут попри те, що обрані файли все ще в нас у стані.
  useEffect(() => {
    if (newFiles.length > 0 && inputRef.current && inputRef.current.files?.length === 0) {
      syncInputFiles(newFiles);
    }
  });

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
