"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { FieldError } from "@/components/admin/field-error";
import { Link } from "@/i18n/navigation";
import { submitConsultationRequest } from "@/server/actions/consultation-request";

const inputClass =
  "w-full rounded-field border-[1.5px] border-navy/16 bg-white px-4 py-[14px] text-base text-navy outline-none transition-[border-color,box-shadow] duration-[250ms] ease-in-out focus:border-magenta focus:ring-4 focus:ring-magenta/[.12]";
const labelClass = "mb-2 block text-sm font-bold text-navy";

export function CtaForm() {
  const t = useTranslations("HomeCta");
  const [state, formAction, isPending] = useActionState(submitConsultationRequest, undefined);
  const [dismissed, setDismissed] = useState(false);
  const resolve = (key: string) => state?.values?.[key] ?? "";
  const errorFor = (key: string) => state?.fieldErrors?.[key];

  return (
    <>
      <form
        action={formAction}
        noValidate
        className="flex flex-col gap-4 rounded-card bg-[rgba(255,253,252,.97)] px-8 py-[34px]"
      >
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
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>{t("labelPhone")}</label>
            <input
              type="tel"
              name="phone"
              defaultValue={resolve("phone")}
              placeholder={t("placeholderPhone")}
              className={inputClass}
            />
            <FieldError message={errorFor("phone")} />
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
        </div>
        <div>
          <label className={labelClass}>{t("labelComment")}</label>
          <textarea
            name="comment"
            defaultValue={resolve("comment")}
            rows={3}
            placeholder={t("placeholderComment")}
            className={`${inputClass} resize-y`}
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="mt-1.5 rounded-field bg-indigo px-6 py-[17px] font-heading text-[17px] font-bold text-white shadow-[0_14px_30px_-14px_rgba(82,82,172,.34)] transition-[translate,box-shadow] duration-[250ms] ease-in-out hover:-translate-y-0.5 hover:bg-indigo-hover hover:shadow-[0_20px_36px_-16px_rgba(82,82,172,.34)]"
        >
          {isPending ? t("submitting") : t("submit")}
        </button>
        <div className="text-center text-[13px] leading-[1.55] text-navy-soft">
          {t.rich("disclaimer", {
            privacy: (chunks) => (
              <Link href="/legal/pryvatnist" className="border-b border-blue/40 text-blue hover:text-magenta">
                {chunks}
              </Link>
            ),
          })}
        </div>
      </form>

      {state?.success && !dismissed && (
        <div
          onClick={() => setDismissed(true)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-[#1A2450]/72 p-7 backdrop-blur-[4px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[min(520px,100%)] rounded-block bg-white px-10 pt-11 pb-9 text-center shadow-[0_40px_80px_-30px_rgba(0,0,0,.5)]"
          >
            <span className="mb-[22px] inline-flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-indigo/10 text-indigo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <div className="mb-3.5 font-heading text-[26px] leading-[1.2] font-extrabold text-navy">
              {t("thankYouTitle")}
            </div>
            <p className="mb-7 text-base leading-[1.7] text-navy-soft">{t("thankYouText")}</p>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded-field bg-indigo px-[34px] py-[15px] font-heading text-base font-bold text-white transition-colors duration-[250ms] ease-in-out hover:bg-indigo-hover"
            >
              {t("closeButton")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
