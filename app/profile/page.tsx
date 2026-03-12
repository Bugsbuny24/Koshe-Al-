import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name,native_language,target_language,learning_stage,difficulty_level,onboarding_completed,is_premium"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  // Learning statistics
  const { count: messageCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: speakingCount } = await supabase
    .from("speaking_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: mistakeCount } = await supabase
    .from("learning_memory")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Average speaking scores
  const { data: scoreSessions } = await supabase
    .from("speaking_sessions")
    .select("fluency_score,grammar_score,vocabulary_score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  let avgFluency = 0;
  let avgGrammar = 0;
  let avgVocab = 0;

  if (scoreSessions && scoreSessions.length > 0) {
    const n = scoreSessions.length;
    avgFluency = Math.round(
      scoreSessions.reduce((s, r) => s + (r.fluency_score ?? 0), 0) / n
    );
    avgGrammar = Math.round(
      scoreSessions.reduce((s, r) => s + (r.grammar_score ?? 0), 0) / n
    );
    avgVocab = Math.round(
      scoreSessions.reduce((s, r) => s + (r.vocabulary_score ?? 0), 0) / n
    );
  }

  // Learned languages (distinct languages from speaking_sessions)
  const { data: learnedLangs } = await supabase
    .from("speaking_sessions")
    .select("language")
    .eq("user_id", user.id);

  const uniqueLanguages = Array.from(
    new Set((learnedLangs ?? []).map((r) => r.language).filter(Boolean))
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_18%),linear-gradient(180deg,#040816_0%,#06112a_48%,#020617_100%)] text-white">
      <div className="mx-auto max-w-4xl px-4 py-5 md:px-6 md:py-8">
        <header className="rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
            Koshei V1 • Profil
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-400/10 text-2xl font-bold text-cyan-100">
              {(profile.full_name || user.email || "K").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold">
                {profile.full_name || "Öğrenci"}
              </h1>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              {profile.is_premium ? (
                <span className="mt-2 inline-block rounded-full border border-cyan-300/20 bg-cyan-500/20 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-200">
                  Premium
                </span>
              ) : (
                <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-slate-400">
                  Free Plan
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/live"
              className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Konuşmaya Başla
            </Link>
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
            >
              Dashboard
            </Link>
            {!profile.is_premium ? (
              <Link
                href="/pricing"
                className="rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
              >
                Premium&apos;a Geç
              </Link>
            ) : null}
          </div>
        </header>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard label="Ana Dil" value={profile.native_language || "Turkish"} />
          <InfoCard label="Hedef Dil" value={profile.target_language || "English"} />
          <InfoCard label="Seviye" value={profile.learning_stage || "A1"} />
          <InfoCard label="Zorluk" value={difficultyLabel(profile.difficulty_level)} />
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-3">
          <StatCard label="Toplam Mesaj" value={String(messageCount || 0)} />
          <StatCard label="Speaking Oturumu" value={String(speakingCount || 0)} />
          <StatCard label="Düzeltilen Hata" value={String(mistakeCount || 0)} />
        </section>

        {scoreSessions && scoreSessions.length > 0 ? (
          <section className="mt-5 rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Öğrenme İstatistikleri
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Ortalama Konuşma Puanın
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Son {scoreSessions.length} oturumun ortalaması
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <ScoreCard label="Fluency" value={avgFluency} />
              <ScoreCard label="Grammar" value={avgGrammar} />
              <ScoreCard label="Vocabulary" value={avgVocab} />
            </div>
          </section>
        ) : null}

        <section className="mt-5 rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Öğrenilen Diller
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Pratik yaptığın diller
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {uniqueLanguages.length > 0 ? (
              uniqueLanguages.map((lang) => (
                <span
                  key={lang}
                  className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] px-4 py-2 text-sm text-cyan-100"
                >
                  {lang}
                </span>
              ))
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <p className="text-sm text-slate-300">
                  Henüz speaking oturumu yok. Konuşmaya başladıktan sonra
                  öğrenilen diller burada görünür.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Hesap Ayarları
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Ayarlar</h2>

          <div className="mt-5 space-y-3">
            <Link
              href="/onboarding"
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:bg-white/[0.08]"
            >
              <div>
                <p className="text-sm font-medium text-white">Dil Yolunu Değiştir</p>
                <p className="mt-1 text-xs text-slate-400">
                  Hedef dil veya seviyeni güncelleyelim.
                </p>
              </div>
              <span className="text-slate-400">→</span>
            </Link>
            <Link
              href="/pricing"
              className="flex items-center justify-between rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.06] px-5 py-4 transition hover:bg-cyan-400/[0.1]"
            >
              <div>
                <p className="text-sm font-medium text-white">Premium Plan</p>
                <p className="mt-1 text-xs text-slate-400">
                  Sınırsız speaking sorusu için premium&apos;a geç.
                </p>
              </div>
              <span className="text-cyan-400">→</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function difficultyLabel(level?: number | null) {
  if (!level || level <= 1) return "Easy";
  if (level === 2) return "Balanced";
  if (level === 3) return "Normal";
  if (level === 4) return "Strong";
  return "Advanced";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-white">{value}</p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  function scoreColor(val: number) {
    if (val >= 80) return "text-emerald-400";
    if (val >= 60) return "text-cyan-400";
    if (val >= 40) return "text-amber-400";
    return "text-red-400";
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${scoreColor(value)}`}>{value}</p>
    </div>
  );
}
