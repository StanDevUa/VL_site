"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { extractTextValues, type FormState } from "./form-state";

function readFields(formData: FormData) {
  return {
    questionUk: (formData.get("questionUk") as string)?.trim(),
    questionEn: (formData.get("questionEn") as string)?.trim() || null,
    questionRu: (formData.get("questionRu") as string)?.trim() || null,
    answerUk: (formData.get("answerUk") as string)?.trim(),
    answerEn: (formData.get("answerEn") as string)?.trim() || null,
    answerRu: (formData.get("answerRu") as string)?.trim() || null,
  };
}

function validate(fields: ReturnType<typeof readFields>) {
  const fieldErrors: Record<string, string> = {};
  if (!fields.questionUk) fieldErrors.questionUk = "Введіть питання українською.";
  if (!fields.answerUk) fieldErrors.answerUk = "Введіть відповідь українською.";
  return fieldErrors;
}

export async function createFaqEntry(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const fieldErrors = validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.faqEntry.create({ data: fields });

  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function updateFaqEntry(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const fieldErrors = validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.faqEntry.update({ where: { id }, data: fields });

  revalidatePath("/admin/faq");
  redirect("/admin/faq");
}

export async function deleteFaqEntry(id: string) {
  await prisma.faqEntry.delete({ where: { id } });
  revalidatePath("/admin/faq");
}
