import Link from "next/link";
import { UNIVERSITY_TEMPLATES } from "@/lib/data/university-templates";

export const metadata = {
  title: "Koshei AI — Üniversiteler",
  description:
    "Koshei AI University ortaklık ağındaki dünya standartlarında üniversiteleri keşfet. Harvard, MIT, Oxford ve daha fazlası.",
};

const COUNTRY_EMOJI: Record<string, string> = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  Turkey: "🇹🇷",
  Türkiye: "🇹🇷",
};

export default function UniversitiesPage() {
  const totalFaculties = UNIVERSITY_TEMPLATES.reduce(
    (a, u) => a + u.faculties.length,
    0
  );
  const totalDepartments = UNIVERSITY_TEMPLATES.reduce(
    (a, u) => a + u.faculties.reduce((b, f) => b + f.departments.length, 0),
    0
  );
  const totalPrograms = UNIVERSITY_TEMPLATES.reduce(
    (a, u) =>
      a +
      u.faculties.reduce(
        (b, f) =>
          b + f.departments.reduce((c, d) => c + d.programs.length, 0),
        0
      ),
    0
  );

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <section className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
            Koshei AI University
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Partner Üniversiteler
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Dünya&apos;nın en prestijli üniversitelerinden ilham alan akademik
            programlarla öğren. Her fakülte, AI mentor desteğiyle doğrudan
            eğitiminize entegre edilmiştir.
          </p>
        </section>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-4 divide-x divide-white/10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
          {[
            { label: "Üniversite", value: UNIVERSITY_TEMPLATES.length },
            { label: "Fakülte", value: totalFaculties },
            { label: "Bölüm", value: totalDepartments },
            { label: "Program", value: totalPrograms },
          ].map((s) => (
            <div key={s.label} className="py-5 text-center">
              <div className="text-2xl font-bold text-cyan-300">{s.value}+</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* University grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {UNIVERSITY_TEMPLATES.map((univ) => {
            const flag = COUNTRY_EMOJI[univ.country] ?? "🏛️";
            const deptCount = univ.faculties.reduce(
              (a, f) => a + f.departments.length,
              0
            );
            const progCount = univ.faculties.reduce(
              (a, f) =>
                a + f.departments.reduce((b, d) => b + d.programs.length, 0),
              0
            );

            return (
              <div
                key={univ.code}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/8 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]"
              >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 text-xl ring-1 ring-white/10">
                    🎓
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                      {flag} {univ.country}
                    </span>
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-300">
                      {univ.code}
                    </span>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-white">
                  {univ.name}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  İlham: {univ.inspired_by}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 line-clamp-3">
                  {univ.description}
                </p>

                {/* Stats row */}
                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>{univ.faculties.length} Fakülte</span>
                  <span className="text-white/20">·</span>
                  <span>{deptCount} Bölüm</span>
                  <span className="text-white/20">·</span>
                  <span>{progCount} Program</span>
                </div>

                {/* Faculty badges */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {univ.faculties.slice(0, 3).map((f) => (
                    <span
                      key={f.code}
                      className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400"
                    >
                      {f.name}
                    </span>
                  ))}
                  {univ.faculties.length > 3 && (
                    <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400">
                      +{univ.faculties.length - 3} daha
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold">
            Akademik Yolculuğuna Başla
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Dil programlarına kayıt ol, AI mentorunla pratik yap ve sertifikana
            kavuş. Ücretsiz başlamak için sadece birkaç saniye yeterli.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
            >
              Ücretsiz Başla
            </Link>
            <Link
              href="/courses"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Kursları İncele
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
