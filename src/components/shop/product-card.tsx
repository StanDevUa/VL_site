import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { pickLocalized } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format-price";
import { CATEGORY_BADGE_GRADIENT } from "@/lib/category-badge";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import type { AppLocale } from "@/i18n/routing";

type ProductCardData = {
  id: string;
  slug: string;
  photoUrl: string;
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
  photoHeight = 210,
}: {
  product: ProductCardData;
  locale: AppLocale;
  /** 210px — каталог (`/shop`), 190px — «Рекомендовані товари» на сторінці товару (точні значення з відповідних макетів). */
  photoHeight?: 210 | 190;
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-card border border-navy/12 bg-white transition-[box-shadow,border-color] duration-[250ms] ease-in-out hover:border-magenta/30 hover:shadow-[0_22px_40px_-28px_rgba(30,42,90,.35)]">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block bg-navy/5"
        style={{ height: photoHeight }}
      >
        <Image
          src={product.photoUrl}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <span
          className="absolute top-3 left-3 rounded-[7px] px-2.5 py-[5px] text-[11.5px] font-bold tracking-[.5px] text-white uppercase"
          style={{ background: CATEGORY_BADGE_GRADIENT }}
        >
          {pickLocalized(product.category, "name", locale)}
        </span>
      </Link>
      <div className="flex flex-1 flex-col pt-5 pr-[22px] pb-[22px] pl-[22px]">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="mb-2 font-heading text-[17px] leading-[1.3] font-bold text-navy transition-colors group-hover:text-magenta">
            {pickLocalized(product, "name", locale)}
          </h3>
        </Link>
        <p className="mb-4 text-sm leading-[1.5] text-navy-soft">
          {pickLocalized(product, "productType", locale)}
        </p>
        <div className="mt-auto flex min-h-[42px] items-center justify-between gap-3">
          <p className="whitespace-nowrap font-heading text-[19px] font-extrabold text-navy">
            {formatPrice(product.price)}
          </p>
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  );
}
