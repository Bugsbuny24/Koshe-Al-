import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { UNIVERSITY_TEMPLATES } from "@/lib/data/university-templates";
import { createUniversityAction } from "./actions";
import { LANGUAGE_FACULTY } from "@/lib/data/academic-catalog";

export default async function AdminDashboard() {
  const supabase = await createClient();

  let univCount = 0, facultyCount = 0, programCount = 0,
      courseCount = 0, enrollmentCount = 0, awardCount = 0;

  // Language system counts — always available (no DB required)
  const langProgramCount = LANGUAGE_FACULTY.programs.length;
  const langCourseCount = LANGUAGE_FACULTY.programs.reduce(
    (a, p) => a + p.courses.length,
    0
  );
  const langUnitCount = LANGUAGE_FACULTY.programs.reduce(
    (a, p) => a + p.courses.reduce((b, c) => b + c.units.length, 0),
    0
  );

  try {
    const [r1, r2, r3, r4, r5, r6] = await Promise.all([
      supabase.from("universities").select("*", { count: "exact", head: true }),
      supabase.from("faculties").select("*", { count: "exact", head: true }),
      supabase.from("programs").select("*", { count: "exact", head: true }),
      supabase.from("academic_courses").select("*", { count: "exact", head: true }),
      supabase.from("student_program_enrollments").select("*", { count: "exact", head: true }),
      supabase.from("student_awards").select("*", { count: "exact", head: true }),
    ]);
    univCount = r1.count ?? 0;
    facultyCount = r2.count ?? 0;
    programCount = r3.count ?? 0;
    courseCount = r4.count ?? 0;
    enrollmentCount = r5.count ?? 0;
    awardCount = r6.count ?? 0;
  } catch {
    // Academic tables may not exist yet — show zeros until migration is applied
  }

  const stats = [
    { label: "Üniversiteler",   value: univCount,       icon: "🎓", href: "/admin/universities" },
    { label: "Fakülteler",      value: facultyCount,    icon: "🏛️", href: "/admin/faculties" },
    { label: "Programlar",      value: programCount,    icon: "📚", href: "/admin/programs" },
    { label: "Dersler",         value: courseCount,     icon: "📖", href: "/admin/courses" },
    { label: "Kayıtlı Öğrenci", value: enrollmentCount, icon: "👥", href: "/admin/students" },
    { label: "Verilen Ödül",    value: awardCount,      icon: "🏆", href: "/admin/rewards" },
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
          <Link href="/admin/overview" className="soft-button text-sm py-2 px-4">
            📋 Genel Bakış
          </Link>
        </div>
      </div>

      {/* ── Language Faculty — Runtime Data ──────────────────────────────────── */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">
            {LANGUAGE_FACULTY.icon} {LANGUAGE_FACULTY.name}
          </h2>
          <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-400">
            Runtime · Aktif
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-5">
          Mevcut dil öğrenme sistemi. Bu veri template değil — gerçek öğrenci
          deneyiminin kaynağı.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Dil Programı", value: langProgramCount },
            { label: "CEFR Kurs",    value: langCourseCount },
            { label: "Toplam Ünite", value: langUnitCount },
          ].map((s) => (
            <div key={s.label} className="panel-dark p-4 text-center rounded-xl">
              <p className="text-2xl font-bold text-cyan-300">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LANGUAGE_FACULTY.programs.slice(0, 8).map((prog) => (
            <div key={prog.slug} className="panel-dark p-3 rounded-xl">
              <p className="text-white text-sm font-medium">{prog.title}</p>
              <p className="text-xs text-slate-500 mt-1">
                {prog.courses.length} kurs · {prog.difficultyLabel}
              </p>
            </div>
          ))}
          {LANGUAGE_FACULTY.programs.length > 8 && (
            <div className="panel-dark p-3 rounded-xl flex items-center justify-center">
              <p className="text-xs text-slate-500">
                +{LANGUAGE_FACULTY.programs.length - 8} dil programı
              </p>
            </div>
          )}
        </div>
        <Link
          href="/admin/curriculum"
          className="mt-4 inline-block text-xs text-cyan-400 hover:underline"
        >
          Tam müfredat görünümü →
        </Link>
      </div>

      {/* University Templates — clearly labeled as DEMO/SEED */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Üniversite Şablonları
          </h2>
          <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-xs text-amber-400">
            Demo · Seed Helper
          </span>
        </div>
        <p className="text-slate-400 text-sm mb-2">
          Bunlar <strong className="text-slate-300">demo/seed şablonlarıdır</strong> — runtime source of truth değil.
          Şablon yükle butonu sadece bir kez kullan; gerçek veri DB'dedir.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {UNIVERSITY_TEMPLATES.map((template) => (
            <div key={template.code} className="panel-dark p-4 rounded-xl border border-amber-400/10">
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
                <input type="hidden" name="country" value={template.country} />
                <input type="hidden" name="description" value={template.description} />
                <input type="hidden" name="active" value="true" />
                <button
                  type="submit"
                  className="soft-button text-xs py-1.5 px-3 w-full"
                >
                  Şablon Yükle (Seed)
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
