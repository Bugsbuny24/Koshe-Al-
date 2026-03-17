import Link from "next/link";
import Image from "next/image";
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

type EnrollmentRow = {
  course_id: string;
  language_code: string;
  level: string;
  progress_percent: number | null;
  completed_units_count: number | null;
  total_units_count: number | null;
  status: string | null;
};

type BadgeRow = {
  id: string;
  title: string;
  image_url: string | null;
  level: string | null;
  earned_at: string | null;
};

type CertRow = {
  id: string;
  title: string;
  language_code: string;
  level: string;
  image_url: string | null;
  issued_at: string | null;
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

type CollectibleCountRow = {
  id: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: sessions },
    { data: recentMistakes },
    { data: recentWords },
    { data: enrollments },
    { data: latestBadges },
    { data: latestCerts },
    { data: collectibleCount },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name,native_language,target_language,difficulty_level,learning_stage")
      .eq("id", user.id)
      .single<ProfileRow>(),
    supabase
      .from("speaking_sessions")
      .select("fluency_score,grammar_score,vocabulary_score,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<SessionRow[]>(),
    supabase
      .from("learning_memory")
      .select("wrong_sentence,correct_sentence,explanation,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<MemoryRow[]>(),
    supabase
      .from("vocab_memory")
      .select("word,strength,last_seen")
      .eq("user_id", user.id)
      .order("last_seen", { ascending: false })
      .limit(8)
      .returns<VocabRow[]>(),
    supabase
      .from("course_enrollments")
      .select("course_id,language_code,level,progress_percent,completed_units_count,total_units_count,status")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3)
      .returns<EnrollmentRow[]>(),
    supabase
      .from("achievements")
      .select("id,title,image_url,level,earned_at")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })
      .limit(2)
      .returns<BadgeRow[]>(),
    supabase
      .from("certificates")
      .select("id,title,language_code,level,image_url,issued_at")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false })
      .limit(1)
      .returns<CertRow[]>(),
    supabase
      .from("collectible_rewards")
      .select("id")
      .eq("user_id", user.id)
      .returns<CollectibleCountRow[]>(),
  ]);

  const sessionRows = sessions ?? [];
  const mistakeRows = recentMistakes ?? [];
  const wordRows = recentWords ?? [];

  const latestScore = sessionRows[0];

  const avgFluency = sessionRows.length
    ? sessionRows.reduce((s, r) => s + Number(r.fluency_score || 0), 0) / sessionRows.length
    : 0;
  const avgGrammar = sessionRows.length
    ? sessionRows.reduce((s, r) => s + Number(r.grammar_score || 0), 0) / sessionRows.length
    : 0;
  const avgVocab = sessionRows.length
    ? sessionRows.reduce((s, r) => s + Number(r.vocabulary_score || 0), 0) / sessionRows.length
    : 0;

  function progressColor(p: number) {
    if (p >= 100) return "from-amber-400 to-yellow-500";
    if (p >= 80) return "from-fuchsia-500 to-violet-500";
    if (p >= 50) return "from-cyan-400 to-blue-500";
    return "from-slate-500 to-slate-400";
  }

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <Surface className="gradient-border p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                Koshei AI University — Dashboard
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
              <Link href="/courses" className="soft-button">
                Kurslar
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

        {/* ── University Progress Cards ───────────────────────────────────── */}
        {(enrollments && enrollments.length > 0) || (latestBadges && latestBadges.length > 0) || (latestCerts && latestCerts.length > 0) ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Active enrollments */}
            <Surface className="lg:col-span-2">
              <SectionHeader
                eyebrow="Kurs İlerlemesi"
                title="Aktif Kurslarım"
                description="Son kayıtlı kursların ve ilerleme durumun"
              />
              {enrollments && enrollments.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {enrollments.map((e) => (
                    <div
                      key={e.course_id}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-white">
                          {e.language_code.toUpperCase()} • {e.level}
                        </span>
                        <span className="text-slate-400">
                          {e.completed_units_count || 0}/{e.total_units_count || 0} unit
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                          <span>İlerleme</span>
                          <span>{e.progress_percent || 0}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${progressColor(e.progress_percent || 0)}`}
                            style={{ width: `${e.progress_percent || 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <p className="text-sm text-slate-400">Henüz kurs kaydın yok.</p>
                  <Link
                    href="/courses"
                    className="mt-3 inline-block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                  >
                    Kurslara Göz At →
                  </Link>
                </div>
              )}
            </Surface>

            {/* Latest badge + cert + collectible count */}
            <div className="space-y-5">
              {/* Latest badge */}
              {latestBadges && latestBadges.length > 0 ? (
                <Surface>
                  <SectionHeader eyebrow="Son Rozet" title="Kazanılan Badge" />
                  <div className="mt-4 flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10">
                      {latestBadges[0].image_url ? (
                        <Image
                          src={latestBadges[0].image_url}
                          alt={latestBadges[0].title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">🏅</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{latestBadges[0].title}</div>
                      <div className="mt-1 text-xs text-cyan-300">{latestBadges[0].level || ""}</div>
                    </div>
                  </div>
                </Surface>
              ) : null}

              {/* Latest cert */}
              {latestCerts && latestCerts.length > 0 ? (
                <Surface>
                  <SectionHeader eyebrow="Son Sertifika" title={latestCerts[0].title} />
                  <div className="mt-3 text-xs text-slate-400">
                    {latestCerts[0].language_code.toUpperCase()} • {latestCerts[0].level} •{" "}
                    {latestCerts[0].issued_at
                      ? new Date(latestCerts[0].issued_at).toLocaleDateString("tr-TR")
                      : "-"}
                  </div>
                </Surface>
              ) : null}

              {/* Collectible count */}
              <Surface>
                <div className="metric-label">NFT Koleksiyonları</div>
                <div className="metric-value">{collectibleCount?.length || 0}</div>
                <Link
                  href="/profile"
                  className="mt-3 block text-xs text-cyan-300 hover:underline"
                >
                  Koleksiyona git →
                </Link>
              </Surface>
            </div>
          </div>
        ) : null}

        {/* ── Original stats + profile ──────────────────────────────────────── */}
        <div className="mt-8 grid gap-6 xl:grid-cols-4">
          <Surface className="xl:col-span-1">
            <SectionHeader
              eyebrow="Profil"
              title="Öğrenci Bilgileri"
              description="Aktif öğrenme profilin"
            />

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Ad</div>
                <div className="mt-2 text-white">{profile?.full_name || "-"}</div>
              </div>
              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Ana Dil</div>
                <div className="mt-2 text-white">{profile?.native_language || "-"}</div>
              </div>
              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Hedef Dil</div>
                <div className="mt-2 text-white">{profile?.target_language || "-"}</div>
              </div>
              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Seviye</div>
                <div className="mt-2 text-white">{profile?.difficulty_level || "-"}</div>
              </div>
              <div className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Amaç</div>
                <div className="mt-2 text-white">{profile?.learning_stage || "-"}</div>
              </div>
            </div>
          </Surface>

          <div className="xl:col-span-3">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <Surface>
                <div className="metric-label">Son Fluency</div>
                <div className="metric-value">{latestScore?.fluency_score || 0}</div>
              </Surface>
              <Surface>
                <div className="metric-label">Son Grammar</div>
                <div className="metric-value">{latestScore?.grammar_score || 0}</div>
              </Surface>
              <Surface>
                <div className="metric-label">Son Vocabulary</div>
                <div className="metric-value">{latestScore?.vocabulary_score || 0}</div>
              </Surface>
              <Surface>
                <div className="metric-label">Toplam Session</div>
                <div className="metric-value">{sessionRows.length}</div>
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
                <Link href="/feedback" className="primary-button">Mesaj Gönder</Link>
                <Link href="/pricing" className="soft-button">Paketleri Gör</Link>
              </div>
            </Surface>
          </div>
        </div>

        {/* ── Recent mistakes + Vocabulary ───────────────────────────────────── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Surface>
            <SectionHeader
              eyebrow="Son Hatalar"
              title="En son düzeltmelerin"
              description="Koshei'nin hafızaya aldığı son hatalar"
            />
            {mistakeRows.length > 0 ? (
              <div className="mt-6 space-y-4">
                {mistakeRows.map((item, index) => (
                  <div
                    key={`${item.wrong_sentence}-${index}`}
                    className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Yanlış</div>
                    <div className="mt-2 text-white">{item.wrong_sentence || "-"}</div>
                    <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Doğru</div>
                    <div className="mt-2 text-cyan-300">{item.correct_sentence || "-"}</div>
                    <div className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-400">Açıklama</div>
                    <div className="mt-2 text-slate-200">{item.explanation || "-"}</div>
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
            {wordRows.length > 0 ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {wordRows.map((item, index) => (
                  <div
                    key={`${item.word}-${index}`}
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4"
                  >
                    <div className="text-base font-semibold text-white">
                      {item.word || "-"}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">Strength</div>
                    <div className="mt-1 text-slate-300">{item.strength || 1}</div>
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
