"use client";

import { useActionState, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { FieldError } from "@/components/admin/field-error";
import { Link } from "@/i18n/navigation";
import { submitFaqQuestion } from "@/server/actions/faq-question";

const inputClass =
  "w-full rounded-field border-[1.5px] border-navy/16 bg-white px-4 py-[14px] text-base text-navy outline-none transition-[border-color,box-shadow] duration-[250ms] ease-in-out focus:border-magenta focus:ring-4 focus:ring-magenta/[.12]";
const labelClass = "mb-2 block text-sm font-bold text-navy";

function AskForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("HomeFaq");
  const [state, formAction, isPending] = useActionState(submitFaqQuestion, undefined);
  const resolve = (key: string) => state?.values?.[key] ?? "";
  const errorFor = (key: string) => state?.fieldErrors?.[key];

  if (state?.success) {
    return (
      <div className="text-center">
        <span className="mb-[22px] inline-flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-indigo/10 text-indigo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
        <div className="mb-3.5 font-heading text-[26px] leading-[1.2] font-extrabold text-navy">
          {t("thankYouTitle")}
        </div>
        <p className="mb-7 text-base leading-[1.7] text-navy-soft">{t("thankYouText")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-1.5 pr-11 font-heading text-2xl leading-[1.2] font-extrabold text-navy">
        {t("modalTitle")}
      </div>
      <p className="mb-4 text-[15.5px] leading-[1.65] text-navy-soft">{t("modalSubtitle")}</p>
      <form action={formAction} noValidate className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>{t("labelName")}</label>
          <input
            name="name"
            defaultValue={resolve("name")}
            placeholder={t("placeholderName")}
            className={inputClass}
          />
          <FieldError message={errorFor("name")} />
        </div>
        <div>
          <label className={labelClass}>{t("labelEmail")}</label>
          <input
            type="email"
            name="email"
            defaultValue={resolve("email")}
            placeholder={t("placeholderEmail")}
            className={inputClass}
          />
          <FieldError message={errorFor("email")} />
        </div>
        <div>
          <label className={labelClass}>{t("labelQuestion")}</label>
          <textarea
            name="question"
            defaultValue={resolve("question")}
            rows={3}
            placeholder={t("placeholderQuestion")}
            className={`${inputClass} resize-y`}
          />
          <FieldError message={errorFor("question")} />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-1 rounded-field bg-indigo px-6 py-4 font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
        >
          {isPending ? t("submitting") : t("submit")}
        </button>
        <div className="text-center text-[13px] leading-[1.55] text-navy-soft">
          {t.rich("disclaimer", {
            privacy: (chunks) => (
              <Link
                href="/legal/pryvatnist"
                onClick={onClose}
                className="border-b border-blue/40 text-blue hover:text-magenta"
              >
                {chunks}
              </Link>
            ),
          })}
        </div>
      </form>
    </>
  );
}

export function AskQuestionModal({
  trigger,
}: {
  /** Дозволяє викликати цю ж модалку з іншим (не типовим) тригером — напр. текстовим лінком на сторінці правового документа. */
  trigger?: (open: () => void) => ReactNode;
}) {
  const t = useTranslations("HomeFaq");
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger ? (
        trigger(() => setOpen(true))
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-block w-full rounded-field bg-indigo px-[30px] py-4 text-center font-heading text-base font-bold text-white shadow-button transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-[3px] hover:bg-indigo-hover hover:shadow-[0_20px_38px_-14px_rgba(82,82,172,.34)] sm:w-auto"
        >
          {t("ctaAsk")}
        </button>
      )}

      {open &&
        createPortal(
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[96] flex items-center justify-center bg-[#1A2450]/72 p-6 backdrop-blur-[4px]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-[min(520px,100%)] overflow-y-auto rounded-block bg-white px-5 pt-7 pb-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.5)] sm:px-[38px] sm:pt-8 sm:pb-7"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                title={t("closeAria")}
                className="absolute top-4 right-4 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border-[1.5px] border-navy/14 bg-transparent text-navy-soft transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <AskForm onClose={() => setOpen(false)} />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
