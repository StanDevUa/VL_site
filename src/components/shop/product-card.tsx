import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getPublicUrl } from "@/lib/storage";
import { pickLocalized } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format-price";
import { CATEGORY_BADGE_GRADIENT } from "@/lib/category-badge";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import type { AppLocale } from "@/i18n/routing";

type ProductCardData = {
  id: string;
  slug: string;
  mainPhoto: string;
  price: string | number;
  nameUk: string;
  nameEn: string | null;
  nameRu: string | null;
  productTypeUk: string;
  productTypeEn: string | null;
  productTypeRu: string | null;
  category: { nameUk: string; nameEn: string | null; nameRu: string | null };
};

export function ProductCard({
  product,
  locale,
}: {
  product: ProductCardData;
  locale: AppLocale;
}) {
  return (
    <div className="group flex flex-col rounded-card bg-white border border-navy/10 overflow-hidden transition-shadow hover:shadow-card-hover">
      <Link href={`/shop/${product.slug}`} className="relative block h-[210px] bg-navy/5">
        <Image
          src={getPublicUrl(product.mainPhoto)!}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <span
          className="absolute top-3 left-3 text-[11.5px] font-bold uppercase tracking-wide text-white px-2.5 py-1.5 rounded-[7px]"
          style={{ background: CATEGORY_BADGE_GRADIENT }}
        >
          {pickLocalized(product.category, "name", locale)}
        </span>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-heading font-bold text-lg text-navy mb-1 group-hover:text-magenta transition-colors">
            {pickLocalized(product, "name", locale)}
          </h3>
        </Link>
        <p className="text-sm text-navy-soft mb-4 line-clamp-2">
          {pickLocalized(product, "productType", locale)}
        </p>
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <p className="font-heading font-extrabold text-lg text-navy">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
