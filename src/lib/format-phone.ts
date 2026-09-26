/** Як тільки з'являється перша цифра — одразу префікс +380, решта форматується як XX-XXX-XX-XX. */
export function formatPhone(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, "");
  if (!digitsOnly) return "";
  const digits = (digitsOnly.startsWith("380") ? digitsOnly.slice(3) : digitsOnly).slice(0, 9);
  let out = "+380";
  if (digits.length > 0) out += " " + digits.slice(0, 2);
  if (digits.length > 2) out += "-" + digits.slice(2, 5);
  if (digits.length > 5) out += "-" + digits.slice(5, 7);
  if (digits.length > 7) out += "-" + digits.slice(7, 9);
  return out;
}
