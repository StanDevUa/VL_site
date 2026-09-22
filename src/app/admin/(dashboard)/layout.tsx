import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

const NAV = [
  { href: "/admin", label: "Головна" },
  { href: "/admin/roboty", label: "Мої роботи" },
  { href: "/admin/novyny", label: "Новини та анонси" },
  { href: "/admin/vidguky", label: "Відгуки" },
  // наступні розділи додаються сюди по мірі готовності:
  // Товари, Категорії, Замовлення, Дипломи, FAQ
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="h-screen flex bg-page-bg overflow-hidden">
      <aside className="w-64 h-full shrink-0 bg-white border-r border-navy/10 flex flex-col">
        <div className="p-6 border-b border-navy/10">
          <p className="font-heading font-extrabold text-lg text-navy">
            Адмін-панель
          </p>
          <p className="text-xs text-navy-soft mt-1">Вікторія Лемешко</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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

        <div className="p-4 border-t border-navy/10 shrink-0">
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
              className="w-full rounded-button border border-navy/18 px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-indigo hover:text-indigo active:bg-indigo active:text-white active:border-indigo focus:outline-none focus:ring-4 focus:ring-indigo/20"
            >
              Вийти
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 min-w-0 h-full overflow-y-auto p-8">{children}</main>
    </div>
  );
}
