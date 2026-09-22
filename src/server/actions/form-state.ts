export type FormState =
  | {
      /** Помилки по конкретних полях — ключ співпадає з name інпута. */
      fieldErrors?: Record<string, string>;
      /**
       * Введені текстові значення (без файлів) — повертаються назад, щоб форма
       * могла відновити те, що людина вже написала, замість очищення полів
       * після невдалої спроби зберегти (React ремаунтить форму, коли Server
       * Action повертає новий стан — це стирає defaultValue-поля).
       */
      values?: Record<string, string>;
    }
  | undefined;

/** Витягує всі текстові (не файлові) поля форми — для повернення назад у values. */
export function extractTextValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      values[key] = value;
    }
  }
  return values;
}
