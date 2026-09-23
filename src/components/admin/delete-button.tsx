"use client";

export function DeleteButton({
  action,
  confirmText = "Точно видалити? Це не можна скасувати.",
  disabled = false,
  disabledReason,
}: {
  action: () => void;
  confirmText?: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  if (disabled) {
    return (
      <span
        className="text-sm font-bold text-navy-soft/50 cursor-not-allowed"
        title={disabledReason}
      >
        Видалити
      </span>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      className="contents"
    >
      <button
        type="submit"
        className="appearance-none bg-transparent border-0 p-0 m-0 font-body text-sm font-bold text-red-600 hover:underline"
      >
        Видалити
      </button>
    </form>
  );
}
