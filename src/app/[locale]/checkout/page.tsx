"use client";

import { useActionState, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart-context";
import { getCartProducts } from "@/server/actions/cart";
import { createOrder } from "@/server/actions/checkout";
import { pickLocalized } from "@/lib/i18n-content";
import { formatPrice } from "@/lib/format-price";
import { formatPhone } from "@/lib/format-phone";
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
  "w-full rounded-field border-[1.5px] border-navy/16 bg-white px-4 py-3.5 text-base text-navy outline-none transition-shadow duration-200 ease-in-out focus:border-magenta focus:shadow-[0_0_0_4px_rgba(201,48,124,.12)]";
const labelClass = "mb-2 block text-sm font-bold text-navy";
const cardClass = "rounded-[16px] border border-navy/12 bg-white px-[26px] pt-[26px] pb-7";

export default function CheckoutPage() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Checkout");
  const [products, setProducts] = useState<CartProduct[] | null>(null);
  const [agree, setAgree] = useState(false);
  const { items } = useCart();
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

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [phone, setPhone] = useState(() => formatPhone(resolve("recipientPhone")));
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    setDismissed(new Set());
    setPhone(formatPhone(resolve("recipientPhone")));
  }
  const errorFor = (key: string) => (dismissed.has(key) ? undefined : state?.fieldErrors?.[key]);
  const dismissOnFill = (key: string, value: string) => {
    if (value.trim() === "") return;
    setDismissed((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  const payDisabled = !agree || items.length === 0 || isPending;

  return (
    <main className="bg-white">
      <section
        className="relative px-[18px] pt-12 pb-12 sm:px-6 sm:pt-[52px] sm:pb-[90px] lg:px-8"
        style={{ background: "linear-gradient(180deg, #FBEFEC 0%, rgba(251,239,236,0) 46%)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[130px] -right-[110px] h-[420px] w-[420px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, rgba(242,102,47,.16), rgba(201,48,124,.09) 55%, rgba(43,107,184,0) 72%)",
            animation: "vlPulse 12s ease-in-out infinite",
          }}
        />

        <div className="relative mx-auto max-w-[1240px]">
          <div className="mb-3 text-sm font-bold tracking-[1.6px] text-coral uppercase">{t("eyebrow")}</div>
          <h1 className="mb-7 font-heading text-[40px] leading-[1.1] font-extrabold tracking-[-.9px] text-navy">
            {t("pageTitle")}
          </h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center rounded-[16px] border border-navy/12 bg-white/90 px-8 py-[72px] text-center">
              <p className="mb-[26px] max-w-[420px] text-base leading-[1.65] text-navy-soft">
                {t("emptyCart")}
              </p>
              <Link
                href="/shop"
                className="rounded-button bg-indigo px-8 py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
              >
                {t("emptyCartCta")}
              </Link>
            </div>
          ) : !visibleProducts ? null : (
            <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.65fr_1fr] lg:gap-9">
              <form
                id="checkout-form"
                action={formAction}
                noValidate
                className="flex flex-col gap-[26px]"
              >
                <input type="hidden" name="cartItems" value={JSON.stringify(items)} />

                <div className={cardClass}>
                  <div className="mb-5 font-heading text-xl font-extrabold text-navy">
                    {t("contactTitle")}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>
                        {t("recipientName")} <span className="text-[#C0322C]">*</span>
                      </label>
                      <input
                        name="recipientName"
                        defaultValue={resolve("recipientName")}
                        placeholder={t("recipientNamePlaceholder")}
                        onChange={(e) => dismissOnFill("recipientName", e.target.value)}
                        className={inputClass}
                      />
                      <FieldError message={errorFor("recipientName")} />
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("recipientPhone")} <span className="text-[#C0322C]">*</span>
                      </label>
                      <input
                        name="recipientPhone"
                        type="tel"
                        value={phone}
                        placeholder={t("recipientPhonePlaceholder")}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          setPhone(formatted);
                          dismissOnFill("recipientPhone", formatted);
                        }}
                        className={inputClass}
                      />
                      <FieldError message={errorFor("recipientPhone")} />
                    </div>
                    <div>
                      <label className={labelClass}>
                        {t("recipientEmail")} <span className="text-[#C0322C]">*</span>
                      </label>
                      <input
                        name="recipientEmail"
                        type="email"
                        defaultValue={resolve("recipientEmail")}
                        placeholder={t("recipientEmailPlaceholder")}
                        onChange={(e) => dismissOnFill("recipientEmail", e.target.value)}
                        className={inputClass}
                      />
                      <FieldError message={errorFor("recipientEmail")} />
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <div className="mb-1.5 font-heading text-xl font-extrabold text-navy">
                    {t("deliveryTitle")}
                  </div>
                  <p className="mb-5 text-[14.5px] leading-[1.6] text-navy-soft">
                    {t("deliverySubtitle")}
                  </p>
                  <div className="flex flex-col gap-4">
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
                      onCityInput={(value) => dismissOnFill("novaPoshtaCityName", value)}
                      onWarehouseInput={(value) => dismissOnFill("novaPoshtaWarehouseName", value)}
                    />
                    <FieldError message={errorFor("novaPoshtaCityName")} />
                    <FieldError message={errorFor("novaPoshtaWarehouseName")} />
                    <div>
                      <label className={labelClass}>{t("comment")}</label>
                      <textarea
                        name="comment"
                        defaultValue={resolve("comment")}
                        placeholder={t("commentPlaceholder")}
                        rows={2}
                        className={`${inputClass} resize-y`}
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div
                className="rounded-[16px] border border-navy/12 px-[26px] pt-[26px] pb-7 lg:sticky lg:top-[110px]"
                style={{ background: "linear-gradient(170deg, rgba(251,239,236,.8), rgba(255,253,252,.97))" }}
              >
                <div className="mb-[18px] font-heading text-xl font-extrabold text-navy">
                  {t("summaryTitle")}
                </div>

                <div className="mb-[18px] flex flex-col gap-3">
                  {visibleProducts.map((p) => {
                    const qty = quantityFor(p.id);
                    return (
                      <div key={p.id} className="flex items-start justify-between gap-3.5">
                        <div className="min-w-0">
                          <div className="text-[15px] leading-[1.35] font-semibold text-navy">
                            {pickLocalized(p, "name", locale)}
                          </div>
                          <div className="mt-0.5 text-[13.5px] text-navy-soft">
                            {t("qtyLabel", { qty, price: formatPrice(p.price) })}
                          </div>
                        </div>
                        <div className="font-heading text-[15px] font-bold whitespace-nowrap text-navy">
                          {formatPrice(Number(p.price) * qty)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mb-[18px] rounded-[10px] bg-powder-beige/85 px-3.5 py-3 text-[13.5px] leading-[1.55] text-navy-soft">
                  {t("deliveryCostNote")}
                </div>

                <div className="mb-[18px] h-px bg-navy/12" />

                <div className="mb-5 flex items-baseline justify-between gap-3">
                  <span className="font-heading text-base font-bold text-navy">{t("totalToPay")}</span>
                  <span className="whitespace-nowrap font-heading text-[28px] font-extrabold tracking-[-.6px] text-navy">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <label className="mb-[18px] flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    name="consent"
                    form="checkout-form"
                    checked={agree}
                    onChange={(e) => {
                      setAgree(e.target.checked);
                      if (e.target.checked) dismissOnFill("consent", "on");
                    }}
                    className="mt-0.5 h-[19px] w-[19px] shrink-0 accent-indigo"
                  />
                  <span className="text-[13.5px] leading-[1.6] text-navy-soft">
                    {t.rich("consent", {
                      delivery: (chunks) => (
                        <Link href="/legal/dostavka" className="border-b border-blue/40 text-blue hover:text-magenta">
                          {chunks}
                        </Link>
                      ),
                      returns: (chunks) => (
                        <Link href="/legal/povernennia" className="border-b border-blue/40 text-blue hover:text-magenta">
                          {chunks}
                        </Link>
                      ),
                      privacy: (chunks) => (
                        <Link href="/legal/pryvatnist" className="border-b border-blue/40 text-blue hover:text-magenta">
                          {chunks}
                        </Link>
                      ),
                    })}
                  </span>
                </label>
                <FieldError message={errorFor("consent")} />
                <FieldError message={errorFor("cart")} />

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={payDisabled}
                  style={{ background: payDisabled ? "rgba(82,82,172,.4)" : "#5252AC" }}
                  className="w-full rounded-button border-0 py-4 font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out disabled:cursor-not-allowed"
                >
                  {isPending ? t("submitting") : t("payLabel", { sum: formatPrice(subtotal) })}
                </button>

                <div className="mt-4 flex items-center justify-center gap-3">
                  <Image src="/visa.png" alt="Visa" width={30} height={30} className="h-[30px] w-auto" />
                  <Image src="/mastercard.png" alt="Mastercard" width={36} height={36} className="h-9 w-auto" />
                  <span className="text-[12.5px] text-navy-soft">{t("securePayment")}</span>
                </div>

                <Link
                  href="/cart"
                  className="mt-3 flex items-center justify-center gap-2.5 rounded-button border-[1.5px] border-navy/18 px-6 py-3.5 font-heading text-[15px] font-bold text-navy transition-[border-color,color] duration-[250ms] ease-in-out hover:border-magenta hover:text-magenta"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {t("backToCart")}
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
