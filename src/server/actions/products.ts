"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { slugify, uniqueSlug } from "@/lib/slugify";
import { extractTextValues, type FormState } from "./form-state";

async function generateUniqueSlug(nameUk: string, excludeId?: string) {
  const base = slugify(nameUk);
  const existing = await prisma.product.findMany({
    where: excludeId ? { id: { not: excludeId } } : undefined,
    select: { slug: true },
  });
  return uniqueSlug(base, new Set(existing.map((p) => p.slug)));
}

function readFields(formData: FormData) {
  return {
    nameUk: (formData.get("nameUk") as string)?.trim(),
    nameEn: (formData.get("nameEn") as string)?.trim() || null,
    nameRu: (formData.get("nameRu") as string)?.trim() || null,
    categoryId: (formData.get("categoryId") as string)?.trim(),
    priceRaw: (formData.get("price") as string)?.trim(),
    productTypeUk: (formData.get("productTypeUk") as string)?.trim(),
    productTypeEn: (formData.get("productTypeEn") as string)?.trim() || null,
    productTypeRu: (formData.get("productTypeRu") as string)?.trim() || null,
    specsUk: (formData.get("specsUk") as string)?.trim(),
    specsEn: (formData.get("specsEn") as string)?.trim() || null,
    specsRu: (formData.get("specsRu") as string)?.trim() || null,
    descriptionUk: (formData.get("descriptionUk") as string)?.trim(),
    descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
    descriptionRu: (formData.get("descriptionRu") as string)?.trim() || null,
    showOnHome: formData.get("showOnHome") === "on",
  };
}

function validate(fields: ReturnType<typeof readFields>) {
  const fieldErrors: Record<string, string> = {};
  if (!fields.nameUk) fieldErrors.nameUk = "Введіть назву українською.";
  if (!fields.categoryId) fieldErrors.categoryId = "Оберіть категорію.";
  const price = Number(fields.priceRaw);
  if (!fields.priceRaw || !Number.isFinite(price) || price <= 0) {
    fieldErrors.price = "Введіть коректну ціну (більше 0).";
  }
  if (!fields.productTypeUk) fieldErrors.productTypeUk = "Введіть тип товару українською.";
  if (!fields.specsUk) fieldErrors.specsUk = "Введіть склад/комплектацію українською.";
  if (!fields.descriptionUk) fieldErrors.descriptionUk = "Введіть опис українською.";
  return fieldErrors;
}

export async function createProduct(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { priceRaw, ...fields } = readFields(formData);
  const mainPhotoFile = formData.get("mainPhoto") as File | null;

  const fieldErrors = validate({ priceRaw, ...fields });
  if (!mainPhotoFile || mainPhotoFile.size === 0) fieldErrors.mainPhoto = "Додайте головне фото.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  const mainPhoto = await uploadFile("products", mainPhotoFile!);

  const galleryFiles = formData.getAll("gallery") as File[];
  const gallery: string[] = [];
  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      gallery.push(await uploadFile("products", file));
    }
  }

  const slug = await generateUniqueSlug(fields.nameUk);

  await prisma.product.create({
    data: { ...fields, price: priceRaw, slug, mainPhoto, gallery },
  });

  revalidatePath("/admin/tovary");
  redirect("/admin/tovary");
}

export async function updateProduct(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const { priceRaw, ...fields } = readFields(formData);
  const fieldErrors = validate({ priceRaw, ...fields });

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  const current = await prisma.product.findUniqueOrThrow({ where: { id } });

  const mainPhotoFile = formData.get("mainPhoto") as File | null;
  let mainPhoto = current.mainPhoto;
  if (mainPhotoFile && mainPhotoFile.size > 0) {
    mainPhoto = await uploadFile("products", mainPhotoFile);
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
      addedGallery.push(await uploadFile("products", file));
    }
  }

  await prisma.product.update({
    where: { id },
    data: { ...fields, price: priceRaw, mainPhoto, gallery: [...keptGallery, ...addedGallery] },
  });

  revalidatePath("/admin/tovary");
  redirect("/admin/tovary");
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUniqueOrThrow({ where: { id } });

  await deleteFile(product.mainPhoto);
  for (const key of product.gallery) {
    await deleteFile(key);
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/admin/tovary");
}
