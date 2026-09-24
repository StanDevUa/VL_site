"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { PhotoPicker } from "@/components/admin/photo-picker";
import { GalleryPicker } from "@/components/admin/gallery-picker";
import { CustomSelect } from "@/components/admin/custom-select";
import { FieldError } from "@/components/admin/field-error";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import type { FormState } from "@/server/actions/form-state";

type ExistingProduct = {
  nameUk: string;
  nameEn: string | null;
  nameRu: string | null;
  categoryId: string;
  price: string;
  productTypeUk: string;
  productTypeEn: string | null;
  productTypeRu: string | null;
  specsUk: string;
  specsEn: string | null;
  specsRu: string | null;
  descriptionUk: string;
  descriptionEn: string | null;
  descriptionRu: string | null;
  showOnHome: boolean;
  mainPhotoUrl: string;
  gallery: { key: string; url: string }[];
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

export function ProductForm({
  action,
  categories,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  categories: { id: string; nameUk: string }[];
  existing?: ExistingProduct;
}) {
  const fields = existing as unknown as Record<string, string | null> | undefined;
  const [state, formAction, isPending] = useActionState(action, undefined);
  const resolve = (key: string) => state?.values?.[key] ?? fields?.[key] ?? "";

  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    setDismissed(new Set());
  }
  const errorFor = (key: string) => (dismissed.has(key) ? undefined : state?.fieldErrors?.[key]);
  const dismissOnFill = (key: string, value: string) => {
    if (value.trim() === "") return;
    setDismissed((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  return (
    <form action={formAction} noValidate className="max-w-5xl @container">
      <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-6 mb-6 items-start">
        <div className="@2xl:col-span-2 rounded-card bg-white border border-navy/10 p-6">
          <h2 className="font-heading font-bold text-lg text-navy mb-4">
            Текст (три мовні версії)
          </h2>
          <LocaleTabs>
            {(suffix: LocaleSuffix) => (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Назва{suffix === "Uk" && " *"}</label>
                  <input
                    name={`name${suffix}`}
                    defaultValue={resolve(`name${suffix}`)}
                    onChange={
                      suffix === "Uk" ? (e) => dismissOnFill("nameUk", e.target.value) : undefined
                    }
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("nameUk")} />}
                </div>
                <div>
                  <label className={labelClass}>
                    Тип товару (коротко, напр. «пластикові картки»)
                    {suffix === "Uk" && " *"}
                  </label>
                  <input
                    name={`productType${suffix}`}
                    defaultValue={resolve(`productType${suffix}`)}
                    onChange={
                      suffix === "Uk"
                        ? (e) => dismissOnFill("productTypeUk", e.target.value)
                        : undefined
                    }
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("productTypeUk")} />}
                </div>
                <div>
                  <label className={labelClass}>
                    Склад / комплектація (коротко){suffix === "Uk" && " *"}
                  </label>
                  <input
                    name={`specs${suffix}`}
                    defaultValue={resolve(`specs${suffix}`)}
                    onChange={
                      suffix === "Uk" ? (e) => dismissOnFill("specsUk", e.target.value) : undefined
                    }
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("specsUk")} />}
                </div>
                <div>
                  <label className={labelClass}>Опис{suffix === "Uk" && " *"}</label>
                  <textarea
                    name={`description${suffix}`}
                    defaultValue={resolve(`description${suffix}`)}
                    onChange={
                      suffix === "Uk"
                        ? (e) => dismissOnFill("descriptionUk", e.target.value)
                        : undefined
                    }
                    rows={6}
                    className={inputClass}
                  />
                  {suffix === "Uk" && <FieldError message={errorFor("descriptionUk")} />}
                </div>
              </div>
            )}
          </LocaleTabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-card bg-white border border-navy/10 p-6">
            <h2 className="font-heading font-bold text-lg text-navy mb-4">Основне</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Категорія *</label>
                <CustomSelect
                  name="categoryId"
                  options={categories.map((c) => ({ value: c.id, label: c.nameUk }))}
                  defaultValue={resolve("categoryId")}
                  placeholder="Оберіть категорію"
                  onChange={(value) => dismissOnFill("categoryId", value)}
                />
                <FieldError message={errorFor("categoryId")} />
              </div>
              <div>
                <label className={labelClass}>Ціна, грн *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={resolve("price")}
                  onChange={(e) => dismissOnFill("price", e.target.value)}
                  className={inputClass}
                />
                <FieldError message={errorFor("price")} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="showOnHome"
                  defaultChecked={existing?.showOnHome ?? false}
                  className="w-5 h-5 rounded accent-indigo"
                />
                <span className="font-bold text-navy text-sm">Показувати на головній сторінці</span>
              </label>
            </div>
          </div>

          <div className="rounded-card bg-white border border-navy/10 p-6">
            <h2 className="font-heading font-bold text-lg text-navy mb-4">
              Головне фото {!existing && "*"}
            </h2>
            <PhotoPicker
              name="mainPhoto"
              existingUrl={existing?.mainPhotoUrl}
              required={!existing}
              error={errorFor("mainPhoto")}
              onPick={() => dismissOnFill("mainPhoto", "x")}
            />
          </div>
        </div>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-8">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Галерея (необов&apos;язково)
        </h2>
        <GalleryPicker existing={existing?.gallery ?? []} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link href="/admin/tovary" className={secondaryButtonClass}>
          Скасувати
        </Link>
      </div>
    </form>
  );
}
