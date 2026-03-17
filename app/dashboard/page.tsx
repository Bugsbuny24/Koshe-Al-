import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ProfileRow = {
  full_name: string | null;
  native_language: string | null;
  target_language: string | null;
  difficulty_level: string | null;
  learning_stage: string | null;
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

export default async function DashboardPage() {
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
      "full_name,native_language,target_language,difficulty_level,learning_stage"
    )
    .eq("id", user.id)
    .single<ProfileRow>();

  const { data: sessions } = await supabase
    .from("speaking_sessions")
    .select("fluency_score,grammar_score,vocabulary_score,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)
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

  const latestScore = sessions?.[0];

  const avgFluency = sessions?.length
    ? sessions.reduce((sum, s) => sum + Number(s.fluency_score || 0), 0) /
      sessions.length
    : 0;

  const avgGrammar = sessions?.length
    ? sessions.reduce((sum, s) => sum + Number(s.grammar_score || 0), 0) /
      sessions.length
    : 0;

  const avgVocab = sessions?.length
    ? sessions.reduce((sum, s) => sum + Number(s.vocabulary_score || 0), 0) /
      sessions.length
    : 0;

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-semibold">Dashboard</h1>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Konuşmaya Başla
            </Link>

            <Link
              href="/lesson"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10"
            >
              Derse Git
            </Link>

            <Link
              href="/feedback"
              className="inline-flex items-center justify-center rounded-2xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-5 py-3 font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/20"
            >
              Geri Bildirim Gönder
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 text-lg">Profil</h2>

            <div className="space-y-2 text-slate-200">
              <p>Ad: {profile?.full_name || "-"}</p>
              <p>Ana dil: {profile?.native_language || "-"}</p>
              <p>Öğrenilen dil: {profile?.target_language || "-"}</p>
              <p>Seviye: {profile?.difficulty_level || "-"}</p>
              <p>Amaç: {profile?.learning_stage || "-"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-3 text-lg">Son Skor</h2>

            {latestScore ? (
              <div className="space-y-2 text-slate-200">
                <p>Fluency: {latestScore.fluency_score || 0}</p>
                <p>Grammar: {latestScore.grammar_score || 0}</p>
                <p>Vocabulary: {latestScore.vocabulary_score || 0}</p>
              </div>
            ) : (
              <p className="text-slate-400">Henüz konuşma yapılmadı.</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg">Ortalama Skorlar</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm text-gray-400">Fluency</div>
              <div className="text-2xl font-semibold">
                {Math.round(avgFluency)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm text-gray-400">Grammar</div>
              <div className="text-2xl font-semibold">
                {Math.round(avgGrammar)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm text-gray-400">Vocabulary</div>
              <div className="text-2xl font-semibold">
                {Math.round(avgVocab)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 p-6">
          <h2 className="mb-2 text-lg font-semibold">Koshei&apos;yi Birlikte Geliştirelim</h2>
          <p className="mb-4 text-sm text-slate-300">
            Hata, eksik yön, performans sorunu veya yeni özellik önerin varsa bize
            direkt mesaj bırak. Geri dönüşlerin ürünü geliştirmemize yardımcı olur.
          </p>

          <Link
            href="/feedback"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 font-medium text-white transition hover:opacity-90"
          >
            Mesaj Gönder
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg">Son Hatalar</h2>

            {recentMistakes && recentMistakes.length > 0 ? (
              <div className="space-y-4">
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
              <p className="text-slate-400">Henüz kayıtlı hata yok.</p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-lg">Öğrenilen Kelimeler</h2>

            {recentWords && recentWords.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {recentWords.map((item, index) => (
                  <div
                    key={`${item.word}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                  >
                    <div className="font-medium text-white">
                      {item.word || "-"}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      Strength: {item.strength || 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Henüz kayıtlı kelime yok.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
