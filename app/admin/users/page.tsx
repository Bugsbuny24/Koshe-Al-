import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";

type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string | null;
  target_language: string | null;
  difficulty_level: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
};

type QuotaRow = {
  user_id: string;
  credits_remaining: number | null;
  is_active: boolean | null;
  plan: string | null;
};

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const [{ data: users, count }, { data: quotas }] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id,email,full_name,role,target_language,difficulty_level,onboarding_completed,created_at",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .limit(100)
      .returns<UserRow[]>(),
    supabase
      .from("user_quotas")
      .select("user_id,credits_remaining,is_active,plan")
      .returns<QuotaRow[]>(),
  ]);

  const quotaMap = new Map((quotas ?? []).map((q) => [q.user_id, q]));

  const onboardedCount = (users ?? []).filter((u) => u.onboarding_completed).length;
  const activeCreditsCount = (quotas ?? []).filter((q) => q.is_active).length;
  const adminCount = (users ?? []).filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Kullanıcılar"
        description={`${count ?? 0} toplam kullanıcı`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Toplam", value: count ?? 0, color: "text-white" },
          { label: "Onboarding ✓", value: onboardedCount, color: "text-emerald-400" },
          { label: "Kredi Aktif", value: activeCreditsCount, color: "text-cyan-400" },
          { label: "Admin", value: adminCount, color: "text-fuchsia-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                {["Ad / Email", "Dil", "Seviye", "Kredi", "Plan", "Onboarding", "Kayıt"].map((h) => (
                  <th
                    key={h}
                    className="px-4 pb-3 pt-4 text-left text-xs uppercase tracking-[0.2em] text-slate-500 font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => {
                const quota = quotaMap.get(user.id);
                const creditsRemaining = Number(quota?.credits_remaining ?? 0);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-white text-sm">
                        {user.full_name || "—"}
                      </div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {user.target_language || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">
                      {user.difficulty_level || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-semibold text-sm ${
                          creditsRemaining > 20
                            ? "text-cyan-400"
                            : creditsRemaining > 0
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {creditsRemaining}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {quota?.plan || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {user.onboarding_completed ? (
                        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-400">
                          ✓ Tamamlandı
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-400/10 px-2 py-0.5 text-xs text-slate-400">
                          Bekliyor
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString("tr-TR")
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {(count ?? 0) > 100 && (
            <p className="px-4 py-3 text-xs text-slate-600 text-center">
              Son 100 kullanıcı gösteriliyor (toplam {count})
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
