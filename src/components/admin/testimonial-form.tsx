"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { FieldError } from "@/components/admin/field-error";
import type { FormState } from "@/server/actions/form-state";

type ExistingTestimonial = {
  author: string;
  authorDescriptionUk: string;
  authorDescriptionEn: string | null;
  authorDescriptionRu: string | null;
  textUk: string;
  textEn: string | null;
  textRu: string | null;
  showOnHome: boolean;
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

export function TestimonialForm({
  action,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  existing?: ExistingTestimonial;
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
    <form action={formAction} noValidate className="max-w-3xl @container">
      <div className="rounded-card bg-white border border-navy/10 p-6 mb-6">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">Автор</h2>
        <div>
          <label className={labelClass}>Ім&apos;я *</label>
          <input
            name="author"
            defaultValue={resolve("author")}
            onChange={(e) => dismissOnFill("author", e.target.value)}
            placeholder="Наприклад, Олена"
            className={inputClass}
          />
          <FieldError message={errorFor("author")} />
          <p className="text-xs text-navy-soft mt-1">Не перекладається, одне ім&apos;я на всі мови.</p>
        </div>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-6">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Текст (три мовні версії)
        </h2>
        <LocaleTabs>
          {(suffix: LocaleSuffix) => (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Опис автора (напр. «мама Максима, 6 років»)
                  {suffix === "Uk" && " *"}
                </label>
                <input
                  name={`authorDescription${suffix}`}
                  defaultValue={resolve(`authorDescription${suffix}`)}
                  onChange={
                    suffix === "Uk"
                      ? (e) => dismissOnFill("authorDescriptionUk", e.target.value)
                      : undefined
                  }
                  className={inputClass}
                />
                {suffix === "Uk" && <FieldError message={errorFor("authorDescriptionUk")} />}
              </div>
              <div>
                <label className={labelClass}>
                  Текст відгуку{suffix === "Uk" && " *"}
                </label>
                <textarea
                  name={`text${suffix}`}
                  defaultValue={resolve(`text${suffix}`)}
                  onChange={
                    suffix === "Uk" ? (e) => dismissOnFill("textUk", e.target.value) : undefined
                  }
                  rows={4}
                  className={inputClass}
                />
                {suffix === "Uk" && <FieldError message={errorFor("textUk")} />}
              </div>
            </div>
          )}
        </LocaleTabs>
      </div>

      <div className="rounded-card bg-white border border-navy/10 p-6 mb-8">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="showOnHome"
            defaultChecked={existing?.showOnHome ?? false}
            className="w-5 h-5 rounded accent-indigo"
          />
          <span className="font-bold text-navy">Показувати на головній сторінці</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-button bg-indigo px-8 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover disabled:opacity-60"
        >
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link
          href="/admin/vidguky"
          className="rounded-button border border-navy/15 px-8 py-3 font-heading font-bold text-navy hover:border-indigo hover:text-indigo transition-colors"
        >
          Скасувати
        </Link>
      </div>
    </form>
  );
}
