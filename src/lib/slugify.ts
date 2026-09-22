const UK_TO_LATIN: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie",
  ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
  ю: "iu", я: "ia", "'": "",
};

/** Транслітерація українського заголовка в латинський URL-слаг. */
export function slugify(title: string): string {
  const transliterated = title
    .toLowerCase()
    .split("")
    .map((char) => UK_TO_LATIN[char] ?? char)
    .join("");

  return transliterated
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Додає -2, -3 тощо, якщо базовий слаг уже зайнятий. */
export function uniqueSlug(base: string, existing: Set<string>): string {
  if (!existing.has(base)) return base || "item";
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}
