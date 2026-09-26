"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mail";
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

  try {
    await sendNotificationEmail({
      subject: `Новий запис на консультацію від ${fields.name}`,
      text: `Ім'я: ${fields.name}\nТелефон: ${fields.phone}\nEmail: ${fields.email}${
        fields.comment ? `\n\nКоментар:\n${fields.comment}` : ""
      }`,
      replyTo: fields.email,
    });
  } catch (error) {
    console.error("Не вдалося надіслати email-сповіщення про новий запис на консультацію:", error);
  }

  return { success: true };
}
