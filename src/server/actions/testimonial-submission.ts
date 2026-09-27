"use server";

import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/mail";
import { extractTextValues, type FormState } from "./form-state";

export type SubmitTestimonialState = (FormState & { success?: boolean }) | undefined;

function readFields(formData: FormData) {
  return {
    name: (formData.get("name") as string)?.trim(),
    text: (formData.get("text") as string)?.trim(),
  };
}

async function validate(fields: ReturnType<typeof readFields>) {
  const t = await getTranslations("HomeReviews");
  const fieldErrors: Record<string, string> = {};
  if (!fields.name) fieldErrors.name = t("errorName");
  if (!fields.text) fieldErrors.text = t("errorText");
  return fieldErrors;
}

/**
 * Створює відгук ОДРАЗУ в реальній таблиці Testimonial (не окрема черга) —
 * showOnHome:false тут і є фактична "модерація", бо іншого способу показати
 * відгук на сайті нема (лише ця таблиця + прапорець). authorDescriptionUk
 * навмисно порожній рядок — Вікторія дозаповнює сама в адмінці перед
 * публікацією, у формі на сайті цього поля немає.
 */
export async function submitTestimonial(
  _prevState: SubmitTestimonialState,
  formData: FormData,
): Promise<SubmitTestimonialState> {
  const fields = readFields(formData);
  const fieldErrors = await validate(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  await prisma.testimonial.create({
    data: {
      author: fields.name,
      authorDescriptionUk: "",
      textUk: fields.text,
      showOnHome: false,
    },
  });

  try {
    await sendNotificationEmail({
      subject: `Новий відгук на сайті від ${fields.name}`,
      text: `Ім'я: ${fields.name}\n\nВідгук:\n${fields.text}\n\nВідгук збережено як прихований — щоб опублікувати, відкрийте його в адмінці та увімкніть "Показувати на головній сторінці".`,
    });
  } catch (error) {
    console.error("Не вдалося надіслати email-сповіщення про новий відгук:", error);
  }

  return { success: true };
}
