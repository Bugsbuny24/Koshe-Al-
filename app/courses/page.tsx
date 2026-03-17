import Link from "next/link";
import { getAvailableLanguages } from "@/lib/constants/curriculum";

export const metadata = {
  title: "Fakülte | Yabancı Dil Üniversitesi",
  description: "İngilizce, Almanca ve Fransızca 4 yıllık lisans programları",
};

export default function CoursesPage() {
  const programs = getAvailableLanguages();

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* ── Fakülte Başlığı ─────────────────────────────────────────── */}
        <div className="mb-10 rounded-[28px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
            Yabancı Dil Üniversitesi
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Yabancı Diller Fakültesi
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Gerçek bir üniversite müfredatı — 4 yıl, 8 yarıyıl, zorunlu ve
            seçmeli dersler; dilbilgisinden edebiyata, çeviriden dilbilime
            uzanan tam bir lisans programı.
          </p>

          {/* Program özellikleri */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: "🎓", label: "4 Yıllık Lisans" },
              { icon: "📅", label: "8 Yarıyıl" },
              { icon: "📚", label: "Zorunlu & Seçmeli Dersler" },
              { icon: "🏛️", label: "AKTS Kredili" },
              { icon: "🤖", label: "AI Konuşma Pratiği" },
            ].map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
              >
                {f.icon} {f.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Fakülte İstatistikleri ─────────────────────────────────── */}
        <div className="mb-10 grid gap-4 sm:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-white">{programs.length}</div>
            <div className="mt-1 text-sm text-slate-400">Bölüm</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-white">8</div>
            <div className="mt-1 text-sm text-slate-400">Yarıyıl / Bölüm</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-white">
              {programs.reduce((sum, p) => sum + p.totalSubjects, 0)}+
            </div>
            <div className="mt-1 text-sm text-slate-400">Toplam Ders</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-3xl font-bold text-white">240</div>
            <div className="mt-1 text-sm text-slate-400">AKTS Kredi (hedef)</div>
          </div>
        </div>

        {/* ── Bölüm Kartları ─────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Bölümler</h2>
            <p className="mt-1 text-sm text-slate-400">
              Bir bölüme tıklayarak 4 yıllık müfredatı inceleyin.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {programs.map((prog) => (
              <Link
                key={prog.code}
                href={`/courses/${prog.code}`}
                className="group flex flex-col rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{prog.flag}</span>
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {prog.name}
                    </div>
                    <div className="mt-1 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {prog.programTitle}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                    <div className="text-lg font-bold text-white">4</div>
                    <div className="text-xs text-slate-400">Yıl</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                    <div className="text-lg font-bold text-white">{prog.semesterCount}</div>
                    <div className="text-xs text-slate-400">Yarıyıl</div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-center">
                    <div className="text-lg font-bold text-white">{prog.totalSubjects}</div>
                    <div className="text-xs text-slate-400">Ders</div>
                  </div>
                </div>

                {/* Yıl göstergesi */}
                <div className="mt-5 flex gap-2">
                  {[1, 2, 3, 4].map((y) => (
                    <div
                      key={y}
                      className="flex-1 rounded-xl border border-white/10 bg-black/20 py-1 text-center text-xs text-slate-400"
                    >
                      {y}. Yıl
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    ~{prog.totalCredits} AKTS
                  </span>
                  <span className="text-xs text-cyan-400 group-hover:underline">
                    Müfredatı İncele →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Müfredat Açıklaması ───────────────────────────────────── */}
        <section className="mb-12">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              Gerçek Üniversite Müfredatı
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-7">
              Her bölüm, Türkiye'deki yabancı dil fakültelerinin standart
              müfredatı esas alınarak hazırlanmıştır. Program; dil becerileri,
              dilbilim, edebiyat, çeviri ve mesleki dil derslerini kapsar.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Dil Becerileri", desc: "Okuma, Yazma, Dinleme, Konuşma dersleri her yıl", icon: "💬" },
                { title: "Dilbilim", desc: "Sesbilim, Sözdizimi, Anlambilim, Pragmatik, Biçimbilim", icon: "🔬" },
                { title: "Edebiyat", desc: "Dönem dönem ilerleme; başlangıçtan çağdaşa", icon: "📖" },
                { title: "Çeviri", desc: "Temel çeviriden uzmanlık çevirisine; CAT araçları", icon: "🌐" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <div className="mt-2 font-semibold text-white">{item.title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Ortak Zorunlu Dersler ─────────────────────────────────── */}
        <section className="mb-12">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white">
              Tüm Bölümlerde Ortak Zorunlu Dersler
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              1. Sınıf her yarıyılında yer alan üniversite geneli zorunlu dersler
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                { code: "ATA101/102", title: "Atatürk İlkeleri ve İnkılâp Tarihi I-II", credits: "2+2 AKTS" },
                { code: "TDL101/102", title: "Türk Dili I-II", credits: "2+2 AKTS" },
                { code: "YDL101/102", title: "İkinci Yabancı Dil I-II", credits: "2+2 AKTS" },
                { code: "DIL101", title: "Dilbilime Giriş", credits: "3 AKTS" },
              ].map((c) => (
                <div
                  key={c.code}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <span className="rounded-full border border-slate-600/50 bg-slate-700/30 px-2 py-0.5 text-xs font-mono text-slate-300">
                    {c.code}
                  </span>
                  <div className="mt-2 text-sm font-medium text-white">{c.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{c.credits}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 px-6 py-10 text-center backdrop-blur-xl sm:px-12">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Öğrendiklerini AI ile Pekiştir
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-300">
            Ders materyallerini tamamladıktan sonra AI konuşma pratiği ile
            gerçek hayat iletişimine hazırlan.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              🎤 Konuşma Pratiği Başlat
            </Link>
            <Link
              href="/lesson"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-100 transition hover:border-white/20 hover:bg-white/10"
            >
              📖 Günlük Derse Git
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
