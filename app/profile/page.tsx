import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
      "full_name,email,native_language,target_language,difficulty_level,learning_stage"
    )
    .eq("id", user.id)
    .single<ProfileRow>();

  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select(
      "course_id,language_code,level,progress_percent,current_unit,completed_units_count,total_units_count,status"
    )
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<EnrollmentRow[]>();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("id,code,title,description,image_url,level,earned_at")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false })
    .returns<AchievementRow[]>();

  const { data: certificates } = await supabase
    .from("certificates")
    .select("id,course_id,language_code,level,title,image_url,issued_at")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })
    .returns<CertificateRow[]>();

  const activeEnrollment = enrollments?.[0] || null;

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-6 backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 text-2xl font-bold">
                  {(profile?.full_name || "K")
                    .slice(0, 1)
                    .toUpperCase()}
                </div>

                <div>
                  <h1 className="text-2xl font-semibold">
                    {profile?.full_name || "Koshei Student"}
                  </h1>
                  <p className="text-sm text-slate-300">
                    {profile?.email || user.email || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Ana Dil
                  </div>
                  <div className="mt-2">{profile?.native_language || "-"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Hedef Dil
                  </div>
                  <div className="mt-2">{profile?.target_language || "-"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Seviye
                  </div>
                  <div className="mt-2">{profile?.difficulty_level || "-"}</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Amaç
                  </div>
                  <div className="mt-2">{profile?.learning_stage || "-"}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Rozetler
                  </div>
                  <div className="mt-3 text-3xl font-bold">
                    {achievements?.length || 0}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Sertifikalar
                  </div>
                  <div className="mt-3 text-3xl font-bold">
                    {certificates?.length || 0}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    Aktif Kurs
                  </div>
                  <div className="mt-3 text-3xl font-bold">
                    {enrollments?.length || 0}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                      Eğitim Yolculuğu
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold">
                      Aktif İlerleme
                    </h2>
                  </div>
                </div>

                {activeEnrollment ? (
                  <div className="mt-6">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
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
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Sonraki Unit
                          </div>
                          <div className="mt-2 text-xl font-semibold">
                            {activeEnrollment.current_unit || 1}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Durum
                          </div>
                          <div className="mt-2 text-xl font-semibold">
                            {activeEnrollment.status || "active"}
                          </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Seviye
                          </div>
                          <div className="mt-2 text-xl font-semibold">
                            {activeEnrollment.level}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-slate-400">
                    Henüz aktif kurs kaydın yok.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-2">
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
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
              <p className="mt-6 text-slate-400">Henüz rozet kazanılmadı.</p>
            )}
          </div>

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
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
                            ? new Date(cert.issued_at).toLocaleDateString("tr-TR")
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-6 text-slate-400">
                Henüz sertifika kazanılmadı.
              </p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-300">
            Eğitim Seviyeleri
          </div>
          <h2 className="mt-2 text-2xl font-semibold">Yolculuk Haritası</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { title: "Başlangıç", active: true },
              { title: "Orta Seviye", active: (achievements?.length || 0) >= 1 },
              { title: "İleri Seviye", active: (certificates?.length || 0) >= 1 },
              { title: "Usta", active: (certificates?.length || 0) >= 2 },
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
                <div className="mt-2 text-sm text-slate-400">
                  {item.active ? "Açıldı" : "Kilitli"}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
              }
