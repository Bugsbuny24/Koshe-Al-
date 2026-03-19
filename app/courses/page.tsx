import Link from "next/link";
import { DEPARTMENTS } from "@/lib/data/curriculum";
import { getMentorForLanguage } from "@/lib/data/mentors";

export const metadata = {
  title: "Koshei AI — Programlar",
  description: "Dil programlarına katıl. 12 dil, 6 seviye, AI destekli öğrenme.",
};

// Career/usage area for each language
const LANG_CAREER: Record<string, string> = {
  en: "İş, akademi, teknoloji ve uluslararası iletişim",
  de: "Almanya, Avusturya, İsviçre — AB kariyer fırsatları",
  fr: "Diplomasi, moda, kültür ve Frankofon ülkeler",
  es: "Latin Amerika, İspanya — 20+ ülkede geçerli",
  it: "Müzik, sanat, gastronomi ve İtalya kariyer",
  ru: "Doğu Avrupa ve Orta Asya iş dünyası",
  ja: "Teknoloji, anime, Japonya kariyer ve kültürü",
  zh: "Çin ticaret dünyası ve global finans",
  ar: "Orta Doğu, Kuzey Afrika — 22 ülkede resmi dil",
  ko: "K-pop, K-drama, teknoloji ve Kore kariyer",
  pt: "Brezilya, Portekiz — geniş konuşmacı topluluğu",
  hi: "Hindistan teknoloji ve iş dünyası",
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold sm:text-5xl">Programlar</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Bir programa katıl, AI mentorunla dersler al, skor kazan ve ilerle.
          </p>
        </section>

        {/* Program grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {DEPARTMENTS.map((dept) => {
            const mentor = getMentorForLanguage(dept.code);
            const career = LANG_CAREER[dept.code];
            return (
              <div
                key={dept.code}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]"
              >
                {/* Card header */}
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{dept.icon}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                    {dept.levels.length} seviye
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-white">{dept.name}</h2>
                <p className="mt-0.5 text-sm text-slate-400">{dept.nativeName}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-300">
                  {dept.description}
                </p>

                {career && (
                  <p className="mt-2 text-xs text-slate-500">{career}</p>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r ${mentor.gradientFrom} ${mentor.gradientTo} text-[10px] font-bold text-white`}
                  >
                    {mentor.avatarInitials.slice(0, 1)}
                  </span>
                  <span>Mentor: {mentor.name}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
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

                {/* JOIN action */}
                <div className="mt-5 flex gap-2">
                  <Link
                    href={`/courses/${dept.code}/${dept.levels[0]?.level ?? "A1"}`}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(34,211,238,0.2)] transition hover:opacity-90"
                  >
                    Katıl →
                  </Link>
                  <Link
                    href={`/courses/${dept.code}`}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/10"
                    title="Tüm seviyeleri gör"
                  >
                    ⋯
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
