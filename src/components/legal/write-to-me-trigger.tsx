"use client";

import { useTranslations } from "next-intl";
import { AskQuestionModal } from "@/components/home/ask-question-modal";

/**
 * Функцію-тригер не можна передати пропсом із серверного page.tsx в клієнтський
 * AskQuestionModal (RSC-межа не серіалізує функції) — тому цей маленький клієнтський
 * компонент сам створює trigger і монтує ту саму модалку, що й "Задати питання" в FAQ.
 */
export function LegalWriteToMeTrigger() {
  const t = useTranslations("Legal");
  return (
    <AskQuestionModal
      trigger={(open) => (
        <button
          type="button"
          onClick={open}
          className="border-b border-magenta/40 font-heading text-[14.5px] font-bold text-navy transition-colors duration-200 ease-in-out hover:border-magenta hover:text-magenta"
        >
          {t("writeToMe")}
        </button>
      )}
    />
  );
}
