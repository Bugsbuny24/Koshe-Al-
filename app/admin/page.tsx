import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { UNIVERSITY_TEMPLATES } from "@/lib/data/university-templates";
import { createUniversityAction } from "./actions";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: univCount },
    { count: facultyCount },
    { count: programCount },
    { count: courseCount },
    { count: enrollmentCount },
    { count: awardCount },
  ] = await Promise.all([
    supabase.from("universities").select("*", { count: "exact", head: true }),
    supabase.from("faculties").select("*", { count: "exact", head: true }),
    supabase.from("programs").select("*", { count: "exact", head: true }),
    supabase
      .from("academic_courses")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("student_program_enrollments")
      .select("*", { count: "exact", head: true }),
    supabase
      .from("student_awards")
      .select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Üniversiteler",
      value: univCount ?? 0,
      icon: "🎓",
      href: "/admin/universities",
    },
    {
      label: "Fakülteler",
      value: facultyCount ?? 0,
      icon: "🏛️",
      href: "/admin/faculties",
    },
    {
      label: "Programlar",
      value: programCount ?? 0,
      icon: "📚",
      href: "/admin/programs",
    },
    {
      label: "Dersler",
      value: courseCount ?? 0,
      icon: "📖",
      href: "/admin/courses",
    },
    {
      label: "Kayıtlı Öğrenci",
      value: enrollmentCount ?? 0,
      icon: "👥",
      href: "/admin/students",
    },
    {
      label: "Verilen Ödül",
      value: awardCount ?? 0,
      icon: "🏆",
      href: "/admin/rewards",
    },
  ];

  const quickLinks = [
    { href: "/admin/universities/new", label: "Yeni Üniversite", icon: "+" },
    { href: "/admin/faculties/new", label: "Yeni Fakülte", icon: "+" },
    { href: "/admin/programs/new", label: "Yeni Program", icon: "+" },
    { href: "/admin/courses/new", label: "Yeni Ders", icon: "+" },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Admin Panel"
        title="Yönetim Paneli"
        description="Üniversite sistemini yönetin ve içerikleri düzenleyin"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="glass-card p-5 hover:border-cyan-400/30 transition-colors group"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="metric-value text-2xl">{stat.value}</p>
            <p className="metric-label text-xs mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="glass-card p-6">
        <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-4">
          Hızlı İşlemler
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="primary-button text-sm py-2 px-4"
            >
              {link.icon} {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* University Templates */}
      <div className="glass-card p-6">
        <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-2">
          Üniversite Şablonları
        </h2>
        <p className="text-slate-400 text-sm mb-5">
          Hazır üniversite şablonlarını yükleyerek veritabanını hızlıca
          doldurun.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNIVERSITY_TEMPLATES.map((template) => (
            <div key={template.code} className="panel-dark p-4 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white text-sm font-medium">
                    {template.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {template.code} · {template.country}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {template.description}
              </p>
              <p className="text-xs text-cyan-400/70 mb-3">
                İlham: {template.inspired_by}
              </p>
              <div className="flex gap-2 text-xs text-slate-500 mb-3">
                <span>{template.faculties.length} Fakülte</span>
                <span>·</span>
                <span>
                  {template.faculties.reduce(
                    (a, f) => a + f.departments.length,
                    0
                  )}{" "}
                  Bölüm
                </span>
              </div>
              <form action={createUniversityAction}>
                <input type="hidden" name="name" value={template.name} />
                <input type="hidden" name="code" value={template.code} />
                <input
                  type="hidden"
                  name="country"
                  value={template.country}
                />
                <input
                  type="hidden"
                  name="description"
                  value={template.description}
                />
                <input type="hidden" name="active" value="true" />
                <button
                  type="submit"
                  className="soft-button text-xs py-1.5 px-3 w-full"
                >
                  Şablon Yükle
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
