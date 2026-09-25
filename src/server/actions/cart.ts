"use server";

import { prisma } from "@/lib/prisma";
import { getPublicUrl } from "@/lib/storage";

/**
 * Кошик зберігається в localStorage як {productId, quantity}[] — цей екшен
 * підвантажує актуальні дані товарів (назва/фото/ціна) з БД для відображення
 * на сторінках кошика й чекауту.
 */
export async function getCartProducts(ids: string[]) {
  if (ids.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      slug: true,
      mainPhoto: true,
      price: true,
      nameUk: true,
      nameEn: true,
      nameRu: true,
      category: { select: { nameUk: true, nameEn: true, nameRu: true } },
    },
  });

  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    nameUk: p.nameUk,
    nameEn: p.nameEn,
    nameRu: p.nameRu,
    price: p.price.toString(),
    mainPhotoUrl: getPublicUrl(p.mainPhoto)!,
    category: p.category,
  }));
}
