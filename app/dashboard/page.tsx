import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader, Surface } from "@/components/ui/Surface";
import { getAcademicContext } from "@/lib/data/academic-catalog";
import { getMentorForLanguage } from "@/lib/data/mentors";
import { DEPARTMENTS } from "@/lib/data/curriculum";
import CreditDisplay from "@/components/credits/CreditDisplay";

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
};

type VocabRow = {
  word: string | null;
  strength: number | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { data: sessions },
    { data: recentMistakes },
    { data: recentWords },
    { data: enrollments },
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
  ]);

  const sessionRows = sessions ?? [];
  const mistakeRows = recentMistakes ?? [];
  const wordRows = recentWords ?? [];
  const latestScore = sessionRows[0] ?? null;
  const isNewUser = sessionRows.length === 0;

  const avgFluency = sessionRows.length
    ? Math.round(sessionRows.reduce((s, r) => s + Number(r.fluency_score || 0), 0) / sessionRows.length)
    : null;
  const avgGrammar = sessionRows.length
    ? Math.round(sessionRows.reduce((s, r) => s + Number(r.grammar_score || 0), 0) / sessionRows.length)
    : null;
  const avgVocab = sessionRows.length
    ? Math.round(sessionRows.reduce((s, r) => s + Number(r.vocabulary_score || 0), 0) / sessionRows.length)
    : null;

  const targetLang = profile?.target_language || "English";
  const activeLangCode =
    enrollments?.find((e) => e.status === "active")?.language_code ??
    DEPARTMENTS.find((d) => d.name.toLowerCase() === targetLang.toLowerCase())?.code ??
    targetLang.slice(0, 2).toLowerCase();
  const activeLevel =
    enrollments?.find((e) => e.status === "active")?.level ??
    profile?.difficulty_level ?? "A1";
  const academicCtx = getAcademicContext(activeLangCode, activeLevel);
  const mentor = getMentorForLanguage(activeLangCode);

  return (
    <main className="px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* ── Hero header ─────────────────────────────────────────────── */}
        <Surface className="gradient-border p-6 sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
                Koshei AI University — Dashboard
              </p>
              <h1 className="glow-text mt-2 text-3xl font-bold text-white sm:text-5xl">
                Hoş geldin, {profile?.full_name || "Öğrenci"} 👋
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="text-slate-400">{academicCtx.facultyName}</span>
                <span>›</span>
                <span className="text-slate-300 font-medium">{academicCtx.programTitle}</span>
                {academicCtx.courseTitle && (
                  <>
                    <span>›</span>
                    <span className="text-cyan-400">{academicCtx.courseTitle}</span>
                  </>
                )}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${mentor.gradientFrom} ${mentor.gradientTo} text-xs font-bold text-white`}>
                  {mentor.avatarInitials}
                </div>
                <span className="text-sm text-slate-400">
                  Mentorın: <span className="text-white font-medium">{mentor.name}</span> · {mentor.title}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/live" className="primary-button">
                🎤 Konuşmaya Başla
              </Link>
              <Link href="/lesson" className="soft-button">
                📖 Günlük Ders
              </Link>
              <Link href="/courses" className="soft-button">
                📚 Programlar
              </Link>
            </div>
          </div>
        </Surface>

        {/* ── Yeni kullanıcı başlangıç rehberi ────────────────────────── */}
        {isNewUser && (
          <div className="rounded-3xl border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/10 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🚀</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">Başlamaya hazır mısın?</h2>
                <p className="mt-2 text-sm text-slate-300 leading-7">
                  Hesabın oluşturuldu. Şimdi ilk adımlarını at ve AI mentorunla tanış.
                  20 ücretsiz kredinle hemen başlayabilirsin.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: "🎤",
                      title: "Canlı Pratik",
                      desc: "AI mentorunla ilk konuşmanı yap",
                      href: "/live",
                      primary: true,
                    },
                    {
                      icon: "📖",
                      title: "Günlük Ders",
                      desc: "Kişiselleştirilmiş ders oluştur",
                      href: "/lesson",
                      primary: false,
                    },
                    {
                      icon: "📚",
                      title: "Program Seç",
                      desc: "Akademik programına kayıt ol",
                      href: "/courses",
                      primary: false,
                    },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "flex flex-col gap-2 rounded-2xl p-4 transition",
                        item.primary
                          ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:opacity-90"
                          : "border border-white/10 bg-white/5 hover:bg-white/10",
                      ].join(" ")}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold text-sm">{item.title}</span>
                      <span className={`text-xs ${item.primary ? "text-fuchsia-200" : "text-slate-400"}`}>
                        {item.desc}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Kredi bakiyesi ──────────────────────────────────────────── */}
        <CreditDisplay variant="full" />

        {/* ── Stats ───────────────────────────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Son Fluency", value: latestScore?.fluency_score ?? "—" },
            { label: "Son Grammar", value: latestScore?.grammar_score ?? "—" },
            { label: "Son Vocabulary", value: latestScore?.vocabulary_score ?? "—" },
            { label: "Toplam Session", value: sessionRows.length || "—" },
          ].map((s) => (
            <Surface key={s.label}>
              <div className="metric-label">{s.label}</div>
              <div className="metric-value">{s.value}</div>
            </Surface>
          ))}
        </div>

        {/* Ortalamalar — sadece veri varsa */}
        {sessionRows.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Ort. Fluency", value: avgFluency },
              { label: "Ort. Grammar", value: avgGrammar },
              { label: "Ort. Vocabulary", value: avgVocab },
            ].map((s) => (
              <Surface key={s.label}>
                <div className="metric-label">{s.label}</div>
                <div className="metric-value">{s.value}</div>
              </Surface>
            ))}
          </div>
        )}

        {/* ── Aktif programlar ────────────────────────────────────────── */}
        {enrollments && enrollments.length > 0 && (
          <Surface>
            <SectionHeader
              eyebrow="Aktif Program"
              title="Eğitim İlerlemem"
              description="Kayıtlı kurslarının ilerleme durumu"
            />
            <div className="mt-5 space-y-4">
              {enrollments.map((e) => {
                const ctx = getAcademicContext(e.language_code, e.level);
                const progress = e.progress_percent || 0;
                const progressColor =
                  progress >= 100 ? "from-amber-400 to-yellow-500"
                  : progress >= 80 ? "from-fuchsia-500 to-violet-500"
                  : progress >= 50 ? "from-cyan-400 to-blue-500"
                  : "from-slate-500 to-slate-400";

                return (
                  <div key={e.course_id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-white">{ctx.programTitle}</div>
                        <div className="mt-0.5 text-xs text-slate-500">{ctx.facultyName} · {e.level}</div>
                      </div>
                      <span className="text-xs text-slate-400">
                        {e.completed_units_count || 0}/{e.total_units_count || 0} ünite
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="mb-1.5 flex justify-between text-xs text-slate-400">
                        <span>İlerleme</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${progressColor}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link href="/live" className="rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-500/20">
                        🎤 Canlı Pratik
                      </Link>
                      <Link href="/lesson" className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10">
                        📖 Ders
                      </Link>
                      <Link href={`/courses/${e.language_code}/${e.level}`} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10">
                        Sonraki Ünite →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Surface>
        )}

        {/* ── Son hatalar + Kelimeler ─────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Surface>
            <SectionHeader
              eyebrow="Hafıza"
              title="Son Hatalar"
              description="AI'nin kaydettiği düzeltmeler"
            />
            {mistakeRows.length > 0 ? (
              <div className="mt-5 space-y-4">
                {mistakeRows.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">Hatalı</div>
                    <div className="text-sm text-slate-300 line-through">{item.wrong_sentence || "—"}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-cyan-400 mt-3 mb-1">Doğrusu</div>
                    <div className="text-sm text-cyan-300 font-medium">{item.correct_sentence || "—"}</div>
                    {item.explanation && (
                      <>
                        <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-3 mb-1">Neden</div>
                        <div className="text-xs text-slate-400">{item.explanation}</div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-3xl mb-3">🧠</p>
                <p className="text-sm text-slate-400">Henüz hata kaydı yok.</p>
                <p className="text-xs text-slate-600 mt-1">İlk konuşmandan sonra hatalar burada görünür.</p>
                <Link href="/live" className="mt-4 inline-block rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10">
                  Konuşmaya Başla →
                </Link>
              </div>
            )}
          </Surface>

          <Surface>
            <SectionHeader
              eyebrow="Kelime Hazinesi"
              title="Son Kelimeler"
              description="Öğrendiğin kelimeler"
            />
            {wordRows.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {wordRows.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <div className="font-semibold text-white">{item.word || "—"}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      Güç: {item.strength || 1}/5
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        style={{ width: `${Math.min((item.strength || 1) * 20, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-3xl mb-3">📝</p>
                <p className="text-sm text-slate-400">Henüz kelime kaydı yok.</p>
                <p className="text-xs text-slate-600 mt-1">Konuşmalar sırasında öğrenilen kelimeler burada görünür.</p>
              </div>
            )}
          </Surface>
        </div>

        {/* ── Profil özeti ─────────────────────────────────────────────── */}
        <Surface>
          <SectionHeader
            eyebrow="Profil"
            title="Öğrenme Profilin"
            description="Onboarding'de seçtiğin ayarlar"
          />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Ad", value: profile?.full_name },
              { label: "Ana Dil", value: profile?.native_language },
              { label: "Hedef Dil", value: profile?.target_language },
              { label: "Seviye", value: profile?.difficulty_level },
              { label: "Amaç", value: profile?.learning_stage },
            ].map((item) => (
              <div key={item.label} className="panel-dark p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                <div className="mt-2 text-sm font-medium text-white">{item.value || "—"}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/profile" className="soft-button">🏆 Rozetler & Sertifikalar</Link>
            <Link href="/feedback" className="soft-button">💬 Feedback</Link>
          </div>
        </Surface>

      </div>
    </main>
  );
}
