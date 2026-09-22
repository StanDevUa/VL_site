"use client";

export function DeleteButton({
  action,
  confirmText = "Точно видалити? Це не можна скасувати.",
}: {
  action: () => void;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="text-sm font-bold text-red-600 hover:underline"
      >
        Видалити
      </button>
    </form>
  );
}
