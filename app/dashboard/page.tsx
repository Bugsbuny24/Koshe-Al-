import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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
      "full_name,native_language,target_language,learning_stage,difficulty_level,onboarding_completed"
    )
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  const { count: messageCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: aiUsageCount } = await supabase
    .from("ai_usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: speakingCount } = await supabase
    .from("speaking_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: recentMistakes } = await supabase
    .from("learning_memory")
    .select("wrong_sentence,correct_sentence,explanation,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentMessages } = await supabase
    .from("messages")
    .select("role,content,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_18%),linear-gradient(180deg,#040816_0%,#06112a_48%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8">
        <header className="rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/70">
            Koshei V1 • Dashboard
          </p>
          <h1 className="mt-2 text-2xl font-semibold md:text-3xl">
            Hoş geldin {profile.full_name || "öğrenci"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
            Öğrenme durumun, son hataların ve aktif dil yolculuğun burada.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/live"
              className="rounded-2xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Free Speaking
            </Link>
            <Link
              href="/lesson"
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
            >
              Daily Lesson
            </Link>
          </div>
        </header>

        <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            label="Dil yolu"
            value={`${profile.native_language || "Turkish"} → ${profile.target_language || "English"}`}
          />
          <InfoCard
            label="Stage"
            value={profile.learning_stage || "A1"}
          />
          <InfoCard
            label="Difficulty"
            value={difficultyLabel(profile.difficulty_level)}
          />
          <InfoCard
            label="Mesaj / AI"
            value={`${messageCount || 0} / ${aiUsageCount || 0}`}
          />
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Progress Summary
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Öğrenme özeti
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <StatCard label="Toplam Mesaj" value={String(messageCount || 0)} />
              <StatCard label="AI Oturumu" value={String(aiUsageCount || 0)} />
              <StatCard label="Speaking Session" value={String(speakingCount || 0)} />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
                Aktif hedef
              </p>
              <p className="mt-2 text-sm leading-6 text-cyan-50">
                Şu an hedef dilin <strong>{profile.target_language || "English"}</strong>.
                Sistem seni <strong>{profile.learning_stage || "A1"}</strong> seviyesinde
                ve <strong>{difficultyLabel(profile.difficulty_level)}</strong> yoğunlukta
                çalıştırıyor.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Continue
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Devam et
            </h2>

            <div className="mt-5 space-y-3">
              <ActionCard
                title="Daily Lesson"
                desc="Yapılandırılmış dersi başlat."
                href="/lesson"
              />
              <ActionCard
                title="Free Speaking"
                desc="AI ile serbest konuşma yap."
                href="/live"
              />
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Recent Mistakes
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Son hataların
            </h2>

            <div className="mt-5 space-y-3">
              {recentMistakes?.length ? (
                recentMistakes.map((item, index) => (
                  <div
                    key={`${item.created_at}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-red-200/70">
                      Wrong
                    </p>
                    <p className="mt-1 text-sm text-red-100">
                      {item.wrong_sentence || "-"}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-emerald-200/70">
                      Correct
                    </p>
                    <p className="mt-1 text-sm text-emerald-100">
                      {item.correct_sentence || "-"}
                    </p>

                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-cyan-200/70">
                      Note
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      {item.explanation || "No note"}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyCard text="Henüz kayıtlı hata yok." />
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-cyan-300/12 bg-white/[0.035] p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
              Recent Activity
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Son aktiviteler
            </h2>

            <div className="mt-5 space-y-3">
              {recentMessages?.length ? (
                recentMessages.map((item, index) => (
                  <div
                    key={`${item.created_at}-${index}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-200/70">
                      {item.role}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">
                      {item.content || "-"}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyCard text="Henüz konuşma geçmişi yok." />
              )}
            </div>
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

function ActionCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.08]"
    >
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-300">{desc}</p>
    </Link>
  );
}

function EmptyCard({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}
