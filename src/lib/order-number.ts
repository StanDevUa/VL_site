/** Людський номер замовлення, який бачить клієнт: "VL-20260315-A1B2C3". */
export function generateOrderNumber(date: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const datePart = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VL-${datePart}-${randomPart}`;
}
