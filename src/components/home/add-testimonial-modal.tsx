"use client";

import { useActionState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { FieldError } from "@/components/admin/field-error";
import { submitTestimonial } from "@/server/actions/testimonial-submission";

const inputClass =
  "w-full rounded-field border-[1.5px] border-navy/16 bg-white px-4 py-[14px] text-base text-navy outline-none transition-[border-color,box-shadow] duration-[250ms] ease-in-out focus:border-magenta focus:ring-4 focus:ring-magenta/[.12]";
const labelClass = "mb-2 block text-sm font-bold text-navy";

function AddTestimonialForm() {
  const t = useTranslations("HomeReviews");
  const [state, formAction, isPending] = useActionState(submitTestimonial, undefined);
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
          {t("addThankYouTitle")}
        </div>
        <p className="mb-7 text-base leading-[1.7] text-navy-soft">{t("addThankYouText")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-1.5 pr-11 font-heading text-2xl leading-[1.2] font-extrabold text-navy">
        {t("addModalTitle")}
      </div>
      <p className="mb-4 text-[15.5px] leading-[1.65] text-navy-soft">{t("addModalSubtitle")}</p>
      <form action={formAction} noValidate className="flex flex-col gap-3">
        <div>
          <label className={labelClass}>{t("addLabelName")}</label>
          <input
            name="name"
            defaultValue={resolve("name")}
            placeholder={t("addPlaceholderName")}
            className={inputClass}
          />
          <FieldError message={errorFor("name")} />
        </div>
        <div>
          <label className={labelClass}>{t("addLabelText")}</label>
          <textarea
            name="text"
            defaultValue={resolve("text")}
            rows={4}
            placeholder={t("addPlaceholderText")}
            className={`${inputClass} resize-y`}
          />
          <FieldError message={errorFor("text")} />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-1 rounded-field bg-indigo px-6 py-4 font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
        >
          {isPending ? t("addSubmitting") : t("addSubmit")}
        </button>
      </form>
    </>
  );
}

/** Керується ззовні (open/onClose), а не власним станом — кнопка-тригер
 * рендериться у ДВОХ різних місцях розмітки (десктоп/мобільна верстка
 * каруселі відгуків), тож стан модалки має жити в спільному предку. */
export function AddTestimonialModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("HomeReviews");

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[96] flex items-center justify-center bg-[#1A2450]/72 p-6 backdrop-blur-[4px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-[min(520px,100%)] overflow-y-auto rounded-block bg-white px-5 pt-7 pb-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,.5)] sm:px-[38px] sm:pt-8 sm:pb-7"
      >
        <button
          type="button"
          onClick={onClose}
          title={t("closeAria")}
          className="absolute top-4 right-4 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] border-[1.5px] border-navy/14 bg-transparent text-navy-soft transition-[border-color,color] duration-200 ease-in-out hover:border-magenta hover:text-magenta"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <AddTestimonialForm />
      </div>
    </div>,
    document.body,
  );
}
