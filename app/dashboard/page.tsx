import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader, Surface } from "@/components/ui/Surface";

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
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Surface className="gradient-border p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                Koshei Dashboard
              </p>
              <h1 className="glow-text mt-2 text-3xl font-bold text-white sm:text-5xl">
                Hoş geldin, {profile?.full_name || "Öğrenci"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                AI öğretmeninle konuş, gelişimini takip et, hatalarını gör ve
                daha akıcı konuşmaya başla.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/live" className="primary-button">
                Konuşmaya Başla
              </Link>
              <Link href="/lesson" className="soft-button">
                Derse Git
              </Link>
              <Link href="/feedback" className="soft-button">
                Feedback
              </Link>
            </div>
          </div>
        </Surface>

        <div className="mt-8 grid gap-6 xl:grid-cols-4">
          <Surface className="xl:col-span-1">
            <SectionHeader
              eyebrow="Profil"
              title="Öğrenci Bilgileri"
              description="Aktif öğrenme profilin"
            />

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Ad
                </div>
                <div className="mt-2 text-white">{profile?.full_name || "-"}</div>
              </div>

              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Ana Dil
                </div>
                <div className="mt-2 text-white">
                  {profile?.native_language || "-"}
                </div>
              </div>

              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Hedef Dil
                </div>
                <div className="mt-2 text-white">
                  {profile?.target_language || "-"}
                </div>
              </div>

              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Seviye
                </div>
                <div className="mt-2 text-white">
                  {profile?.difficulty_level || "-"}
                </div>
              </div>

              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Amaç
                </div>
                <div className="mt-2 text-white">
                  {profile?.learning_stage || "-"}
                </div>
              </div>
            </div>
          </Surface>

          <div className="xl:col-span-3">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Surface>
                <div className="metric-label">Son Fluency</div>
                <div className="metric-value">
                  {latestScore?.fluency_score || 0}
                </div>
              </Surface>

              <Surface>
                <div className="metric-label">Son Grammar</div>
                <div className="metric-value">
                  {latestScore?.grammar_score || 0}
                </div>
              </Surface>

              <Surface>
                <div className="metric-label">Son Vocabulary</div>
                <div className="metric-value">
                  {latestScore?.vocabulary_score || 0}
                </div>
              </Surface>

              <Surface>
                <div className="metric-label">Toplam Session</div>
                <div className="metric-value">{sessions?.length || 0}</div>
              </Surface>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <Surface>
                <div className="metric-label">Ortalama Fluency</div>
                <div className="metric-value">{Math.round(avgFluency)}</div>
              </Surface>

              <Surface>
                <div className="metric-label">Ortalama Grammar</div>
                <div className="metric-value">{Math.round(avgGrammar)}</div>
              </Surface>

              <Surface>
                <div className="metric-label">Ortalama Vocabulary</div>
                <div className="metric-value">{Math.round(avgVocab)}</div>
              </Surface>
            </div>

            <Surface className="mt-6">
              <SectionHeader
                eyebrow="Gelişim"
                title="Koshei'yi birlikte geliştirelim"
                description="Hata, eksik yön veya yeni özellik önerini bize yaz."
              />

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/feedback" className="primary-button">
                  Mesaj Gönder
                </Link>
                <Link href="/pricing" className="soft-button">
                  Paketleri Gör
                </Link>
              </div>
            </Surface>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Surface>
            <SectionHeader
              eyebrow="Son Hatalar"
              title="En son düzeltmelerin"
              description="Koshei'nin hafızaya aldığı son hatalar"
            />

            {recentMistakes && recentMistakes.length > 0 ? (
              <div className="mt-6 space-y-4">
                {recentMistakes.map((item, index) => (
                  <div
                    key={`${item.wrong_sentence}-${index}`}
                    className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Yanlış
                    </div>
                    <div className="mt-2 text-white">
                      {item.wrong_sentence || "-"}
                    </div>

                    <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                      Doğru
                    </div>
                    <div className="mt-2 text-cyan-300">
                      {item.correct_sentence || "-"}
                    </div>

                    <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                      Açıklama
                    </div>
                    <div className="mt-2 text-slate-200">
                      {item.explanation || "-"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-400">Henüz kayıtlı hata yok.</p>
            )}
          </Surface>

          <Surface>
            <SectionHeader
              eyebrow="Vocabulary"
              title="Son öğrenilen kelimeler"
              description="Güç seviyeleriyle birlikte son kelimeler"
            />

            {recentWords && recentWords.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {recentWords.map((item, index) => (
                  <div
                    key={`${item.word}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                  >
                    <div className="text-base font-semibold text-white">
                      {item.word || "-"}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Strength
                    </div>
                    <div className="mt-1 text-slate-300">
                      {item.strength || 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-400">Henüz kayıtlı kelime yok.</p>
            )}
          </Surface>
        </div>
      </div>
    </main>
  );
}
