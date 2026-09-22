"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { extractTextValues, type FormState } from "./form-state";

function readFields(formData: FormData) {
  return {
    captionUk: (formData.get("captionUk") as string)?.trim() || null,
    captionEn: (formData.get("captionEn") as string)?.trim() || null,
    captionRu: (formData.get("captionRu") as string)?.trim() || null,
    showOnSite: formData.get("showOnSite") === "on",
  };
}

export async function createDiploma(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);

  const imageFile = formData.get("image") as File | null;
  if (!imageFile || imageFile.size === 0) {
    return { fieldErrors: { image: "Додайте фото диплома." }, values: extractTextValues(formData) };
  }
  const image = await uploadFile("diplomas", imageFile);

  await prisma.diploma.create({ data: { ...fields, image } });

  revalidatePath("/admin/dyplomy");
  redirect("/admin/dyplomy");
}

export async function updateDiploma(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const current = await prisma.diploma.findUniqueOrThrow({ where: { id } });

  const imageFile = formData.get("image") as File | null;
  let image = current.image;
  if (imageFile && imageFile.size > 0) {
    image = await uploadFile("diplomas", imageFile);
    await deleteFile(current.image);
  }

  await prisma.diploma.update({ where: { id }, data: { ...fields, image } });

  revalidatePath("/admin/dyplomy");
  redirect("/admin/dyplomy");
}

export async function deleteDiploma(id: string) {
  const diploma = await prisma.diploma.findUniqueOrThrow({ where: { id } });
  await deleteFile(diploma.image);
  await prisma.diploma.delete({ where: { id } });
  revalidatePath("/admin/dyplomy");
}
