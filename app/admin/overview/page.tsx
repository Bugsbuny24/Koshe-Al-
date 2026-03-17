import Link from "next/link";
import { SectionHeader } from "@/components/ui/Surface";

// ─── Static data — no DB needed ──────────────────────────────────────────────

const NEW_ROUTES = [
  { path: "/admin",                        label: "Admin Dashboard",              desc: "İstatistik kartları, hızlı işlemler, üniversite şablonu yükleme" },
  { path: "/admin/overview",               label: "Genel Bakış (bu sayfa)",       desc: "Yapılan tüm değişikliklerin kapsamlı listesi" },
  { path: "/admin/universities",           label: "Üniversiteler Listesi",         desc: "Tüm üniversiteleri listele, aktif/pasif filtrele" },
  { path: "/admin/universities/new",       label: "Yeni Üniversite",               desc: "Form ile üniversite oluştur" },
  { path: "/admin/universities/[id]/edit", label: "Üniversite Düzenle",            desc: "Mevcut üniversiteyi güncelle veya sil" },
  { path: "/admin/faculties",              label: "Fakülteler Listesi",            desc: "Fakülte türü (Dil 🌐 / Generic 📚) badge'i ile listeleme" },
  { path: "/admin/faculties/new",          label: "Yeni Fakülte",                  desc: "faculty_type seçimi (language / generic) dahil form" },
  { path: "/admin/faculties/[id]/edit",    label: "Fakülte Düzenle",               desc: "faculty_type dahil tüm alanları güncelle" },
  { path: "/admin/programs",               label: "Programlar Listesi",            desc: "Derece tipi, kredi, süre bilgileri ile listeleme" },
  { path: "/admin/programs/new",           label: "Yeni Program",                  desc: "BA/BS/MA/MSc/PhD/Certificate/Diploma/Prep seçimi, prep/thesis/minor/honors flag'leri" },
  { path: "/admin/programs/[id]/edit",     label: "Program Düzenle",               desc: "Tüm program alanlarını güncelle" },
  { path: "/admin/courses",                label: "Dersler Listesi",               desc: "Akademik dersler, kredi, core/elective rozeti" },
  { path: "/admin/courses/new",            label: "Yeni Ders",                     desc: "Üniversite/fakülte/program bağlantısı, kredi, prerequisite kodları" },
  { path: "/admin/courses/[id]/edit",      label: "Ders Düzenle",                  desc: "Tüm ders alanlarını güncelle" },
  { path: "/admin/curriculum",             label: "Müfredat Görünümü",             desc: "Programlara göre gruplanmış müfredat haritası (read-only)" },
  { path: "/admin/students",               label: "Öğrenciler",                    desc: "Program kayıt özeti, GPA, tamamlanan kredi, durum" },
  { path: "/admin/rewards",                label: "Ödüller",                       desc: "Milestone türüne göre gruplanmış akademik ödüller" },
];

