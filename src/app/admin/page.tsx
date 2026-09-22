import { auth, signOut } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-page-bg p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading font-extrabold text-2xl text-navy">
            Адмін-панель
          </h1>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-button border border-navy/15 px-4 py-2 text-sm font-bold text-navy hover:border-indigo hover:text-indigo"
            >
              Вийти
            </button>
          </form>
        </div>

        <p className="text-navy-soft">
          Увійшли як {session?.user?.email}. Розділи (категорії, товари,
          замовлення, роботи, новини, відгуки, дипломи, FAQ) — наступний крок.
        </p>
      </div>
    </main>
  );
}
