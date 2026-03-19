import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();

  const [
    { count: userCount },
    { count: sessionCount },
    { count: messageCount },
    { data: usageLogs },
    { data: recentSessions },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("speaking_sessions").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase
      .from("usage_logs")
      .select("meter,amount,created_at")
      .order("created_at", { ascending: false })
      .limit(200),
    supabase
      .from("speaking_sessions")
      .select("fluency_score,grammar_score,vocabulary_score,language,created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const totalCreditsSpent = (usageLogs ?? []).reduce(
    (sum, log) => sum + Number(log.amount ?? 0),
    0
  );

  const lessonCount = (usageLogs ?? []).filter(
    (l) => l.meter === "lesson_generation"
  ).length;

  const avgFluency =
    recentSessions && recentSessions.length > 0
      ? Math.round(
          recentSessions.reduce((sum, r) => sum + Number(r.fluency_score ?? 0), 0) /
            recentSessions.length
        )
      : 0;

  const stats = [
    { label: "Toplam Kullanıcı", value: userCount ?? 0, icon: "👥", color: "text-cyan-400" },
    { label: "Speaking Session", value: sessionCount ?? 0, icon: "🎤", color: "text-fuchsia-400" },
    { label: "Toplam Mesaj", value: messageCount ?? 0, icon: "💬", color: "text-violet-400" },
    { label: "Ders Oluşturma", value: lessonCount, icon: "📖", color: "text-blue-400" },
    { label: "Harcanan Kredi", value: totalCreditsSpent, icon: "✦", color: "text-amber-400" },
    { label: "Ort. Fluency", value: avgFluency, icon: "📊", color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Analytics"
        description="Platform geneli istatistikler"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.color}`}>
              {s.value.toLocaleString("tr-TR")}
            </div>
            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="text-sm uppercase tracking-[0.2em] text-slate-400 mb-5">
          Son Speaking Sessions
        </h2>
        {recentSessions && recentSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  {["Dil", "Fluency", "Grammar", "Vocabulary", "Tarih"].map((h) => (
                    <th
                      key={h}
                      className="pb-3 pr-6 text-xs uppercase tracking-[0.2em] text-slate-500 font-normal"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentSessions.map((s, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-6 text-slate-300">{s.language}</td>
                    <td className="py-2.5 pr-6 text-cyan-400 font-medium">
                      {s.fluency_score ?? "—"}
                    </td>
                    <td className="py-2.5 pr-6 text-violet-400 font-medium">
                      {s.grammar_score ?? "—"}
                    </td>
                    <td className="py-2.5 pr-6 text-fuchsia-400 font-medium">
                      {s.vocabulary_score ?? "—"}
                    </td>
                    <td className="py-2.5 text-slate-500 text-xs">
                      {s.created_at
                        ? new Date(s.created_at).toLocaleDateString("tr-TR")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Henüz session verisi yok.</p>
        )}
      </div>
    </div>
  );
}
