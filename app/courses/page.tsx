import Link from "next/link";
import { DEPARTMENTS } from "@/lib/data/curriculum";
import { getMentorForLanguage } from "@/lib/data/mentors";

export const metadata = {
  title: "Koshei AI — Kurslar",
  description: "Yabancı dil kurslarına göz at. 12 dil, 6 seviye, AI destekli öğrenme.",
};

const TOTAL_UNITS = DEPARTMENTS.reduce(
  (acc, d) => acc + d.levels.reduce((la, l) => la + l.units.length, 0),
  0
);

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
        {/* Hero */}
        <section className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
            Koshei AI Foreign Language University
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Dil Departmanları
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            12 dil, 6 seviye (A1→C2), AI destekli mentor, başarı rozetleri ve sertifikalar.
            Her program kendi kariyer odağıyla gelir.
          </p>
        </section>

        {/* How it works context */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {[
            {
              icon: "📚",
              title: "Neden bu departmanlar?",
              desc: "Her dil, farklı bir kariyer yoluna kapı açar. AI mentor seni seviyene göre yönlendirir.",
            },
            {
              icon: "🔼",
              title: "Nasıl ilerlenir?",
              desc: "A1'den başla, her seviyeyi tamamla, bir üst seviyeye geç. Koshei sana özel ders ve pratik düzenler.",
            },
            {
              icon: "🏅",
              title: "Rozet & Sertifika",
              desc: "Her seviyede rozet, her programın sonunda sertifika. Akademik gelişimin dijital kanıtı.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className="mt-0.5 text-xl">{item.icon}</span>
              <div>
                <div className="text-sm font-medium text-slate-200">{item.title}</div>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

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
          {DEPARTMENTS.map((dept) => {
            const mentor = getMentorForLanguage(dept.code);
            const totalUnits = dept.levels.reduce((a, l) => a + l.units.length, 0);
            const career = LANG_CAREER[dept.code];
            const isBeginnerFriendly = dept.levels.some((l) => l.level === "A1");
            return (
              <Link
                key={dept.code}
                href={`/courses/${dept.code}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/8 hover:shadow-[0_0_40px_rgba(34,211,238,0.1)]"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{dept.icon}</span>
                  <div className="flex flex-col items-end gap-1">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-400">
                      {dept.levels.length} seviye
                    </span>
                    {isBeginnerFriendly && (
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-300">
                        Başlangıç ✓
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-white">{dept.name}</h2>
                <p className="mt-0.5 text-sm text-slate-400">{dept.nativeName}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {dept.description}
                </p>

                {career && (
                  <p className="mt-2 text-xs text-slate-500">{career}</p>
                )}

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r ${mentor.gradientFrom} ${mentor.gradientTo} text-[10px] font-bold text-white`}>
                    {mentor.avatarInitials.slice(0, 1)}
                  </span>
                  <span>Mentor: {mentor.name}</span>
                  <span className="ml-auto rounded-lg bg-white/5 px-2 py-0.5">{totalUnits} ünite</span>
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

                <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span>🏅</span> Rozet
                  </span>
                  <span className="flex items-center gap-1">
                    <span>📜</span> Sertifika
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-300 opacity-0 transition-opacity group-hover:opacity-100">
                  Kurslara bak →
                </div>
              </Link>
            );
          })}
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
