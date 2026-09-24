import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { pickLocalized } from "@/lib/i18n-content";
import type { AppLocale } from "@/i18n/routing";
import { ReviewsCarousel } from "./reviews-carousel";

export async function ReviewsSection() {
  const locale = (await getLocale()) as AppLocale;
  const testimonials = await prisma.testimonial.findMany({
    where: { showOnHome: true },
    orderBy: { createdAt: "asc" },
  });

  if (testimonials.length === 0) return null;

  const reviews = testimonials.map((t) => ({
    text: pickLocalized(t, "text", locale),
    name: t.author,
    detail: pickLocalized(t, "authorDescription", locale),
  }));

  return <ReviewsCarousel reviews={reviews} />;
}
