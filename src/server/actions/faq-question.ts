"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { extractTextValues, type FormState } from "./form-state";

export type AskQuestionState = (FormState & { success?: boolean }) | undefined;

function readFields(formData: FormData) {
  return {
    name: (formData.get("name") as string)?.trim(),
    email: (formData.get("email") as string)?.trim(),
    question: (formData.get("question") as string)?.trim(),
  };
}

async function validate(fields: ReturnType<typeof readFields>) {
  const t = await getTranslations("HomeFaq");
  const fieldErrors: Record<string, string> = {};
  if (!fields.name) fieldErrors.name = t("errorName");
  if (!fields.email) fieldErrors.email = t("errorEmail");
  if (!fields.question) fieldErrors.question = t("errorQuestion");
  return fieldErrors;
}

/** TODO: надіслати email Вікторії — email-інфраструктура (SMTP/Resend) ще не підключена в проєкті. */
export async function submitFaqQuestion(
  _prevState: AskQuestionState,
  formData: FormData,
): Promise<AskQuestionState> {
  const fields = readFields(formData);
  const fieldErrors = await validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.faqQuestion.create({ data: fields });

  return { success: true };
}
