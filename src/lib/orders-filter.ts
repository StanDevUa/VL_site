import { Prisma, OrderStatus } from "@prisma/client";

export type OrdersFilterParams = {
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  categoryId?: string;
  productId?: string;
};

/**
 * Спільна логіка фільтрів для списку замовлень в адмінці й для експорту —
 * щоб експорт завжди відповідав тому, що адмін бачить на екрані.
 */
export function buildOrdersWhere(
  { dateFrom, dateTo, status, categoryId, productId }: OrdersFilterParams,
  validCategoryIds: Set<string>,
  validProductIds: Set<string>,
): Prisma.OrderWhereInput {
  const activeStatus =
    status && Object.values(OrderStatus).includes(status as OrderStatus)
      ? (status as OrderStatus)
      : undefined;
  const activeCategoryId = categoryId && validCategoryIds.has(categoryId) ? categoryId : undefined;
  const activeProductId = productId && validProductIds.has(productId) ? productId : undefined;

  const andConditions: Prisma.OrderWhereInput[] = [];
  if (activeStatus) andConditions.push({ status: activeStatus });
  if (dateFrom) andConditions.push({ createdAt: { gte: new Date(dateFrom) } });
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    andConditions.push({ createdAt: { lte: end } });
  }
  if (activeProductId) {
    andConditions.push({ items: { some: { productId: activeProductId } } });
  } else if (activeCategoryId) {
    andConditions.push({ items: { some: { product: { categoryId: activeCategoryId } } } });
  }

  return andConditions.length > 0 ? { AND: andConditions } : {};
}
