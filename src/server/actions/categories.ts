"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { extractTextValues, type FormState } from "./form-state";

async function generateUniqueSlug(nameUk: string, excludeId?: string) {
  const base = slugify(nameUk);
  const existing = await prisma.category.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(base, new Set(existing.map((c) => c.slug)));
}

function readFields(formData: FormData) {
  return {
    nameUk: (formData.get("nameUk") as string)?.trim(),
    nameEn: (formData.get("nameEn") as string)?.trim() || null,
    nameRu: (formData.get("nameRu") as string)?.trim() || null,
  };
}

function validate(fields: ReturnType<typeof readFields>) {
  const fieldErrors: Record<string, string> = {};
  if (!fields.nameUk) fieldErrors.nameUk = "Введіть назву українською.";
  return fieldErrors;
}

export async function createCategory(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const fieldErrors = validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  const slug = await generateUniqueSlug(fields.nameUk);

  await prisma.category.create({ data: { ...fields, slug } });

  revalidatePath("/admin/kategorii");
  redirect("/admin/kategorii");
}

export async function updateCategory(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const fieldErrors = validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.category.update({ where: { id }, data: fields });

  revalidatePath("/admin/kategorii");
  redirect("/admin/kategorii");
}

export async function deleteCategory(id: string) {
  const productsCount = await prisma.product.count({ where: { categoryId: id } });
  if (productsCount > 0) {
    throw new Error(
      "Не можна видалити категорію, поки в ній є товари. Спочатку перенесіть або видаліть товари цієї категорії.",
    );
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/kategorii");
}
