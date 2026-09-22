"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Обов'язкове головне фото — використовується всюди, де фото є ключовим
 * контентом (роботи, новини, товари, дипломи): на створенні обов'язкове,
 * на редагуванні можна лише замінити, прибрати геть не можна.
 */
export function PhotoPicker({
  name,
  existingUrl,
  required,
  error,
  onPick,
}: {
  name: string;
  existingUrl?: string | null;
  required?: boolean;
  error?: string;
  onPick?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Після невдалої спроби зберегти React скидає file-інпут на рівні DOM
  // (аналог form.reset()) — на відміну від тексту, файл не можна повернути
  // через defaultValue, тож тримаємо сам File у стані й підставляємо його
  // назад у справжній інпут через DataTransfer, щойно браузер його прибрав.
  useEffect(() => {
    if (
      selectedFile &&
      inputRef.current &&
      (!inputRef.current.files || inputRef.current.files.length === 0)
    ) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      inputRef.current.files = dataTransfer.files;
    }
  });

  return (
    <div>
      <label
        className={
          "relative block w-full h-40 rounded-card border-2 border-dashed cursor-pointer overflow-hidden transition-colors bg-powder-beige/40 " +
          (error ? "border-red-400" : "border-navy/20 hover:border-indigo")
        }
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept="image/*"
          required={required}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            setSelectedFile(file);
            setPreview(file ? URL.createObjectURL(file) : null);
            if (file) onPick?.();
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
      {error && <p className="text-xs font-bold text-red-600 mt-2">{error}</p>}
      {!error && preview && (
        <p className="text-xs text-indigo font-bold mt-2">
          Нове фото обрано — натисни «Зберегти» внизу, щоб застосувати.
        </p>
      )}
      {!error && !preview && existingUrl && (
        <p className="text-xs text-navy-soft mt-2">
          Натисни на фото, щоб замінити.
        </p>
      )}
    </div>
  );
}
