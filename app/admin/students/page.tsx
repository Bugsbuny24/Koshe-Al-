import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import type { StudentProgramEnrollmentRow } from "@/types/academic";

type EnrollmentWithRelations = StudentProgramEnrollmentRow & {
  programs: { title: string; code: string } | null;
  universities: { name: string; code: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  active: "Aktif",
  graduated: "Mezun",
  suspended: "Askıya Alındı",
  withdrawn: "Ayrıldı",
};

const STATUS_STYLES: Record<string, string> = {
  active:
    "inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-400",
  graduated:
    "inline-flex items-center rounded-full bg-cyan-400/10 px-2.5 py-0.5 text-xs text-cyan-400",
  suspended:
    "inline-flex items-center rounded-full bg-yellow-400/10 px-2.5 py-0.5 text-xs text-yellow-400",
  withdrawn:
    "inline-flex items-center rounded-full bg-slate-400/10 px-2.5 py-0.5 text-xs text-slate-400",
};

export default async function StudentsPage() {
  const supabase = await createClient();
  let enrollments: EnrollmentWithRelations[] = [];
  let totalCount = 0;

  try {
    const [{ data, count }] = await Promise.all([
      supabase
        .from("student_program_enrollments")
        .select("*, programs(title, code), universities(name, code)", {
          count: "exact",
        })
        .order("enrollment_date", { ascending: false })
        .limit(100),
    ]);
    enrollments = (data ?? []) as EnrollmentWithRelations[];
    totalCount = count ?? 0;
  } catch {
    // table may not exist yet
  }

  const activeCount = enrollments.filter((e) => e.status === "active").length;
  const graduatedCount = enrollments.filter(
    (e) => e.status === "graduated"
  ).length;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Öğrenciler"
        description={`${totalCount} toplam kayıt`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Toplam", value: totalCount, color: "text-white" },
          { label: "Aktif", value: activeCount, color: "text-emerald-400" },
          { label: "Mezun", value: graduatedCount, color: "text-cyan-400" },
          {
            label: "Diğer",
            value: totalCount - activeCount - graduatedCount,
            color: "text-slate-400",
          },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        {enrollments.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-slate-400">Henüz öğrenci kaydı bulunmuyor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Kullanıcı ID
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Program
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Üniversite
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    GPA
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Kredi
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Kayıt Tarihi
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Durum
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 text-slate-400 font-mono text-xs">
                      {enrollment.user_id.slice(0, 8)}…
                    </td>
                    <td className="py-3">
                      <p className="text-slate-300 text-xs font-medium">
                        {enrollment.programs?.title ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {enrollment.programs?.code ?? ""}
                      </p>
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {enrollment.universities?.name ?? "—"}
                    </td>
                    <td className="py-3 text-slate-300">
                      {enrollment.gpa?.toFixed(2) ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400">
                      {enrollment.completed_credits ?? 0}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {enrollment.enrollment_date
                        ? new Date(enrollment.enrollment_date).toLocaleDateString("tr-TR")
                        : "—"}
                    </td>
                    <td className="py-3">
                      <span
                        className={
                          STATUS_STYLES[enrollment.status] ??
                          STATUS_STYLES.withdrawn
                        }
                      >
                        {STATUS_LABELS[enrollment.status] ?? enrollment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalCount > 100 && (
              <p className="mt-4 text-xs text-slate-500 text-center">
                Son 100 kayıt gösteriliyor (toplam {totalCount})
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
