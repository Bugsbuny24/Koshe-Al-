import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type ProfileRow = {
  full_name: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  native_language: string | null;
  target_language: string | null;
  difficulty_level: string | null;
  learning_stage: string | null;
  onboarding_completed: boolean | null;
  created_at: string | null;
};

type QuotaRow = {
  plan: string | null;
  tier: string | null;
  is_active: boolean | null;
  credits_remaining: number | null;
  expires_at: string | null;
};

type SessionRow = {
  fluency_score: number | null;
  grammar_score: number | null;
  vocabulary_score: number | null;
  created_at: string | null;
};

type MemoryRow = {
  wrong_sentence: string | null;
  correct_sentence: string | null;
  explanation: string | null;
  created_at: string | null;
};

type VocabRow = {
  word: string | null;
  strength: number | null;
  last_seen: string | null;
};

function formatDate(value: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
  }).format(date);
}

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
      `
      full_name,
      username,
      email,
      bio,
      avatar_url,
      native_language,
      target_language,
      difficulty_level,
      learning_stage,
      onboarding_completed,
      created_at
    `
    )
    .eq("id", user.id)
    .single<ProfileRow>();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const { data: quota } = await supabase
    .from("user_quotas")
    .select("plan,tier,is_active,credits_remaining,expires_at")
    .eq("user_id", user.id)
    .maybeSingle<QuotaRow>();

  const { data: sessions } = await supabase
    .from("speaking_sessions")
    .select("fluency_score,grammar_score,vocabulary_score,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<SessionRow[]>();

  const { data: recentMistakes } = await supabase
    .from("learning_memory")
    .select("wrong_sentence,correct_sentence,explanation,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<MemoryRow[]>();

  const { data: recentWords } = await supabase
    .from("vocab_memory")
    .select("word,strength,last_seen")
    .eq("user_id", user.id)
    .order("last_seen", { ascending: false })
    .limit(8)
    .returns<VocabRow[]>();

  const latestSession = sessions?.[0];

  const avgFluency =
    sessions && sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, item) => sum + Number(item.fluency_score || 0), 0) /
            sessions.length
        )
      : 0;

  const avgGrammar =
    sessions && sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, item) => sum + Number(item.grammar_score || 0), 0) /
            sessions.length
        )
      : 0;

  const avgVocabulary =
    sessions && sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum, item) => sum + Number(item.vocabulary_score || 0),
            0
          ) / sessions.length
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Profile
            </div>
            <h1 className="mt-2 text-3xl font-semibold">
              {profile?.full_name || "Koshei Kullanıcısı"}
            </h1>
            <p className="mt-2 text-slate-300">
              Hesap, öğrenme bilgileri ve gelişim özeti burada.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10"
            >
              Dashboard
            </Link>

            <a
              href="/logout"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Çıkış Yap
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Hesap Bilgileri</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Ad Soyad</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.full_name || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Kullanıcı Adı</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.username || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 md:col-span-2">
                <div className="text-sm text-slate-400">Email</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.email || user.email || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Kayıt Tarihi</div>
                <div className="mt-1 text-base font-medium text-white">
                  {formatDate(profile?.created_at || null)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Bio</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.bio || "-"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Öğrenme Profili</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Ana Dil</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.native_language || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Hedef Dil</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.target_language || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Seviye</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.difficulty_level || "-"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Amaç</div>
                <div className="mt-1 text-base font-medium text-white">
                  {profile?.learning_stage || "-"}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Plan ve Kota</h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Plan</div>
                <div className="mt-1 text-base font-medium text-white">
                  {quota?.plan || "free"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Tier</div>
                <div className="mt-1 text-base font-medium text-white">
                  {quota?.tier || "free"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Aktif mi?</div>
                <div className="mt-1 text-base font-medium text-white">
                  {quota?.is_active ? "Evet" : "Hayır"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Kalan Kredi</div>
                <div className="mt-1 text-base font-medium text-white">
                  {quota?.credits_remaining ?? 0}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Son Performans</h2>

            {latestSession ? (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-slate-400">Fluency</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {latestSession.fluency_score || 0}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-slate-400">Grammar</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {latestSession.grammar_score || 0}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-sm text-slate-400">Vocabulary</div>
                  <div className="mt-1 text-2xl font-semibold text-white">
                    {latestSession.vocabulary_score || 0}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-slate-400">Henüz konuşma oturumu yok.</p>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Ort. Fluency</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {avgFluency}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Ort. Grammar</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {avgGrammar}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm text-slate-400">Ort. Vocabulary</div>
                <div className="mt-1 text-2xl font-semibold text-white">
                  {avgVocabulary}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Son Hatalar</h2>

            {recentMistakes && recentMistakes.length > 0 ? (
              <div className="mt-5 space-y-4">
                {recentMistakes.map((item, index) => (
                  <div
                    key={`${item.wrong_sentence}-${index}`}
                    className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4"
                  >
                    <div className="text-sm text-slate-300">Yanlış</div>
                    <div className="mt-1 text-white">
                      {item.wrong_sentence || "-"}
                    </div>

                    <div className="mt-3 text-sm text-slate-300">Doğru</div>
                    <div className="mt-1 text-cyan-300">
                      {item.correct_sentence || "-"}
                    </div>

                    <div className="mt-3 text-sm text-slate-300">Açıklama</div>
                    <div className="mt-1 text-slate-100">
                      {item.explanation || "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-slate-400">Henüz kayıtlı hata yok.</p>
            )}
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Öğrenilen Kelimeler</h2>

            {recentWords && recentWords.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-3">
                {recentWords.map((item, index) => (
                  <div
                    key={`${item.word}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div className="font-medium text-white">{item.word || "-"}</div>
                    <div className="mt-1 text-xs text-slate-400">
                      Strength: {item.strength || 1}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Son görülme: {formatDate(item.last_seen)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-slate-400">Henüz kayıtlı kelime yok.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
    }
