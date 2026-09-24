"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { extractTextValues, type FormState } from "./form-state";

export type ConsultationRequestState = (FormState & { success?: boolean }) | undefined;

function readFields(formData: FormData) {
  return {
    name: (formData.get("name") as string)?.trim(),
    phone: (formData.get("phone") as string)?.trim(),
    email: (formData.get("email") as string)?.trim(),
    comment: (formData.get("comment") as string)?.trim() || null,
  };
}

async function validate(fields: ReturnType<typeof readFields>) {
  const t = await getTranslations("HomeCta");
  const fieldErrors: Record<string, string> = {};
  if (!fields.name) fieldErrors.name = t("errorName");
  if (!fields.phone) fieldErrors.phone = t("errorPhone");
  if (!fields.email) fieldErrors.email = t("errorEmail");
  return fieldErrors;
}

/** TODO: надіслати email Вікторії — email-інфраструктура (SMTP/Resend) ще не підключена в проєкті. */
export async function submitConsultationRequest(
  _prevState: ConsultationRequestState,
  formData: FormData,
): Promise<ConsultationRequestState> {
  const fields = readFields(formData);
  const fieldErrors = await validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.consultationRequest.create({ data: fields });

  return { success: true };
}