const NEW_DB_TABLES = [
  {
    name: "universities",
    desc: "Üst kurum — tüm hiyerarşinin başlangıç noktası",
    columns: "id, name, slug, code, description, country, website, logo_url, active",
  },
  {
    name: "faculties",
    desc: "Fakülte — university'ye bağlı; faculty_type='language' mevcut dil sistemini sarar",
    columns: "id, university_id, name, slug, code, faculty_type, description, dean_name, active",
  },
  {
    name: "departments",
    desc: "Bölüm — faculty'ye bağlı",
    columns: "id, faculty_id, university_id, name, slug, code, description, active",
  },
  {
    name: "programs",
    desc: "Lisans/yüksek lisans/sertifika programı",
    columns: "id, department_id, faculty_id, university_id, title, slug, code, degree_type, duration_years, total_courses, total_credits, min_gpa, language_of_instruction, has_prep_year, has_thesis, has_minor_option, has_honors_option, study_abroad_optional, description, active",
  },
  {
    name: "program_requirements",
    desc: "Harvard/MIT/Oxford tarzı program gereklilikleri (writing, quantitative, language, vb.)",
    columns: "id, program_id, requirement_type, title, description, min_credits, min_courses, is_mandatory, notes",
  },
  {
    name: "academic_courses",
    desc: "Generic akademik ders — program ve fakülteye bağlı",
    columns: "id, program_id, faculty_id, university_id, title, slug, code, credits, description, is_core, is_elective, level, semester, prerequisite_codes[], language_of_instruction, active",
  },
  {
    name: "course_modules",
    desc: "Ders içi modül — sıralı bölümler",
    columns: "id, course_id, title, description, order_index, duration_hours, active",
  },
  {
    name: "module_lessons",
    desc: "Modül içi ders — text/video/quiz/practice/speaking/project",
    columns: "id, module_id, title, description, order_index, content_type, duration_minutes, active",
  },
  {
    name: "degree_rules",
    desc: "Mezuniyet kuralları — program bazlı özel koşullar",
    columns: "id, program_id, rule_type, description, value",
  },
  {
    name: "student_program_enrollments",
    desc: "Öğrenci × Program kaydı — GPA, tamamlanan kredi, durum",
    columns: "id, user_id, program_id, university_id, enrollment_date, expected_graduation, status, gpa, completed_credits",
  },
  {
    name: "student_course_enrollments",
    desc: "Öğrenci × Akademik ders kaydı — not, skor, tamamlanma",
    columns: "id, user_id, course_id, program_enrollment_id, status, grade, score, completed_at",
  },
  {
    name: "student_transcript",
    desc: "Transkript satırı — tamamlanan her ders için kalıcı kayıt",
    columns: "id, user_id, university_id, program_id, course_id, course_code, course_title, credits, grade, score, semester, academic_year, completed_at",
  },
  {
    name: "student_awards",
    desc: "Akademik milestone ödülü — mevcut certificates ve collectible_rewards'a FK ile bağlı",
    columns: "id, user_id, milestone_type, title, description, program_id, course_id, university_id, badge_code, certificate_id→certificates, collectible_id→collectible_rewards",
  },
];

const BRIDGE_COLUMNS = [
  {
    table: "course_enrollments",
    column: "program_enrollment_id",
    target: "→ student_program_enrollments",
    desc: "Dil kursu kaydını akademik programa bağlar — mevcut kayıtlar NULL olarak kalır, hiçbir şey bozulmaz",
  },
  {
    table: "achievements",
    column: "academic_program_id",
    target: "→ programs",
    desc: "Language badge'ini akademik program milestone'una opsiyonel olarak bağlar",
  },
  {
    table: "achievements",
    column: "academic_milestone_type",
    target: "(text)",
    desc: "Hangi akademik milestone'dan tetiklendiğini belirtir (graduation, high_gpa, vb.)",
  },
  {
    table: "certificates",
    column: "academic_program_id",
    target: "→ programs",
    desc: "Sertifikayı üreten akademik programı belirtir — language certs etkilenmez",
  },
  {
    table: "profiles",
    column: "role",
    target: "(text, default: student)",
    desc: "Admin erişim kontrolü için — mevcut kullanıcılar 'student' varsayılanını alır",
  },
];

const NEW_TYPES = [
  { name: "DegreeType",                    file: "types/academic.ts", desc: "BA | BS | MA | MSc | PhD | Certificate | Diploma | Prep" },
  { name: "UniversityRow",                 file: "types/academic.ts", desc: "universities tablosu satır tipi" },
  { name: "FacultyRow",                    file: "types/academic.ts", desc: "faculty_type: 'language' | 'generic' discriminator dahil" },
  { name: "DepartmentRow",                 file: "types/academic.ts", desc: "departments tablosu satır tipi" },
  { name: "ProgramRow",                    file: "types/academic.ts", desc: "programs tablosu — tüm program metadata alanları" },
  { name: "RequirementType",               file: "types/academic.ts", desc: "18 requirement türü union type" },
  { name: "ProgramRequirementRow",         file: "types/academic.ts", desc: "program_requirements tablosu satır tipi" },
  { name: "AcademicCourseRow",             file: "types/academic.ts", desc: "academic_courses tablosu satır tipi" },
  { name: "CourseModuleRow",               file: "types/academic.ts", desc: "course_modules tablosu satır tipi" },
  { name: "ModuleLessonRow",               file: "types/academic.ts", desc: "module_lessons tablosu satır tipi" },
  { name: "DegreeRuleRow",                 file: "types/academic.ts", desc: "degree_rules tablosu satır tipi" },
  { name: "StudentProgramEnrollmentRow",   file: "types/academic.ts", desc: "student_program_enrollments satır tipi" },
  { name: "StudentCourseEnrollmentRow",    file: "types/academic.ts", desc: "student_course_enrollments satır tipi" },
  { name: "StudentTranscriptRow",          file: "types/academic.ts", desc: "student_transcript satır tipi" },
  { name: "AcademicMilestoneType",         file: "types/academic.ts", desc: "13 milestone türü union" },
  { name: "StudentAwardRow",               file: "types/academic.ts", desc: "student_awards — certificate_id ve collectible_id FK'li" },
  { name: "LanguageFacultyBridge",         file: "types/academic.ts", desc: "Dil sistemi ↔ Akademik fakülte köprü tipi" },
  { name: "UniversityTemplate",            file: "types/academic.ts", desc: "Admin şablon yükleme için nested seed data tipi" },
  { name: "Re-exports from university.ts", file: "types/academic.ts", desc: "EnrollmentRecord, AchievementRecord, CertificateRecord, CollectibleRewardRecord — kopyalanmadı" },
];

