import Link from "next/link";
import { DEPARTMENTS } from "@/lib/data/curriculum";

export const metadata = {
  title: "Koshei AI — Kurslar",
  description: "Yabancı dil kurslarına göz at. 12 dil, 6 seviye, AI destekli öğrenme.",
};

const TOTAL_UNITS = DEPARTMENTS.reduce(
  (acc, d) => acc + d.levels.reduce((la, l) => la + l.units.length, 0),
  0
);

export default function CoursesPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <section className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
            Koshei AI Foreign Language University
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Dil Departmanları
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            12 dil, 6 seviye (A1→C2), AI destekli öğretmen, başarı rozetleri ve
            sertifikalar. Ücretsiz başla.
          </p>
        </section>

        {/* Stats bar */}
        <div className="mb-10 grid grid-cols-3 divide-x divide-white/10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
          {[
            { label: "Dil", value: DEPARTMENTS.length },
            { label: "Seviye", value: 6 },
            { label: "Toplam Unit", value: TOTAL_UNITS },
          ].map((s) => (
            <div key={s.label} className="py-5 text-center">
              <div className="text-2xl font-bold text-cyan-300">{s.value}+</div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Department grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.code}
              href={`/courses/${dept.code}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/8 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-4xl">{dept.icon}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  {dept.levels.length} seviye
                </span>
              </div>

              <h2 className="text-xl font-semibold text-white">{dept.name}</h2>
              <p className="mt-1 text-sm text-slate-400">{dept.nativeName}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                {dept.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {dept.levels.slice(0, 4).map((l) => (
                  <span
                    key={l.level}
                    className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400"
                  >
                    {l.level}
                  </span>
                ))}
                {dept.levels.length > 4 && (
                  <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-400">
                    +{dept.levels.length - 4}
                  </span>
                )}
              </div>

              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100">
                Kurslara bak →
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 p-8 text-center">
          <h2 className="text-2xl font-bold">AI Öğretmeninle Konuşmaya Başla</h2>
          <p className="mt-3 text-slate-400">
            Kursa kayıt olmadan da AI öğretmeninle anlık pratik yapabilirsin.
          </p>
          <Link
            href="/live"
            className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
          >
            Konuşmaya Başla
          </Link>
        </div>
      </div>
    </main>
  );
}
