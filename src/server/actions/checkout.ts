"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/order-number";
import { extractTextValues, type FormState } from "./form-state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CartItemInput = { productId: string; quantity: number };

function readFields(formData: FormData) {
  return {
    recipientName: (formData.get("recipientName") as string)?.trim(),
    recipientPhone: (formData.get("recipientPhone") as string)?.trim(),
    recipientEmail: (formData.get("recipientEmail") as string)?.trim(),
    novaPoshtaCityName: (formData.get("novaPoshtaCityName") as string)?.trim(),
    novaPoshtaWarehouseName: (formData.get("novaPoshtaWarehouseName") as string)?.trim(),
    comment: (formData.get("comment") as string)?.trim() || null,
    consent: formData.get("consent") === "on",
  };
}

function parseCartItems(formData: FormData): CartItemInput[] {
  try {
    const raw = JSON.parse((formData.get("cartItems") as string) || "[]");
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(
        (i): i is CartItemInput =>
          i && typeof i.productId === "string" && Number.isFinite(i.quantity) && i.quantity > 0,
      )
      .map((i) => ({ productId: i.productId, quantity: i.quantity }));
  } catch {
    return [];
  }
}

export async function createOrder(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const fields = readFields(formData);
  const cartItems = parseCartItems(formData);

  const fieldErrors: Record<string, string> = {};
  if (!fields.recipientName) fieldErrors.recipientName = "Введіть ім'я та прізвище.";
  if (!fields.recipientPhone) fieldErrors.recipientPhone = "Введіть номер телефону.";
  if (!fields.recipientEmail || !EMAIL_RE.test(fields.recipientEmail)) {
    fieldErrors.recipientEmail = "Введіть коректний email.";
  }
  if (!fields.novaPoshtaCityName) fieldErrors.novaPoshtaCityName = "Введіть місто.";
  if (!fields.novaPoshtaWarehouseName) {
    fieldErrors.novaPoshtaWarehouseName = "Введіть відділення Нової пошти.";
  }
  if (!fields.consent) {
    fieldErrors.consent = "Потрібно погодитись з умовами, щоб оформити замовлення.";
  }
  if (cartItems.length === 0) {
    fieldErrors.cart = "Кошик порожній.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors, values: extractTextValues(formData) };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: cartItems.map((i) => i.productId) } },
  });

  const orderItems = cartItems
    .map((ci) => {
      const product = products.find((p) => p.id === ci.productId);
      if (!product) return null;
      return {
        productId: product.id,
        nameUkSnapshot: product.nameUk,
        priceSnapshot: product.price,
        quantity: ci.quantity,
      };
    })
    .filter((i) => i !== null);

  if (orderItems.length === 0) {
    return {
      fieldErrors: { cart: "Товари з кошика більше не доступні." },
      values: extractTextValues(formData),
    };
  }

  const subtotal = orderItems.reduce(
    (sum, i) => sum + Number(i.priceSnapshot) * i.quantity,
    0,
  );

  // Акаунт покупця створюється автоматично за email, без пароля
  // (architecture.md, розділ 5.3) — якщо email уже є, використовуємо наявний User.
  let user = await prisma.user.findUnique({ where: { email: fields.recipientEmail } });
  if (!user) {
    user = await prisma.user.create({ data: { email: fields.recipientEmail } });
  }
  await prisma.userRoleAssignment.upsert({
    where: { userId_role: { userId: user.id, role: "PURCHASER" } },
    create: { userId: user.id, role: "PURCHASER" },
    update: {},
  });

  // novaPoshtaCityRef/WarehouseRef поки порожні — реальні Ref-и з'являться,
  // коли підключимо API Нової пошти; до того Вікторія створює ТТН вручну
  // за вписаними тут назвою міста й відділення (не потребує Ref).
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: user.id,
      status: "PENDING_PAYMENT",
      subtotal: subtotal.toFixed(2),
      recipientName: fields.recipientName,
      recipientPhone: fields.recipientPhone,
      recipientEmail: fields.recipientEmail,
      novaPoshtaCityRef: "",
      novaPoshtaCityName: fields.novaPoshtaCityName,
      novaPoshtaWarehouseRef: "",
      novaPoshtaWarehouseName: fields.novaPoshtaWarehouseName,
      comment: fields.comment,
      items: { create: orderItems },
    },
  });

  redirect(`/checkout/pay?order=${order.orderNumber}`);
}

/** Статус читаємо з БД, а не з query-параметрів редиректу — їм не можна довіряти. */
export async function getOrderStatus(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: { status: true, novaPoshtaCityName: true, novaPoshtaWarehouseName: true },
  });
  return order;
}
