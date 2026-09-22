"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { slugify, uniqueSlug } from "@/lib/slugify";
import type { FormState } from "./form-state";

async function generateUniqueSlug(titleUk: string, excludeId?: string) {
  const base = slugify(titleUk);
  const existing = await prisma.newsPost.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(base, new Set(existing.map((n) => n.slug)));
}

function readFields(formData: FormData) {
  const categoryRaw = formData.get("category") as string;
  const category = Object.values(NewsCategory).includes(categoryRaw as NewsCategory)
    ? (categoryRaw as NewsCategory)
    : null;

  const publishMode = formData.get("publishMode") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const missingScheduledDate = publishMode === "scheduled" && !scheduledDate;
  const date =
    publishMode === "scheduled" && scheduledDate
      ? new Date(scheduledDate)
      : new Date();

  return {
    missingScheduledDate,
    titleUk: (formData.get("titleUk") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim() || null,
    titleRu: (formData.get("titleRu") as string)?.trim() || null,
    excerptUk: (formData.get("excerptUk") as string)?.trim(),
    excerptEn: (formData.get("excerptEn") as string)?.trim() || null,
    excerptRu: (formData.get("excerptRu") as string)?.trim() || null,
    textUk: (formData.get("textUk") as string)?.trim(),
    textEn: (formData.get("textEn") as string)?.trim() || null,
    textRu: (formData.get("textRu") as string)?.trim() || null,
    category,
    date,
  };
}

export async function createNews(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);

  if (!fields.titleUk || !fields.excerptUk || !fields.textUk) {
    return { error: "Заповніть обов'язкові поля українською." };
  }
  if (!fields.category) {
    return { error: "Оберіть категорію." };
  }
  if (fields.missingScheduledDate) {
    return { error: "Вкажіть дату й час публікації." };
  }

  const photoFile = formData.get("photo") as File | null;
  if (!photoFile || photoFile.size === 0) {
    return { error: "Додайте фото." };
  }
  const photo = await uploadFile("news", photoFile);

  const slug = await generateUniqueSlug(fields.titleUk);
  const { missingScheduledDate: _missingScheduledDate, ...data } = fields;

  await prisma.newsPost.create({
    data: { ...data, category: fields.category, slug, photo },
  });

  revalidatePath("/admin/novyny");
  revalidatePath("/[locale]/novyny", "page");
  redirect("/admin/novyny");
}

export async function updateNews(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);

  if (!fields.titleUk || !fields.excerptUk || !fields.textUk) {
    return { error: "Заповніть обов'язкові поля українською." };
  }
  if (!fields.category) {
    return { error: "Оберіть категорію." };
  }
  if (fields.missingScheduledDate) {
    return { error: "Вкажіть дату й час публікації." };
  }

  const current = await prisma.newsPost.findUniqueOrThrow({ where: { id } });

  const photoFile = formData.get("photo") as File | null;
  let photo = current.photo;
  if (photoFile && photoFile.size > 0) {
    photo = await uploadFile("news", photoFile);
    await deleteFile(current.photo);
  }

  const { missingScheduledDate: _missingScheduledDate, ...data } = fields;

  await prisma.newsPost.update({
    where: { id },
    data: { ...data, category: fields.category, photo },
  });

  revalidatePath("/admin/novyny");
  revalidatePath("/[locale]/novyny", "page");
  revalidatePath("/[locale]/novyny/[slug]", "page");
  redirect("/admin/novyny");
}

export async function deleteNews(id: string) {
  const news = await prisma.newsPost.findUniqueOrThrow({ where: { id } });

  await deleteFile(news.photo);
  await prisma.newsPost.delete({ where: { id } });

  revalidatePath("/admin/novyny");
  revalidatePath("/[locale]/novyny", "page");
}
