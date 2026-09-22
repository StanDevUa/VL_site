"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { extractTextValues, type FormState } from "./form-state";

function readFields(formData: FormData) {
  return {
    author: (formData.get("author") as string)?.trim(),
    authorDescriptionUk: (formData.get("authorDescriptionUk") as string)?.trim(),
    authorDescriptionEn: (formData.get("authorDescriptionEn") as string)?.trim() || null,
    authorDescriptionRu: (formData.get("authorDescriptionRu") as string)?.trim() || null,
    textUk: (formData.get("textUk") as string)?.trim(),
    textEn: (formData.get("textEn") as string)?.trim() || null,
    textRu: (formData.get("textRu") as string)?.trim() || null,
    showOnHome: formData.get("showOnHome") === "on",
  };
}

function validate(fields: ReturnType<typeof readFields>) {
  const fieldErrors: Record<string, string> = {};
  if (!fields.author) fieldErrors.author = "Введіть ім'я автора.";
  if (!fields.authorDescriptionUk) {
    fieldErrors.authorDescriptionUk = "Введіть опис автора українською.";
  }
  if (!fields.textUk) fieldErrors.textUk = "Введіть текст відгуку українською.";
  return fieldErrors;
}

export async function createTestimonial(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const fieldErrors = validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.testimonial.create({ data: fields });

  revalidatePath("/admin/vidguky");
  redirect("/admin/vidguky");
}

export async function updateTestimonial(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const fieldErrors = validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.testimonial.update({ where: { id }, data: fields });

  revalidatePath("/admin/vidguky");
  redirect("/admin/vidguky");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/vidguky");
}
