"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NewsCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { slugify, uniqueSlug } from "@/lib/slugify";

async function generateUniqueSlug(titleUk: string, excludeId?: string) {
  const base = slugify(titleUk);
  const existing = await prisma.newsPost.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(base, new Set(existing.map((n) => n.slug)));
}

function readFields(formData: FormData) {
  const category = formData.get("category") as string;
  if (!Object.values(NewsCategory).includes(category as NewsCategory)) {
    throw new Error("Оберіть категорію.");
  }

  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : new Date();

  return {
    titleUk: (formData.get("titleUk") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim() || null,
    titleRu: (formData.get("titleRu") as string)?.trim() || null,
    excerptUk: (formData.get("excerptUk") as string)?.trim(),
    excerptEn: (formData.get("excerptEn") as string)?.trim() || null,
    excerptRu: (formData.get("excerptRu") as string)?.trim() || null,
    textUk: (formData.get("textUk") as string)?.trim(),
    textEn: (formData.get("textEn") as string)?.trim() || null,
    textRu: (formData.get("textRu") as string)?.trim() || null,
    category: category as NewsCategory,
    date,
  };
}

export async function createNews(formData: FormData) {
  const fields = readFields(formData);

  if (!fields.titleUk || !fields.excerptUk || !fields.textUk) {
    throw new Error("Заповніть обов'язкові поля українською.");
  }

  const photoFile = formData.get("photo") as File | null;
  const photo =
    photoFile && photoFile.size > 0 ? await uploadFile("news", photoFile) : null;

  const slug = await generateUniqueSlug(fields.titleUk);

  await prisma.newsPost.create({
    data: { ...fields, slug, photo },
  });

  revalidatePath("/admin/novyny");
  revalidatePath("/[locale]/novyny", "page");
  redirect("/admin/novyny");
}

export async function updateNews(id: string, formData: FormData) {
  const fields = readFields(formData);

  if (!fields.titleUk || !fields.excerptUk || !fields.textUk) {
    throw new Error("Заповніть обов'язкові поля українською.");
  }

  const current = await prisma.newsPost.findUniqueOrThrow({ where: { id } });

  const photoFile = formData.get("photo") as File | null;
  const removePhoto = formData.get("removePhoto") === "on";

  let photo = current.photo;
  if (photoFile && photoFile.size > 0) {
    photo = await uploadFile("news", photoFile);
    if (current.photo) await deleteFile(current.photo);
  } else if (removePhoto && current.photo) {
    await deleteFile(current.photo);
    photo = null;
  }

  await prisma.newsPost.update({
    where: { id },
    data: { ...fields, photo },
  });

  revalidatePath("/admin/novyny");
  revalidatePath("/[locale]/novyny", "page");
  revalidatePath("/[locale]/novyny/[slug]", "page");
  redirect("/admin/novyny");
}

export async function deleteNews(id: string) {
  const news = await prisma.newsPost.findUniqueOrThrow({ where: { id } });

  if (news.photo) await deleteFile(news.photo);
  await prisma.newsPost.delete({ where: { id } });

  revalidatePath("/admin/novyny");
  revalidatePath("/[locale]/novyny", "page");
}
