import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const p = profile as { role: string; full_name: string | null } | null;

  if (!p || p.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="glass-card p-10 text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="section-title mb-3">Erişim Reddedildi</h1>
          <p className="text-slate-400 mb-6">
            Bu alana erişim için admin yetkisi gereklidir.
          </p>
          <Link href="/dashboard" className="primary-button">
            Dashboard&apos;a Dön
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/admin",            label: "Dashboard",    icon: "🏛️" },
    { href: "/admin/overview",   label: "Genel Bakış",  icon: "📋" },
    { href: "/admin/universities", label: "Üniversiteler", icon: "🎓" },
    { href: "/admin/faculties",  label: "Fakülteler",   icon: "🏛️" },
    { href: "/admin/programs",   label: "Programlar",   icon: "📚" },
    { href: "/admin/courses",    label: "Dersler",      icon: "📖" },
    { href: "/admin/curriculum", label: "Müfredat",     icon: "🗺️" },
    { href: "/admin/students",   label: "Öğrenciler",   icon: "👥" },
    { href: "/admin/rewards",    label: "Ödüller",      icon: "🏆" },
    { href: "/admin/credits",    label: "Credits",      icon: "💳" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col fixed inset-y-0 z-50 border-r border-white/10 bg-black/30 backdrop-blur-xl pt-16">
        <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
          <div className="px-3 pb-4 mb-2 border-b border-white/10">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
              Admin Panel
            </p>
            <p className="mt-1 text-sm text-white font-medium">
              {p.full_name || user.email}
            </p>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div className="mt-auto pt-4 border-t border-white/10">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Dashboard&apos;a Dön</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile top nav */}
      <nav className="lg:hidden fixed top-16 left-0 right-0 z-40 border-b border-white/10 bg-black/50 backdrop-blur-xl overflow-x-auto">
        <div className="flex gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
