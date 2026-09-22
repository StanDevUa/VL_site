"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { LocaleTabs, type LocaleSuffix } from "@/components/admin/locale-tabs";
import { FieldError } from "@/components/admin/field-error";
import { primaryButtonClass, secondaryButtonClass } from "@/components/ui/button-styles";
import type { FormState } from "@/server/actions/form-state";

type ExistingFaqEntry = {
  questionUk: string;
  questionEn: string | null;
  questionRu: string | null;
  answerUk: string;
  answerEn: string | null;
  answerRu: string | null;
  showOnHome: boolean;
};

const inputClass =
  "w-full rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15";
const labelClass = "block text-sm font-bold text-navy mb-2";

export function FaqForm({
  action,
  existing,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  existing?: ExistingFaqEntry;
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
    <form action={formAction} noValidate className="max-w-3xl">
      <div className="rounded-card bg-white border border-navy/10 p-6 mb-8">
        <h2 className="font-heading font-bold text-lg text-navy mb-4">
          Питання та відповідь (три мовні версії)
        </h2>
        <LocaleTabs>
          {(suffix: LocaleSuffix) => (
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Питання{suffix === "Uk" && " *"}
                </label>
                <input
                  name={`question${suffix}`}
                  defaultValue={resolve(`question${suffix}`)}
                  onChange={
                    suffix === "Uk"
                      ? (e) => dismissOnFill("questionUk", e.target.value)
                      : undefined
                  }
                  className={inputClass}
                />
                {suffix === "Uk" && <FieldError message={errorFor("questionUk")} />}
              </div>
              <div>
                <label className={labelClass}>
                  Відповідь{suffix === "Uk" && " *"}
                </label>
                <textarea
                  name={`answer${suffix}`}
                  defaultValue={resolve(`answer${suffix}`)}
                  onChange={
                    suffix === "Uk" ? (e) => dismissOnFill("answerUk", e.target.value) : undefined
                  }
                  rows={4}
                  className={inputClass}
                />
                {suffix === "Uk" && <FieldError message={errorFor("answerUk")} />}
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
        <button type="submit" disabled={isPending} className={primaryButtonClass}>
          {isPending ? "Зберігаємо…" : "Зберегти"}
        </button>
        <Link href="/admin/faq" className={secondaryButtonClass}>
          Скасувати
        </Link>
      </div>
    </form>
  );
}
