import Link from "next/link";

export const metadata = {
  title: "Koshei AI — Hakkımızda",
  description:
    "Koshei AI University hakkında daha fazla bilgi edinin. Misyonumuz, vizyonumuz ve AI destekli eğitim yaklaşımımız.",
};

const FEATURES = [
  {
    icon: "🎤",
    title: "Canlı AI Konuşma Pratiği",
    description:
      "Gerçek zamanlı konuşma tanıma ve AI mentor geri bildirimiyle akıcılık, dilbilgisi ve kelime puanı alırsın.",
  },
  {
    icon: "🧠",
    title: "Hata Hafızası",
    description:
      "AI, geçmiş oturumlarından hataları kaydeder ve sonraki seanslarında seni aynı hatayı yapmaktan alıkoyar.",
  },
  {
    icon: "📚",
    title: "12 Dil · 6 Seviye",
    description:
      "İngilizce'den Japonca'ya, A1'den C2'ye kadar her seviyede kişiselleştirilmiş içerik ve mentor desteği.",
  },
  {
    icon: "🏅",
    title: "Rozet & Sertifika",
    description:
      "Her tamamlanan seviye için rozet, her dil programının sonunda uluslararası geçerliliği olan dijital sertifika.",
  },
  {
    icon: "🎓",
    title: "Akademik Program Yapısı",
    description:
      "Harvard, MIT ve Oxford gibi dünya üniversitelerinden ilham alan fakülte ve program hiyerarşisi.",
  },
  {
    icon: "⚡",
    title: "Kredi Tabanlı Sistem",
    description:
      "Şeffaf kredi modeli: her AI oturumu, ders ve pratik için önceden belirlenen kredi harcaması.",
  },
];

const STATS = [
  { value: "12", label: "Öğretilen Dil" },
  { value: "6", label: "CEFR Seviyesi" },
  { value: "7", label: "Partner Üniversite" },
  { value: "20", label: "Ücretsiz Başlangıç Kredisi" },
];

const TEAM_VALUES = [
  {
    title: "Erişilebilirlik",
    description:
      "Kaliteli eğitim coğrafi ya da ekonomik engeller olmaksızın herkese ulaşmalıdır.",
  },
  {
    title: "AI Destekli Kişiselleştirme",
    description:
      "Tek tip müfredat yerine her öğrencinin hızına ve ihtiyaçlarına göre adapte olan içerik.",
  },
  {
    title: "Ölçülebilir Gelişim",
    description:
      "Fluency, dilbilgisi ve kelime puanları ile ilerlemenizi her zaman net biçimde görün.",
  },
  {
    title: "Güvenilirlik",
    description:
      "Uluslararası tanınan sertifikalar ve rozet sistemimizle akademik başarınızı kanıtlayın.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <section className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
            Hakkımızda
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Koshei AI University
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            Yapay zeka ve akademik disiplini birleştirerek dil öğrenimini yeniden
            tanımlıyoruz. Her öğrenci için kişisel bir AI mentoru, kanıtlanmış
            müfredat ve uluslararası sertifika programları sunuyoruz.
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
              Programları Keşfet
            </Link>
          </div>
        </section>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 divide-x divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur sm:grid-cols-4 sm:divide-y-0">
          {STATS.map((s) => (
            <div key={s.label} className="py-8 text-center">
              <div className="text-3xl font-bold text-cyan-300">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <section className="mb-16">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-8 sm:p-12">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
              Misyonumuz
            </p>
            <h2 className="mt-3 text-3xl font-bold">
              Yapay Zeka ile Dil Öğrenimini Demokratikleştirmek
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
              Koshei AI University, geleneksel dil eğitiminin sınırlamalarını
              ortadan kaldırmak için kuruldu. Pahalı özel dersler, sıkıcı
              tekrar egzersizleri veya esnek olmayan müfredatlar yerine; her
              öğrenciye özel uyarlanmış, gerçek zamanlı geri bildirim sunan,
              konuşarak öğreten bir AI mentor deneyimi sunuyoruz.
            </p>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
              Harvard, MIT ve Oxford gibi dünyanın önde gelen üniversitelerinin
              akademik yapısından ilham alan program hiyerarşimiz, öğrencilere
              yalnızca dil değil; akademik disiplin, öz-değerlendirme ve
              uluslararası kariyer hazırlığı da kazandırır.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
              Özellikler
            </p>
            <h2 className="mt-2 text-3xl font-bold">Neden Koshei AI?</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/8"
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="mt-4 text-base font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
              Değerlerimiz
            </p>
            <h2 className="mt-2 text-3xl font-bold">Temel İlkelerimiz</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {TEAM_VALUES.map((v) => (
              <div
                key={v.title}
                className="flex gap-4 rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold ring-1 ring-cyan-400/20">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {v.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {v.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="mb-16">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-cyan-300/80">
              Nasıl Çalışır?
            </p>
            <h2 className="mt-2 text-3xl font-bold">3 Adımda Başla</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Hesap Oluştur",
                desc: "Kayıt ol, profilini tamamla ve 20 ücretsiz kredin hesabına yüklensin.",
              },
              {
                step: "2",
                title: "Program Seç",
                desc: "12 dil ve 6 CEFR seviyesinden sana uygun programı seç. Dilersen hepsini dene.",
              },
              {
                step: "3",
                title: "AI Mentorunla Konuş",
                desc: "Canlı konuşma pratiği yap, hatalarını öğren, gelişimini takip et ve sertifikanı kazan.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 text-5xl font-bold text-white/5">
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 p-8 text-center">
          <h2 className="text-2xl font-bold">
            Akademik Yolculuğuna Bugün Başla
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            20 ücretsiz kredi ile AI mentorunla hemen konuşmaya başla.
            Kredi kartı gerekmez.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
            >
              Ücretsiz Başla →
            </Link>
            <Link
              href="/universities"
              className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Üniversitelere Göz At
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
