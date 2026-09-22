"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";
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
