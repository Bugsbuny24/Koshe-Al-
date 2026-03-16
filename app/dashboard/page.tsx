import Link from "next/link";

const quickActions = [
  {
    title: "Canlı Konuşma",
    description: "AI ile sesli konuşma pratiğine başla.",
    href: "/live",
  },
  {
    title: "Ders Modu",
    description: "Yapılandırılmış konuşma derslerini aç.",
    href: "/lesson",
  },
  {
    title: "Profil",
    description: "Dil hedeflerini ve ayarlarını güncelle.",
    href: "/profile",
  },
];

const progressCards = [
  { label: "Fluency", value: "72%" },
  { label: "Grammar", value: "65%" },
  { label: "Vocabulary", value: "70%" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-blue-500/10 to-cyan-500/10 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm uppercase tracking-[0.25em] text-cyan-300">
              Dashboard
            </div>
            <h1 className="mt-2 text-3xl font-semibold">Hoş geldin, Onur</h1>
            <p className="mt-2 text-slate-300">
              Bugün konuşma pratiği yap, hatalarını düzelt ve streak’ini koru.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/live"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 font-medium text-white transition hover:opacity-90"
            >
              Canlı Konuşma
            </Link>
            <Link
              href="/lesson"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-slate-100 transition hover:bg-white/10"
            >
              Dersleri Aç
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Speaking Streak</div>
            <div className="mt-2 text-3xl font-semibold">7 gün 🔥</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Toplam Oturum</div>
            <div className="mt-2 text-3xl font-semibold">18</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Aktif Dil</div>
            <div className="mt-2 text-3xl font-semibold">İngilizce</div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-slate-400">Plan</div>
            <div className="mt-2 text-3xl font-semibold">All Access</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold">Bugünkü Konuşma Hedefi</div>
                <div className="mt-1 text-sm text-slate-400">
                  10 dakikalık konuşma pratiği tamamla
                </div>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                Devam ediyor
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
                <span>İlerleme</span>
                <span>6 / 10 dk</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[60%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {progressCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="text-sm text-slate-400">{card.label}</div>
                  <div className="mt-2 text-2xl font-semibold">{card.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-semibold">Hızlı Erişim</div>
            <div className="mt-5 space-y-4">
              {quickActions.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/5"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-400">{item.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-semibold">Son Düzeltmeler</div>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="text-sm text-slate-300">Yanlış</div>
                <div className="mt-1 text-white">I want improve my speaking.</div>
                <div className="mt-3 text-sm text-slate-300">Doğru</div>
                <div className="mt-1 text-cyan-300">I want to improve my speaking.</div>
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="text-sm text-slate-300">Yanlış</div>
                <div className="mt-1 text-white">She go to work every day.</div>
                <div className="mt-3 text-sm text-slate-300">Doğru</div>
                <div className="mt-1 text-cyan-300">She goes to work every day.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="text-xl font-semibold">Önerilen Senaryolar</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Restaurant",
                "Job Interview",
                "Airport Check-in",
                "Business Meeting",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="font-medium">{item}</div>
                  <div className="mt-2 text-sm text-slate-400">
                    Gerçek hayata uygun konuşma pratiği
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
          }