const UNIVERSITY_TEMPLATES = [
  { name: "Hartwell University",  inspired: "Harvard",   years: 4, credits: 128, courses: 32, faculties: 5, depts: 10 },
  { name: "Meridian Institute",   inspired: "MIT",       years: 4, credits: 180, courses: 40, faculties: 4, depts: 8  },
  { name: "Oxbridge University",  inspired: "Oxford",    years: 3, credits: 120, courses: 30, faculties: 4, depts: 8  },
  { name: "Stanfield University", inspired: "Stanford",  years: 4, credits: 180, courses: 45, faculties: 4, depts: 8  },
  { name: "Camberly University",  inspired: "Cambridge", years: 3, credits: 120, courses: 30, faculties: 4, depts: 8  },
  { name: "ODTA University",      inspired: "ODTÜ",      years: 4, credits: 240, courses: 50, faculties: 5, depts: 10 },
  { name: "BOUN University",      inspired: "Boğaziçi",  years: 4, credits: 160, courses: 40, faculties: 5, depts: 9  },
];

const CHANGED_FILES = [
  { path: "middleware.ts",                               change: "GÜNCELLEME",  desc: "/admin ve /admin/* korumalı route'lara eklendi" },
  { path: "types/academic.ts",                           change: "YENİ",        desc: "18 tip, shared types university.ts'den re-export edildi" },
  { path: "types/university.ts",                         change: "KORUNDU",     desc: "Mevcut dil-fakültesi domain tipleri dokunulmadan korundu" },
  { path: "supabase/migrations/…_academic_schema.sql",   change: "YENİ",        desc: "13 yeni tablo, köprü kolonları, RLS policy'leri, trigger'lar" },
  { path: "lib/data/university-templates.ts",            change: "YENİ",        desc: "7 üniversite şablonu, ~2400 satır seed data" },
  { path: "lib/utils/form-helpers.ts",                   change: "YENİ",        desc: "toSlug, toInt, toFloat — paylaşılan form yardımcıları" },
  { path: "app/admin/layout.tsx",                        change: "YENİ",        desc: "Admin layout — role kontrolü, sidebar, mobile nav" },
  { path: "app/admin/page.tsx",                          change: "YENİ",        desc: "Dashboard — istatistik + şablon yükleme + try/catch hata yönetimi" },
  { path: "app/admin/overview/page.tsx",                 change: "YENİ",        desc: "Bu sayfa — kapsamlı yapılanlar listesi" },
  { path: "app/admin/actions.ts",                        change: "YENİ",        desc: "Server actions — 12 CRUD action (üniversite/fakülte/program/ders)" },
  { path: "app/admin/components/DeleteButton.tsx",       change: "YENİ",        desc: "Confirm onaylı silme butonu (client component)" },
  { path: "app/admin/universities/page.tsx",             change: "YENİ",        desc: "Üniversite listesi" },
  { path: "app/admin/universities/new/page.tsx",         change: "YENİ",        desc: "Yeni üniversite formu" },
  { path: "app/admin/universities/[id]/edit/page.tsx",   change: "YENİ",        desc: "Üniversite düzenleme formu" },
  { path: "app/admin/faculties/page.tsx",                change: "YENİ",        desc: "Fakülte listesi, faculty_type badge'i" },
  { path: "app/admin/faculties/new/page.tsx",            change: "YENİ",        desc: "Yeni fakülte formu, faculty_type selector" },
  { path: "app/admin/faculties/[id]/edit/page.tsx",      change: "YENİ",        desc: "Fakülte düzenleme formu" },
  { path: "app/admin/programs/page.tsx",                 change: "YENİ",        desc: "Program listesi" },
  { path: "app/admin/programs/new/page.tsx",             change: "YENİ",        desc: "Yeni program formu — degree type, tüm flag'ler" },
  { path: "app/admin/programs/[id]/edit/page.tsx",       change: "YENİ",        desc: "Program düzenleme formu" },
  { path: "app/admin/courses/page.tsx",                  change: "YENİ",        desc: "Ders listesi, core/elective badge'leri" },
  { path: "app/admin/courses/new/page.tsx",              change: "YENİ",        desc: "Yeni ders formu — prerequisite_codes dahil" },
  { path: "app/admin/courses/[id]/edit/page.tsx",        change: "YENİ",        desc: "Ders düzenleme formu" },
  { path: "app/admin/curriculum/page.tsx",               change: "YENİ",        desc: "Müfredat haritası — programlara göre gruplu" },
  { path: "app/admin/students/page.tsx",                 change: "YENİ",        desc: "Öğrenci kayıt özeti" },
  { path: "app/admin/rewards/page.tsx",                  change: "YENİ",        desc: "Akademik ödüller listesi" },
];

