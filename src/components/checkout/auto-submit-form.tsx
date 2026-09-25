"use client";

import { useEffect } from "react";

/**
 * `<script>`, вставлений через dangerouslySetInnerHTML, браузер НЕ виконує —
 * це стандартна поведінка DOM (script-теги, додані через innerHTML, залишаються
 * інертними). Через це автосабміт на сторінку оплати WayForPay не спрацьовував,
 * і треба було тиснути кнопку вручну. `useEffect` — правильний спосіб виконати
 * побічну дію (сабміт форми) після монтування.
 */
export function AutoSubmitForm({ formId }: { formId: string }) {
  useEffect(() => {
    const form = document.getElementById(formId);
    if (form instanceof HTMLFormElement) {
      form.submit();
    }
  }, [formId]);

  return null;
}
