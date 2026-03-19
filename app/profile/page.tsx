import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CollectibleRewardRecord } from "@/types/university";
import { getAcademicContext } from "@/lib/data/academic-catalog";
import { getMentorForLanguage } from "@/lib/data/mentors";
import CreditDisplay from "@/components/credits/CreditDisplay";

type ProfileRow = {
  full_name: string | null;
  email: string | null;
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
  current_unit: number | null;
  completed_units_count: number | null;
  total_units_count: number | null;
  status: string | null;
};

type AchievementRow = {
  id: string;
  code: string;
  title: string;
  description: string | null;
  image_url: string | null;
  level: string | null;
  earned_at: string | null;
};

type CertificateRow = {
  id: string;
  course_id: string;
  language_code: string;
  level: string;
  title: string;
  image_url: string | null;
  issued_at: string | null;
};

function progressColor(progress: number) {
  if (progress >= 100) return "from-amber-400 to-yellow-500";
  if (progress >= 80) return "from-fuchsia-500 to-violet-500";
  if (progress >= 50) return "from-cyan-400 to-blue-500";
  return "from-slate-500 to-slate-400";
}

const rarityColors: Record<string, string> = {
  common: "text-slate-400 border-slate-400/20",
  uncommon: "text-cyan-400 border-cyan-400/20",
  rare: "text-violet-400 border-violet-400/20",
  epic: "text-fuchsia-400 border-fuchsia-400/20",
  legendary: "text-amber-400 border-amber-400/30",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    { data: profile },
    { data: enrollments },
    { data: achievements },
    { data: certificates },
    { data: collectibles },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name,email,native_language,target_language,difficulty_level,learning_stage"
      )
      .eq("id", user.id)
      .single<ProfileRow>(),
    supabase
      .from("course_enrollments")
      .select(
        "course_id,language_code,level,progress_percent,current_unit,completed_units_count,total_units_count,status"
      )
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .returns<EnrollmentRow[]>(),
    supabase
      .from("achievements")
      .select("id,code,title,description,image_url,level,earned_at")
      .eq("user_id", user.id)
      .order("earned_at", { ascending: false })
      .returns<AchievementRow[]>(),
    supabase
      .from("certificates")
      .select("id,course_id,language_code,level,title,image_url,issued_at")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false })
      .returns<CertificateRow[]>(),
    supabase
      .from("collectible_rewards")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .returns<CollectibleRewardRecord[]>(),
  ]);

  const activeEnrollment = enrollments?.[0] || null;

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* ── Hero / header ─────────────────────────────────────────────────── */}
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-6 backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            {/* Left — avatar + info */}
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-2xl font-bold">
                  {(profile?.full_name || "K").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold">
                    {profile?.full_name || "Koshei Student"}
                  </h1>
                  <p className="text-sm text-slate-300">
                    {profile?.email || user.email || "-"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-300/70">
                    Koshei AI University
                  </p>
                  <Link
                    href="/profile/edit"
                    className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                  >
                    ✏️ Profili Düzenle
                  </Link>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-200">
                {[
                  { label: "Ana Dil", value: profile?.native_language },
                  { label: "Hedef Dil", value: profile?.target_language },
                  { label: "Seviye", value: profile?.difficulty_level },
                  { label: "Amaç", value: profile?.learning_stage },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {item.label}
                    </div>
                    <div className="mt-2">{item.value || "-"}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/profile/edit"
                className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10"
              >
                ✏️ Profili Düzenle
              </Link>

              <Link
                href="/courses"
                className="mt-5 block w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                Kurslara Göz At
              </Link>
            </div>

            {/* Right — stats + active enrollment */}
            <div className="grid gap-6">
              {/* Stat cards */}
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  { label: "Rozetler", value: achievements?.length || 0 },
                  { label: "Sertifikalar", value: certificates?.length || 0 },
                  { label: "Aktif Kurs", value: enrollments?.length || 0 },
                  { label: "Koleksiyonlar", value: collectibles?.length || 0 },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                      {s.label}
                    </div>
                    <div className="mt-3 text-3xl font-bold">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Active enrollment progress */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                  Eğitim Yolculuğu
                </div>
                <h2 className="mt-2 text-2xl font-semibold">Aktif İlerleme</h2>

                {activeEnrollment ? (
                  <div className="mt-6">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                      {/* Academic breadcrumb */}
                      {(() => {
                        const ctx = getAcademicContext(
                          activeEnrollment.language_code,
                          activeEnrollment.level
                        );
                        return (
                          <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                            <span>{ctx.facultyName}</span>
                            <span>›</span>
                            <span className="text-slate-400">{ctx.programTitle}</span>
                            {ctx.courseTitle ? (
                              <>
                                <span>›</span>
                                <span className="text-cyan-400">{ctx.courseTitle}</span>
                              </>
                            ) : null}
                          </div>
                        );
                      })()}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-lg font-semibold">
                            {activeEnrollment.course_id}
                          </div>
                          <div className="mt-1 text-sm text-slate-400">
                            {activeEnrollment.language_code.toUpperCase()} •{" "}
                            {activeEnrollment.level}
                          </div>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                          {activeEnrollment.completed_units_count || 0} /{" "}
                          {activeEnrollment.total_units_count || 0} unit
                        </div>
                      </div>

                      <div className="mt-5">
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                          <span>İlerleme</span>
                          <span>{activeEnrollment.progress_percent || 0}%</span>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${progressColor(
                              activeEnrollment.progress_percent || 0
                            )}`}
                            style={{
                              width: `${activeEnrollment.progress_percent || 0}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        {[
                          {
                            label: "Sonraki Unit",
                            value: activeEnrollment.current_unit || 1,
                          },
                          {
                            label: "Durum",
                            value: activeEnrollment.status || "active",
                          },
                          { label: "Seviye", value: activeEnrollment.level },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                              {item.label}
                            </div>
                            <div className="mt-2 text-xl font-semibold">
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6">
                    <p className="text-slate-400">
                      Henüz aktif kurs kaydın yok.
                    </p>
                    <Link
                      href="/courses"
                      className="mt-4 inline-block rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
                    >
                      Kurslara Göz At →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Badges + Certificates ─────────────────────────────────────────── */}
        <section className="mt-8 grid gap-6 xl:grid-cols-2">
          {/* Badges */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
              Rozetler
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Kazanılan Rozetler</h2>

            {achievements && achievements.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {achievements.map((badge) => (
                  <div
                    key={badge.id}
                    className="rounded-3xl border border-white/10 bg-black/20 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        {badge.image_url ? (
                          <Image
                            src={badge.image_url}
                            alt={badge.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            🏅
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-lg font-semibold">{badge.title}</div>
                        <div className="mt-1 text-sm text-slate-400">
                          {badge.description || "Kazanılmış başarı rozeti"}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] text-cyan-300">
                          {badge.level || "GENEL"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <div className="text-3xl">🏅</div>
                <p className="mt-3 text-sm font-medium text-slate-300">Henüz rozet kazanılmadı</p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/10"
                >
                  📚 Programlara Göz At →
                </Link>
              </div>
            )}
          </div>

          {/* Certificates */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">
              Sertifikalar
            </div>
            <h2 className="mt-2 text-2xl font-semibold">Sertifikalarım</h2>

            {certificates && certificates.length > 0 ? (
              <div className="mt-6 grid gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-3xl border border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-500/10 to-amber-500/10 p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        {cert.image_url ? (
                          <Image
                            src={cert.image_url}
                            alt={cert.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-3xl">
                            🎓
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-xl font-semibold">{cert.title}</div>
                        <div className="mt-1 text-sm text-slate-300">
                          {cert.language_code.toUpperCase()} • {cert.level}
                        </div>
                        <div className="mt-2 text-xs uppercase tracking-[0.2em] text-amber-300">
                          Veriliş:{" "}
                          {cert.issued_at
                            ? new Date(cert.issued_at).toLocaleDateString(
                                "tr-TR"
                              )
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-fuchsia-500/20 p-8 text-center">
                <div className="text-3xl">🎓</div>
                <p className="mt-3 text-sm font-medium text-slate-300">Henüz sertifika kazanılmadı</p>
                <Link
                  href="/courses"
                  className="mt-4 inline-flex items-center gap-1 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-4 py-2 text-xs text-fuchsia-300 transition hover:bg-fuchsia-500/20"
                >
                  🎓 Programa Başla →
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── NFT Collectibles ──────────────────────────────────────────────── */}
        <section className="mt-8 rounded-3xl border border-amber-400/20 bg-gradient-to-r from-amber-500/5 to-fuchsia-500/5 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-300">
            NFT Koleksiyonu
          </div>
          <h2 className="mt-2 text-2xl font-semibold">
            Dijital Ödül Koleksiyonum
          </h2>

          {collectibles && collectibles.length > 0 ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {collectibles.map((item) => {
                const rarityClass =
                  rarityColors[item.rarity] ?? rarityColors.common;
                return (
                  <div
                    key={item.id}
                    className={`rounded-3xl border bg-black/30 p-5 ${rarityClass}`}
                  >
                    <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={item.image_url}
                        alt={item.token_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-white">
                        {item.token_name}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {item.token_symbol}
                      </div>
                      <div
                        className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-medium uppercase tracking-[0.15em] ${rarityClass}`}
                      >
                        {item.rarity}
                      </div>
                      <div className="mt-3 flex justify-center gap-2">
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400 capitalize">
                          {item.source_type}
                        </span>
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400">
                          {item.mint_status === "draft"
                            ? "Draft"
                            : item.mint_status}
                        </span>
                      </div>
                      {item.downloadable_file_url && (
                        <a
                          href={item.downloadable_file_url}
                          download
                          className="mt-3 block rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                        >
                          ↓ İndir
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-dashed border-white/10 p-10 text-center">
              <div className="text-4xl">💎</div>
              <p className="mt-4 text-sm font-medium text-slate-300">
                Henüz koleksiyonel ödül kazanılmadı.
              </p>
              <Link
                href="/courses"
                className="mt-5 inline-block rounded-2xl bg-gradient-to-r from-amber-500 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Kurslara Göz At
              </Link>
            </div>
          )}
        </section>

        {/* ── Academic Journey ──────────────────────────────────────────────── */}
        <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
            Akademik Yolculuk
          </div>
          <h2 className="mt-2 text-2xl font-semibold">Program Geçmişim</h2>

          {enrollments && enrollments.length > 0 ? (
            <div className="mt-6 space-y-3">
              {enrollments.map((e) => {
                const ctx = getAcademicContext(e.language_code, e.level);
                const mentor = getMentorForLanguage(e.language_code);
                const progress = e.progress_percent || 0;
                return (
                  <div
                    key={e.course_id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${mentor.gradientFrom} ${mentor.gradientTo} text-xs font-bold text-white`}
                        >
                          {mentor.avatarInitials}
                        </div>
                        <div>
                          <div className="font-medium text-white">{ctx.programTitle}</div>
                          <div className="text-xs text-slate-500">
                            {ctx.facultyName} · {e.level} · {e.completed_units_count || 0}/{e.total_units_count || 0} ünite
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-white">{progress}%</div>
                          <div className={`text-xs capitalize ${e.status === "completed" ? "text-emerald-400" : "text-slate-500"}`}>
                            {e.status === "completed" ? "Tamamlandı" : e.status === "active" ? "Aktif" : e.status || "aktif"}
                          </div>
                        </div>
                        <Link
                          href={`/courses/${e.language_code}`}
                          className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
                        >
                          Devam Et →
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${
                            progress >= 100
                              ? "from-amber-400 to-yellow-500"
                              : progress >= 80
                              ? "from-fuchsia-500 to-violet-500"
                              : progress >= 50
                              ? "from-cyan-400 to-blue-500"
                              : "from-slate-500 to-slate-400"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-slate-400">Henüz program kaydın yok.</p>
              <Link
                href="/courses"
                className="mt-4 inline-block rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
              >
                Programlara Göz At →
              </Link>
            </div>
          )}

          {/* Journey CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/live"
              className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90"
            >
              🎤 Canlı Pratiğe Geç
            </Link>
            <Link
              href="/lesson"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >
              📖 Günlük Ders
            </Link>
            <Link
              href="/courses"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >
              📚 Tüm Programlar
            </Link>
          </div>
        </section>

        {/* ── Journey Map ───────────────────────────────────────────────────── */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Eğitim Seviyeleri
          </div>
          <h2 className="mt-2 text-2xl font-semibold">Yolculuk Haritası</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { title: "Başlangıç", subtitle: "A1-A2 • İlk adım", active: true },
              {
                title: "Orta Seviye",
                subtitle: "B1 • Temel iletişim",
                active: (achievements?.length || 0) >= 1,
              },
              {
                title: "İleri Seviye",
                subtitle: "B2-C1 • Akıcı konuşma",
                active: (certificates?.length || 0) >= 1,
              },
              {
                title: "Usta",
                subtitle: "C2 • Tam hakimiyet",
                active: (certificates?.length || 0) >= 2,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-3xl border p-5 ${
                  item.active
                    ? "border-amber-400/30 bg-amber-500/10"
                    : "border-white/10 bg-black/20"
                }`}
              >
                <div className="text-lg font-semibold">{item.title}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {item.subtitle}
                </div>
                <div className="mt-3 text-sm font-medium">
                  {item.active ? (
                    <span className="text-amber-300">✓ Açıldı</span>
                  ) : (
                    <span className="text-slate-500">🔒 Kilitli</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Credit Balance ────────────────────────────────────────────────── */}
        <section className="mt-8">
          <CreditDisplay variant="full" />
        </section>

        {/* ── Kredi Paketleri CTA ───────────────────────────────────────────── */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Kredi Paketleri
          </p>
          <div className="mt-4">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90"
            >
              ✦ Paketleri Gör
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
