import { signOut } from "@/lib/auth";
import { AdminSidebarNav } from "@/components/admin/sidebar-nav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-page-bg overflow-hidden">
      <aside className="w-64 h-full shrink-0 bg-white border-r border-navy/10 flex flex-col">
        <div className="p-6 border-b border-navy/10">
          <p className="font-heading font-extrabold text-lg text-navy">
            Адмін-панель
          </p>
          <p className="text-xs text-navy-soft mt-1">Вікторія Лемешко</p>
        </div>

        <AdminSidebarNav />

        <div className="p-4 shrink-0">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full rounded-button border border-navy/18 px-4 py-2 text-sm font-bold text-navy transition-colors hover:border-magenta hover:text-magenta focus:outline-none focus:ring-4 focus:ring-magenta/20"
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
