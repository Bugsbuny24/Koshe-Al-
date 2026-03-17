import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import type { StudentAwardRow } from "@/types/academic";

type AwardWithRelations = StudentAwardRow & {
  programs: { title: string; code: string } | null;
  universities: { name: string; code: string } | null;
};

const MILESTONE_LABELS: Record<string, string> = {
  program_enrollment: "Program Kaydı",
  core_requirement_complete: "Zorunlu Gereksinim Tamamlandı",
  honors_complete: "Onur Tamamlandı",
  capstone_complete: "Bitirme Projesi",
  high_gpa: "Yüksek GPA",
  faculty_excellence: "Fakülte Üstünlüğü",
  distinction: "Ayrım",
  graduation: "Mezuniyet",
  program_milestone: "Program Dönüm Noktası",
  language_requirement_complete: "Dil Gereksinimi",
  internship_complete: "Staj Tamamlandı",
  thesis_submitted: "Tez Teslim Edildi",
  thesis_approved: "Tez Onaylandı",
};

export default async function RewardsPage() {
  const supabase = await createClient();
  let awards: AwardWithRelations[] = [];
  let totalCount = 0;

  try {
    const { data, count } = await supabase
      .from("student_awards")
      .select("*, programs(title, code), universities(name, code)", {
        count: "exact",
      })
      .order("awarded_at", { ascending: false })
      .limit(100);
    awards = (data ?? []) as AwardWithRelations[];
    totalCount = count ?? 0;
  } catch {
    // table may not exist yet
  }

  // Count by milestone type
  const byType = awards.reduce<Record<string, number>>((acc, award) => {
    const t = award.milestone_type;
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  const topTypes = Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Ödüller"
        description={`${totalCount} ödül verildi`}
      />

      {/* Top award types */}
      {topTypes.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {topTypes.map(([type, count]) => (
            <div key={type} className="glass-card p-4">
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-xs text-slate-400 mt-1">
                {MILESTONE_LABELS[type] ?? type}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card p-6">
        {awards.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">🏆</p>
            <p className="text-slate-400">Henüz ödül verilmemiş.</p>
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
                    Ödül
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Tür
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Program
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Üniversite
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Tarih
                  </th>
                </tr>
              </thead>
              <tbody>
                {awards.map((award) => (
                  <tr
                    key={award.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 text-slate-400 font-mono text-xs">
                      {award.user_id.slice(0, 8)}…
                    </td>
                    <td className="py-3">
                      <p className="text-slate-300 font-medium text-xs">
                        {award.title}
                      </p>
                      {award.badge_code && (
                        <p className="text-xs text-slate-500 font-mono">
                          {award.badge_code}
                        </p>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-0.5 text-xs text-yellow-400">
                        {MILESTONE_LABELS[award.milestone_type] ??
                          award.milestone_type}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {award.programs?.code ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {award.universities?.code ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {award.awarded_at
                        ? new Date(award.awarded_at).toLocaleDateString("tr-TR")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalCount > 100 && (
              <p className="mt-4 text-xs text-slate-500 text-center">
                Son 100 ödül gösteriliyor (toplam {totalCount})
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
