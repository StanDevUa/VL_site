import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Головна" },
  { href: "/admin/roboty", label: "Мої роботи" },
  // наступні розділи додаються сюди по мірі готовності:
  // Новини, Товари, Категорії, Замовлення, Відгуки, Дипломи, FAQ
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex bg-page-bg">
      <aside className="w-64 shrink-0 bg-white border-r border-navy/10 flex flex-col">
        <div className="p-6 border-b border-navy/10">
          <p className="font-heading font-extrabold text-lg text-navy">
            Адмін-панель
          </p>
          <p className="text-xs text-navy-soft mt-1">Вікторія Лемешко</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-field px-4 py-3 text-sm font-bold text-navy hover:bg-powder-pink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-navy/10">
          <p className="text-xs text-navy-soft mb-2 truncate">
            {session?.user?.email}
          </p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-button border border-navy/15 px-4 py-2 text-sm font-bold text-navy hover:border-indigo hover:text-indigo"
            >
              Вийти
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
