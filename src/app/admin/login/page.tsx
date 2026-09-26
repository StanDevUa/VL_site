import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

async function authenticate(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw error;
  }
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-page-bg p-6">
      <form
        action={authenticate}
        className="w-full max-w-sm rounded-block bg-white border border-navy/10 p-8 shadow-card-hover"
      >
        <h1 className="font-heading font-extrabold text-2xl text-navy mb-1">
          Адмін-панель
        </h1>
        <p className="text-sm text-navy-soft mb-6">
          Вхід для Вікторії Лемешко
        </p>

        {error && (
          <p className="mb-4 rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">
            Невірний логін або пароль.
          </p>
        )}

        <label className="block text-sm font-bold text-navy mb-2" htmlFor="email">
          Логін
        </label>
        <input
          id="email"
          name="email"
          type="text"
          required
          className="w-full mb-4 rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15"
        />

        <label className="block text-sm font-bold text-navy mb-2" htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full mb-6 rounded-field border border-navy/15 px-4 py-3 text-navy outline-none focus:border-indigo focus:ring-4 focus:ring-indigo/15"
        />

        <button
          type="submit"
          className="w-full rounded-button bg-indigo px-6 py-3 font-heading font-bold text-white shadow-button transition-colors hover:bg-indigo-hover"
        >
          Увійти
        </button>
      </form>
    </main>
  );
}