const REQUIREMENT_TYPES = [
  "writing_requirement", "quantitative_requirement", "language_requirement",
  "general_education", "humanities_requirement", "social_science_requirement",
  "natural_science_requirement", "engineering_core", "communication_requirement",
  "internship_requirement", "thesis_requirement", "capstone_requirement",
  "honors_requirement", "elective_requirement", "minor_requirement",
  "concentration_requirement", "lab_requirement", "seminar_requirement",
];

const MILESTONE_TYPES = [
  "program_enrollment", "core_requirement_complete", "honors_complete",
  "capstone_complete", "high_gpa", "faculty_excellence", "distinction",
  "graduation", "program_milestone", "language_requirement_complete",
  "internship_complete", "thesis_submitted", "thesis_approved",
];

// ─── Component helpers ────────────────────────────────────────────────────────

function Badge({
  text,
  color,
}: {
  text: string;
  color: "cyan" | "purple" | "emerald" | "amber" | "slate";
}) {
  const cls: Record<string, string> = {
    cyan:    "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    purple:  "bg-purple-400/10 text-purple-300 border-purple-400/20",
    emerald: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    amber:   "bg-amber-400/10 text-amber-300 border-amber-400/20",
    slate:   "bg-slate-400/10 text-slate-400 border-slate-400/20",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls[color]}`}
    >
      {text}
    </span>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300 mb-5">
        <span>{icon}</span>
        <span>{title}</span>
      </h2>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OverviewPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="gradient-border glass-card p-6 sm:p-8">
        <SectionHeader
          eyebrow="Admin Panel — Genel Bakış"
          title="Yapılan Tüm Değişiklikler"
          description="Koshei AI University akademik altyapısının kapsamlı özeti — admin panel, veritabanı şeması, tip mimarisi ve şablonlar."
        />
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            📁 <strong className="text-white">27</strong> yeni/güncellenen dosya
          </span>
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            🗄️ <strong className="text-white">13</strong> yeni DB tablosu
          </span>
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            🔗 <strong className="text-white">5</strong> köprü kolonu (mevcut tablolara)
          </span>
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            🏷️ <strong className="text-white">19</strong> TypeScript tipi
          </span>
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            🎓 <strong className="text-white">7</strong> üniversite şablonu
          </span>
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            🛣️ <strong className="text-white">17</strong> yeni admin route
          </span>
          <span className="panel-dark px-3 py-1.5 rounded-xl text-xs">
            🔒 <strong className="text-white">RLS</strong> tüm yeni tablolarda aktif
          </span>
        </div>
      </div>

      {/* Changed files */}
      <SectionCard title="Değiştirilen / Eklenen Dosyalar (27 adet)" icon="📂">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-500 font-normal">
                  Dosya
                </th>
                <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-500 font-normal w-32">
                  Durum
                </th>
                <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-500 font-normal">
                  Açıklama
                </th>
              </tr>
            </thead>
            <tbody>
              {CHANGED_FILES.map((f) => (
                <tr key={f.path} className="border-b border-white/5">
                  <td className="py-2.5 pr-4 font-mono text-xs text-slate-300 whitespace-nowrap">
                    {f.path}
                  </td>
                  <td className="py-2.5 pr-4">
                    {f.change === "YENİ" && <Badge text="YENİ" color="emerald" />}
                    {f.change === "GÜNCELLEME" && <Badge text="GÜNCELLEME" color="cyan" />}
                    {f.change === "KORUNDU" && <Badge text="KORUNDU" color="slate" />}
                  </td>
                  <td className="py-2.5 text-xs text-slate-400">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Admin routes */}
      <SectionCard title="Admin Panel Route'ları (17 adet)" icon="🛣️">
        <div className="grid gap-2 sm:grid-cols-2">
          {NEW_ROUTES.map((r) => (
            <div key={r.path} className="panel-dark rounded-xl p-3.5">
              <code className="text-xs font-mono text-cyan-300">{r.path}</code>
              <p className="mt-1 text-xs font-medium text-white">{r.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{r.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin" className="soft-button text-xs">→ Dashboard</Link>
          <Link href="/admin/universities" className="soft-button text-xs">→ Üniversiteler</Link>
          <Link href="/admin/faculties" className="soft-button text-xs">→ Fakülteler</Link>
          <Link href="/admin/programs" className="soft-button text-xs">→ Programlar</Link>
          <Link href="/admin/courses" className="soft-button text-xs">→ Dersler</Link>
          <Link href="/admin/curriculum" className="soft-button text-xs">→ Müfredat</Link>
        </div>
      </SectionCard>

      {/* DB tables */}
      <SectionCard title="Yeni Veritabanı Tabloları (13 adet)" icon="🗄️">
        <div className="space-y-3">
          {NEW_DB_TABLES.map((t, i) => (
            <div key={t.name} className="panel-dark rounded-xl p-4">
              <div className="flex items-center gap-3 mb-1.5">
                <span className="text-xs text-slate-600 font-mono tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <code className="text-sm font-semibold text-white font-mono">
                  public.{t.name}
                </code>
              </div>
              <p className="text-xs text-slate-400 mb-2">{t.desc}</p>
              <p className="text-xs font-mono text-slate-600 leading-relaxed break-all">
                {t.columns}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Bridge columns */}
      <SectionCard title="Mevcut Tablolara Eklenen Köprü Kolonları (5 adet)" icon="🔗">
        <div className="mb-4 panel-dark rounded-xl p-4 text-xs text-slate-400">
          Tüm köprü kolonları <strong className="text-white">nullable</strong> olarak eklendi.
          Mevcut satırlar NULL alır, mevcut kod etkilenmez.{" "}
          <strong className="text-emerald-400">Dil fakültesi sistemi tamamen korunmuştur.</strong>
        </div>
        <div className="space-y-2">
          {BRIDGE_COLUMNS.map((b) => (
            <div
              key={b.column + b.table}
              className="panel-dark rounded-xl p-4 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
            >
              <div className="shrink-0 font-mono text-xs whitespace-nowrap">
                <span className="text-amber-300">{b.table}</span>
                <span className="text-slate-600">.</span>
                <span className="text-cyan-300">{b.column}</span>
                <span className="text-slate-500 ml-2">{b.target}</span>
              </div>
              <p className="text-xs text-slate-400">{b.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* TypeScript types */}
      <SectionCard title="TypeScript Tip Mimarisi (19 tip)" icon="🏷️">
        <div className="mb-4 space-y-2">
          <div className="panel-dark rounded-xl p-4 text-xs text-slate-400">
            <span className="text-white font-medium">types/university.ts — DEĞİŞTİRİLMEDİ.</span>{" "}
            Dil-fakültesi domain tipleri (CourseUnit, CourseLevel, Department, EnrollmentRecord, badges,
            certs, collectibles) burada kalır.
          </div>
          <div className="panel-dark rounded-xl p-4 text-xs text-slate-400">
            <span className="text-white font-medium">types/academic.ts — YENİ generic academic core.</span>{" "}
            Ortak tipler university.ts&apos;den{" "}
            <code className="text-cyan-300">{"export type { … } from \"./university\""}</code> ile
            re-export edildi — hiçbir tip kopyalanmadı.
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {NEW_TYPES.map((t) => (
            <div key={t.name} className="panel-dark rounded-xl p-3">
              <code className="text-xs font-mono text-purple-300 break-all">{t.name}</code>
              <p className="mt-1 text-xs text-slate-500">{t.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* University templates */}
      <SectionCard title="Üniversite Şablonları (7 adet)" icon="🎓">
        <p className="text-xs text-slate-500 mb-4">
          Admin dashboard&apos;dan &quot;Şablon Yükle&quot; butonu ile veritabanına aktarılabilir.
          Aktarım sonrası admin panelden serbestçe düzenlenebilir.
          Birebir kopya değil — ilham alınan generic şablonlar.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {UNIVERSITY_TEMPLATES.map((u) => (
            <div key={u.name} className="panel-dark rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-0.5">{u.name}</p>
              <p className="text-xs text-cyan-400/80 mb-3">İlham: {u.inspired}</p>
              <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                <span className="text-slate-500">Süre</span>
                <span className="text-slate-200">{u.years} yıl</span>
                <span className="text-slate-500">Kredi</span>
                <span className="text-slate-200">{u.credits}</span>
                <span className="text-slate-500">Ders</span>
                <span className="text-slate-200">{u.courses}</span>
                <span className="text-slate-500">Fakülte</span>
                <span className="text-slate-200">{u.faculties}</span>
                <span className="text-slate-500">Bölüm</span>
                <span className="text-slate-200">{u.depts}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/admin" className="soft-button text-xs">
            → Admin Dashboard&apos;dan Şablon Yükle
          </Link>
        </div>
      </SectionCard>

      {/* Requirement types */}
      <SectionCard title="Program Requirement Türleri (18 adet)" icon="📋">
        <p className="text-xs text-slate-500 mb-4">
          Harvard/MIT/Oxford/Stanford/Cambridge/ODTÜ/Boğaziçi tarzı program gerekliliklerini
          modellemek için kullanılır. Admin panelden her program için bu türlerde gereklilik
          tanımlanabilir.
        </p>
        <div className="flex flex-wrap gap-2">
          {REQUIREMENT_TYPES.map((r) => (
            <code
              key={r}
              className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300 font-mono"
            >
              {r}
            </code>
          ))}
        </div>
      </SectionCard>

      {/* Milestone types */}
      <SectionCard title="Akademik Milestone Türleri (13 adet)" icon="🏆">
        <p className="text-xs text-slate-500 mb-4">
          student_awards tablosunda kullanılır. Mevcut achievements / certificates /
          collectible_rewards sistemine FK ile bağlanır. Sadece dil kursu tamamlama değil,
          program-genelinde başarılar da ödüllendirilebilir.
        </p>
        <div className="flex flex-wrap gap-2">
          {MILESTONE_TYPES.map((m) => (
            <code
              key={m}
              className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-amber-300/80 font-mono"
            >
              {m}
            </code>
          ))}
        </div>
      </SectionCard>

      {/* Access control */}
      <SectionCard title="Erişim Kontrolü" icon="🔒">
        <div className="space-y-3">
          <div className="panel-dark rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-1.5">Middleware (middleware.ts)</p>
            <p className="text-xs text-slate-400">
              <code className="text-cyan-300">/admin/*</code> rotaları korumalı listeye ve
              matcher&apos;a eklendi. Oturum açmamış kullanıcılar otomatik{" "}
              <code className="text-cyan-300">/login</code>&apos;a yönlendirilir.
            </p>
          </div>
          <div className="panel-dark rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-1.5">
              Admin Layout (app/admin/layout.tsx)
            </p>
            <p className="text-xs text-slate-400 mb-2">
              Oturum açmış ama{" "}
              <code className="text-amber-300">profiles.role = &apos;admin&apos;</code> olmayan
              kullanıcılara &quot;Erişim Reddedildi&quot; ekranı gösterilir.
            </p>
            <div className="rounded-lg bg-black/40 border border-white/10 p-3">
              <code className="text-xs text-slate-400 font-mono">
                -- Admin rolü atama (Supabase SQL Editor)
                <br />
                UPDATE profiles SET role = &apos;admin&apos;
                <br />
                WHERE email = &apos;siz@example.com&apos;;
              </code>
            </div>
          </div>
          <div className="panel-dark rounded-xl p-4">
            <p className="text-sm font-medium text-white mb-1.5">RLS (Row Level Security)</p>
            <p className="text-xs text-slate-400">
              Tüm yeni tablolarda RLS aktif. Akademik veriler (üniversite, fakülte, program, ders)
              herkese read-only. Write işlemleri sadece admin role ile yapılabilir. Öğrenci verileri
              (transkript, kayıt, ödüller) sadece kendi kullanıcısına açık.
            </p>
          </div>
        </div>
      </SectionCard>

      {/* What's preserved */}
      <SectionCard title="Korunan Mevcut Sistem" icon="✅">
        <div className="grid gap-2.5 sm:grid-cols-2">
          {[
            {
              label: "Dil Kursları (/courses)",
              desc: "12 dil, 6 CEFR seviyesi, tüm curriculum verisi — değiştirilmedi",
            },
            {
              label: "AI Öğretmen (/live)",
              desc: "Gemini tabanlı konuşma pratiği, düzeltme, skor — değiştirilmedi",
            },
            {
              label: "Lesson Engine (/lesson)",
              desc: "AI ders üretimi, alfabe, gramer — değiştirilmedi",
            },
            {
              label: "Achievements sistemi",
              desc: "Badge/rozet kazanımı — nullable köprü kolonu eklendi, mantık bozulmadı",
            },
            {
              label: "Certificates sistemi",
              desc: "Sertifika üretimi — nullable köprü kolonu eklendi, mantık bozulmadı",
            },
            {
              label: "Collectible Rewards",
              desc: "NFT-ready koleksiyonlar — student_awards FK ile referans alabilir",
            },
            {
              label: "Dashboard (/dashboard)",
              desc: "Öğrenci dashboard, istatistikler — değiştirilmedi",
            },
            {
              label: "Profile (/profile)",
              desc: "Kullanıcı profili, badge koleksiyonu — değiştirilmedi",
            },
            {
              label: "types/university.ts",
              desc: "Tüm language domain tipleri — DOKUNULMADI",
            },
            {
              label: "Auth sistemi",
              desc: "Supabase Auth, login/register, onboarding — değiştirilmedi",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="panel-dark rounded-xl p-3.5 flex gap-3"
            >
              <span className="text-emerald-400 shrink-0 mt-0.5 text-sm">✓</span>
              <div>
                <p className="text-sm font-medium text-white">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Next steps */}
      <SectionCard title="Sonraki Adımlar / Kalan İşler" icon="🚀">
        <div className="space-y-2">
          {[
            {
              p: "Yüksek",
              label: "Migration Uygula",
              desc: "supabase/migrations/20240320000000_academic_schema.sql dosyasını Supabase dashboard SQL Editor'da veya CLI ile çalıştır",
            },
            {
              p: "Yüksek",
              label: "İlk Admin Kullanıcısı Ata",
              desc: "UPDATE profiles SET role='admin' WHERE email='...'; — ardından /admin erişilebilir olur",
            },
            {
              p: "Yüksek",
              label: "Üniversite Şablonlarını Yükle",
              desc: "/admin sayfasındaki 'Şablon Yükle' butonları ile 7 üniversite veritabanına aktarılabilir",
            },
            {
              p: "Orta",
              label: "Departments CRUD",
              desc: "departments tablosu migration'da mevcut ama admin UI eksik — /admin/departments sayfası eklenebilir",
            },
            {
              p: "Orta",
              label: "Program Requirements CRUD",
              desc: "Her program için requirement tanımlama ekranı (admin/programs/[id]/requirements)",
            },
            {
              p: "Orta",
              label: "Student Progression UI",
              desc: "Öğrencinin akademik programa kayıt olabileceği /programs/[id] sayfası",
            },
            {
              p: "Orta",
              label: "Transcript Görünümü",
              desc: "Öğrenci transkriptini /profile sayfasına entegre et",
            },
            {
              p: "Düşük",
              label: "Course Modules/Lessons Admin UI",
              desc: "Modül ve lesson yönetimi için admin arayüzü (admin/courses/[id]/modules)",
            },
            {
              p: "Düşük",
              label: "Academic Award Triggering",
              desc: "Program milestone tamamlandığında otomatik student_award + collectible üretimi",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="panel-dark rounded-xl p-3.5 flex gap-3 items-start"
            >
              <Badge
                text={s.p}
                color={
                  s.p === "Yüksek" ? "amber" : s.p === "Orta" ? "cyan" : "slate"
                }
              />
              <div>
                <p className="text-sm font-medium text-white">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
