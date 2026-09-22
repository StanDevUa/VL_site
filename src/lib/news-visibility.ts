import type { Prisma } from "@prisma/client";

/**
 * Новина видима публічно лише коли настав її `date` — це і є механізм
 * "публікації за розкладом": без cron чи фонових задач, просто фільтр
 * на читанні (architecture.md, розділ 5.5).
 */
export function publishedNewsWhere(
  extra: Prisma.NewsPostWhereInput = {},
): Prisma.NewsPostWhereInput {
  return { ...extra, date: { lte: new Date() } };
}
