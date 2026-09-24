"use client";

import { useActionState, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { getCartProducts } from "@/server/actions/cart";
import { createOrder } from "@/server/actions/checkout";
import { pickLocalized } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format-price";
import { FieldError } from "@/components/admin/field-error";
import { NovaPoshtaFields } from "@/components/checkout/nova-poshta-fields";
import type { AppLocale } from "@/i18n/routing";
import type { FormState } from "@/server/actions/form-state";

type CartProduct = {
  id: string;
  slug: string;
  nameUk: string;
  nameEn: string | null;
  nameRu: string | null;
  price: string;
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

export default function CheckoutPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Checkout");
  const common = useTranslations("Common");
  const { items } = useCart();
  const [products, setProducts] = useState<CartProduct[] | null>(null);
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    createOrder,
    undefined,
  );

  useEffect(() => {
    const ids = items.map((i) => i.productId);
    if (ids.length === 0) return;
    let cancelled = false;
    getCartProducts(ids).then((data) => {
      if (!cancelled) setProducts(data);
    });
    return () => {
      cancelled = true;
    };
  }, [items]);

  const visibleProducts = products?.filter((p) => items.some((i) => i.productId === p.id));
  const quantityFor = (productId: string) =>
    items.find((i) => i.productId === productId)?.quantity ?? 0;
  const subtotal =
    visibleProducts?.reduce((sum, p) => sum + Number(p.price) * quantityFor(p.id), 0) ?? 0;

  const resolve = (key: string) => state?.values?.[key] ?? "";
  const errorFor = (key: string) => state?.fieldErrors?.[key];

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="font-heading font-extrabold text-3xl text-navy mb-6">{t("pageTitle")}</h1>
        <p className="text-navy-soft mb-6">{t("emptyCart")}</p>
        <Link
          href="/shop"
          className="font-bold text-sm text-navy border-b-2 border-indigo/40 hover:border-indigo"
        >
          {common("toShop")}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-8 py-16">
      <h1 className="font-heading font-extrabold text-3xl text-navy mb-10">{t("pageTitle")}</h1>

      <form action={formAction} noValidate className="space-y-8">
        <input type="hidden" name="cartItems" value={JSON.stringify(items)} />

        <div className="rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">{t("contactTitle")}</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>{t("recipientName")}</label>
              <input name="recipientName" defaultValue={resolve("recipientName")} className={inputClass} />
              <FieldError message={errorFor("recipientName")} />
            </div>
            <div>
              <label className={labelClass}>{t("recipientPhone")}</label>
              <input name="recipientPhone" defaultValue={resolve("recipientPhone")} className={inputClass} />
              <FieldError message={errorFor("recipientPhone")} />
            </div>
            <div>
              <label className={labelClass}>{t("recipientEmail")}</label>
              <input
                name="recipientEmail"
                type="email"
                defaultValue={resolve("recipientEmail")}
                className={inputClass}
              />
              <FieldError message={errorFor("recipientEmail")} />
            </div>
          </div>
        </div>

        <div className="rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">{t("deliveryTitle")}</h2>
          <div className="space-y-4">
            <NovaPoshtaFields
              cityLabel={t("city")}
              warehouseLabel={t("warehouse")}
              cityPlaceholder={t("cityPlaceholder")}
              warehousePlaceholder={t("warehousePlaceholder")}
              warehouseDisabledHint={t("warehouseDisabledHint")}
              defaultCityName={resolve("novaPoshtaCityName")}
              defaultCityRef={resolve("novaPoshtaCityRef")}
              defaultWarehouseName={resolve("novaPoshtaWarehouseName")}
              defaultWarehouseRef={resolve("novaPoshtaWarehouseRef")}
            />
            <FieldError message={errorFor("novaPoshtaCityName")} />
            <FieldError message={errorFor("novaPoshtaWarehouseName")} />
            <div>
              <label className={labelClass}>{t("comment")}</label>
              <textarea
                name="comment"
                defaultValue={resolve("comment")}
                rows={3}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">{t("summaryTitle")}</h2>
          {visibleProducts && (
            <div className="space-y-2 mb-4">
              {visibleProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-navy-soft">
                    {pickLocalized(p, "name", locale)} × {quantityFor(p.id)}
                  </span>
                  <span className="font-bold text-navy">
                    {formatPrice(Number(p.price) * quantityFor(p.id))}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between border-t border-navy/10 pt-4">
            <p className="font-bold text-navy">{t("subtotal")}</p>
            <p className="font-heading font-extrabold text-xl text-navy">{formatPrice(subtotal)}</p>
          </div>
          <p className="text-sm text-navy-soft mt-2">{t("deliveryHint")}</p>
          <FieldError message={errorFor("cart")} />
        </div>

        <div className="rounded-card bg-white border border-navy/10 p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="consent"
              defaultChecked={resolve("consent") === "on"}
              className="w-5 h-5 rounded accent-indigo mt-0.5"
            />
            <span className="text-sm text-navy-soft">{t("consent")}</span>
          </label>
          <FieldError message={errorFor("consent")} />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-button bg-indigo px-8 py-3.5 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover disabled:opacity-60"
        >
          {isPending ? t("submitting") : t("submit")}
        </button>
      </form>
    </main>
  );
}
