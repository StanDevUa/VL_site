"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { extractTextValues, type FormState } from "./form-state";

async function generateUniqueSlug(titleUk: string, excludeId?: string) {
  const base = slugify(titleUk);
  const existing = await prisma.portfolioWork.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(base, new Set(existing.map((w) => w.slug)));
}

function readTranslatedFields(formData: FormData) {
  return {
    titleUk: (formData.get("titleUk") as string)?.trim(),
    titleEn: (formData.get("titleEn") as string)?.trim() || null,
    titleRu: (formData.get("titleRu") as string)?.trim() || null,
    excerptUk: (formData.get("excerptUk") as string)?.trim(),
    excerptEn: (formData.get("excerptEn") as string)?.trim() || null,
    excerptRu: (formData.get("excerptRu") as string)?.trim() || null,
    descriptionUk: (formData.get("descriptionUk") as string)?.trim(),
    descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
    descriptionRu: (formData.get("descriptionRu") as string)?.trim() || null,
  };
}

export async function createWork(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readTranslatedFields(formData);
  const mainPhotoFile = formData.get("mainPhoto") as File | null;

  const fieldErrors: Record<string, string> = {};
  if (!fields.titleUk) fieldErrors.titleUk = "Введіть назву українською.";
  if (!fields.excerptUk) fieldErrors.excerptUk = "Введіть короткий опис українською.";
  if (!fields.descriptionUk) fieldErrors.descriptionUk = "Введіть повний опис українською.";
  if (!mainPhotoFile || mainPhotoFile.size === 0) fieldErrors.mainPhoto = "Додайте головне фото.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  const mainPhoto = await uploadFile("works", mainPhotoFile!);

  const galleryFiles = formData.getAll("gallery") as File[];
  const gallery: string[] = [];
  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      gallery.push(await uploadFile("works", file));
    }
  }

  const slug = await generateUniqueSlug(fields.titleUk);

  await prisma.portfolioWork.create({
    data: { ...fields, slug, mainPhoto, gallery },
  });

  revalidatePath("/admin/roboty");
  revalidatePath("/[locale]/roboty", "page");
  redirect("/admin/roboty");
}

export async function updateWork(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readTranslatedFields(formData);

  const fieldErrors: Record<string, string> = {};
  if (!fields.titleUk) fieldErrors.titleUk = "Введіть назву українською.";
  if (!fields.excerptUk) fieldErrors.excerptUk = "Введіть короткий опис українською.";
  if (!fields.descriptionUk) fieldErrors.descriptionUk = "Введіть повний опис українською.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  const current = await prisma.portfolioWork.findUniqueOrThrow({
    where: { id },
  });

  const mainPhotoFile = formData.get("mainPhoto") as File | null;
  let mainPhoto = current.mainPhoto;
  if (mainPhotoFile && mainPhotoFile.size > 0) {
    mainPhoto = await uploadFile("works", mainPhotoFile);
    await deleteFile(current.mainPhoto);
  }

  const removeKeys = new Set(formData.getAll("removeGallery") as string[]);
  const keptGallery = current.gallery.filter((key) => !removeKeys.has(key));
  for (const key of removeKeys) {
    await deleteFile(key);
  }

  const newGalleryFiles = formData.getAll("gallery") as File[];
  const addedGallery: string[] = [];
  for (const file of newGalleryFiles) {
    if (file && file.size > 0) {
      addedGallery.push(await uploadFile("works", file));
    }
  }

  await prisma.portfolioWork.update({
    where: { id },
    data: { ...fields, mainPhoto, gallery: [...keptGallery, ...addedGallery] },
  });

  revalidatePath("/admin/roboty");
  revalidatePath("/[locale]/roboty", "page");
  revalidatePath("/[locale]/roboty/[slug]", "page");
  redirect("/admin/roboty");
}

export async function deleteWork(id: string) {
  const work = await prisma.portfolioWork.findUniqueOrThrow({ where: { id } });

  await deleteFile(work.mainPhoto);
  for (const key of work.gallery) {
    await deleteFile(key);
  }

  await prisma.portfolioWork.delete({ where: { id } });

  revalidatePath("/admin/roboty");
  revalidatePath("/[locale]/roboty", "page");
}
