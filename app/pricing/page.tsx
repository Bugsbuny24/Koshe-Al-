"use client";

import { useState } from "react";
import Link from "next/link";

type BillingCycle = "monthly" | "yearly";

const TIERS = [
  {
    id: "tier1",
    name: "Starter",
    subtitle: "Türk Dili Ailesi",
    badge: null,
    monthlyPi: 75,
    yearlyPi: 720,
    difficulty: "Kolay",
    difficultyColor: "text-emerald-400",
    languages: [
      "Azerbaycanca", "Özbekçe", "Kazakça", "Türkmence", "Kırgızca", "Uygurca",
    ],
    features: [
      "Sınırsız speaking sorusu",
      "AI düzeltme & puanlama",
      "Kelime hafızası",
      "Tüm seviyeler A1–D2",
      "Günlük ders planı",
    ],
    color: "emerald",
    popular: false,
  },
  {
    id: "tier2",
    name: "Professional",
    subtitle: "Avrupa Dilleri",
    badge: "En Popüler",
    monthlyPi: 125,
    yearlyPi: 1200,
    difficulty: "Orta",
    difficultyColor: "text-cyan-400",
    languages: [
      "İngilizce", "Almanca", "Fransızca", "İspanyolca", "İtalyanca",
      "Portekizce", "Hollandaca", "Rusça", "Ukraynaca", "Lehçe",
      "Yunanca", "İsveççe", "Norveççe", "Danimarkaca", "+15 dil daha",
    ],
    features: [
      "Starter'daki her şey",
      "29 Avrupa dili",
      "Speaking score kartı",
      "Hata analizi raporu",
      "Öncelikli destek",
    ],
    color: "cyan",
    popular: true,
  },
  {
    id: "tier3",
    name: "Advanced",
    subtitle: "Asya / Afrika / Orta Doğu",
    badge: null,
    monthlyPi: 175,
    yearlyPi: 1680,
    difficulty: "Zor",
    difficultyColor: "text-amber-400",
    languages: [
      "Arapça", "Farsça", "Hintçe", "Bengalce", "Vietnamca",
      "Tayca", "Endonezce", "Swahili", "Amharca", "Filipince",
      "+18 dil daha",
    ],
    features: [
      "Professional'daki her şey",
      "28 Asya/Afrika/Orta Doğu dili",
      "Alfabe öğrenimi modülü",
      "Fonetik rehber",
      "Kültür notları",
    ],
    color: "amber",
    popular: false,
  },
  {
    id: "tier4",
    name: "Elite",
    subtitle: "Çok Zor Diller",
    badge: "En Prestijli",
    monthlyPi: 250,
    yearlyPi: 2400,
    difficulty: "Çok Zor",
    difficultyColor: "text-purple-400",
    languages: [
      "Japonca", "Çince (Mandarin)", "Korece", "Kantonca",
      "Tibetçe", "Moğolca", "Gürcüce", "Ermenice",
    ],
    features: [
      "Advanced'daki her şey",
      "8 en zor dünya dili",
      "Karakter/harf sistemi eğitimi",
      "Tonlama & telaffuz AI",
      "Özel hafıza sistemi",
    ],
    color: "purple",
    popular: false,
  },
];

const ALL_ACCESS = {
  monthlyPi: 400,
  yearlyPi: 3840,
};

const COLOR_MAP: Record<string, { border: string; bg: string; badge: string; btn: string; glow: string }> = {
  emerald: {
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/[0.06]",
    badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/20",
    btn: "bg-emerald-500 hover:bg-emerald-400",
    glow: "shadow-[0_0_40px_rgba(52,211,153,0.15)]",
  },
  cyan: {
    border: "border-cyan-300/25",
    bg: "bg-cyan-400/[0.08]",
    badge: "bg-cyan-500/20 text-cyan-200 border-cyan-400/20",
    btn: "bg-blue-500 hover:bg-blue-400",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.2)]",
  },
  amber: {
    border: "border-amber-400/20",
    bg: "bg-amber-400/[0.06]",
    badge: "bg-amber-500/20 text-amber-200 border-amber-400/20",
    btn: "bg-amber-500 hover:bg-amber-400",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.15)]",
  },
  purple: {
    border: "border-purple-400/20",
    bg: "bg-purple-400/[0.06]",
    badge: "bg-purple-500/20 text-purple-200 border-purple-400/20",
    btn: "bg-purple-500 hover:bg-purple-400",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.15)]",
  },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  function getPrice(tier: typeof TIERS[0]) {
    return billing === "monthly" ? tier.monthlyPi : tier.yearlyPi;
  }

  function getAllAccessPrice() {
    return billing === "monthly" ? ALL_ACCESS.monthlyPi : ALL_ACCESS.yearlyPi;
  }

  function savingPercent(tier: typeof TIERS[0]) {
    const monthlyCost = tier.monthlyPi * 12;
    const saving = monthlyCost - tier.yearlyPi;
    return Math.round((saving / monthlyCost) * 100);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_50%),linear-gradient(180deg,#020617_0%,#041127_50%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">

        {/* Header */}
        <div className="text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-cyan-200/60 hover:text-cyan-200/90 transition">
            ← Dashboard
          </Link>
          <h1 className="mt-4 text-5xl font-bold md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
              Koshei
            </span>{" "}
            Planları
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
            80 dil, AI öğretmen, sınırsız pratik. Pi Network ile öde, anında başla.
          </p>

          {/* Cambly karşılaştırması */}
          <div className="mx-auto mt-5 inline-flex items-center gap-3 rounded-full border border-cyan-300/15 bg-cyan-400/[0.08] px-5 py-2.5">
            <span className="text-sm text-slate-300">Cambly İngilizce: <span className="line-through text-slate-500">$200/ay</span></span>
            <span className="text-sm font-semibold text-cyan-300">Koshei: 125π/ay</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">%94 UCUZ</span>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={[
              "rounded-2xl px-5 py-2.5 text-sm font-medium transition",
              billing === "monthly"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-slate-200",
            ].join(" ")}
          >
            Aylık
          </button>

          <div className="relative h-7 w-14 cursor-pointer rounded-full border border-cyan-300/20 bg-cyan-400/10" onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}>
            <div className={[
              "absolute top-1 h-5 w-5 rounded-full bg-cyan-400 transition-all",
              billing === "yearly" ? "left-8" : "left-1",
            ].join(" ")} />
          </div>

          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={[
              "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition",
              billing === "yearly"
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:text-slate-200",
            ].join(" ")}
          >
            Yıllık
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              %20 İNDİRİM
            </span>
          </button>
        </div>

        {/* Tier kartları */}
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((tier) => {
            const c = COLOR_MAP[tier.color];
            return (
              <div
                key={tier.id}
                className={[
                  "relative flex flex-col rounded-[28px] border p-6 transition",
                  c.border,
                  c.bg,
                  tier.popular ? c.glow : "",
                ].join(" ")}
              >
                {tier.badge && (
                  <div className={[
                    "absolute -top-3 left-6 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
                    c.badge,
                  ].join(" ")}>
                    {tier.badge}
                  </div>
                )}

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                    {tier.difficulty}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{tier.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{tier.subtitle}</p>
                </div>

                {/* Fiyat */}
                <div className="mt-5">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-bold text-white">{getPrice(tier)}</span>
                    <span className="mb-1.5 text-lg text-slate-400">π</span>
                    <span className="mb-1 text-sm text-slate-500">
                      /{billing === "monthly" ? "ay" : "yıl"}
                    </span>
                  </div>
                  {billing === "yearly" && (
                    <p className="mt-1 text-xs text-emerald-400">
                      %{savingPercent(tier)} tasarruf · aylık {Math.round(tier.yearlyPi / 12)}π
                    </p>
                  )}
                  {billing === "monthly" && (
                    <p className="mt-1 text-xs text-slate-500">
                      Yıllık alırsan {tier.yearlyPi}π
                    </p>
                  )}
                </div>

                {/* Diller */}
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Dahil diller</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tier.languages.slice(0, 6).map((lang) => (
                      <span
                        key={lang}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-slate-300"
                      >
                        {lang}
                      </span>
                    ))}
                    {tier.languages.length > 6 && (
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[10px] text-slate-400">
                        +{tier.languages.length - 6} daha
                      </span>
                    )}
                  </div>
                </div>

                {/* Özellikler */}
                <ul className="mt-5 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="mt-0.5 text-cyan-400">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={[
                    "mt-6 h-12 w-full rounded-2xl text-sm font-bold text-white transition",
                    c.btn,
                  ].join(" ")}
                >
                  {getPrice(tier)}π ile Başla
                </button>
              </div>
            );
          })}
        </div>

        {/* ALL ACCESS */}
        <div className="mt-6 rounded-[28px] border border-gradient-to-r from-cyan-300/20 via-purple-300/20 to-blue-300/20 border-white/10 bg-gradient-to-r from-cyan-400/[0.06] via-purple-400/[0.06] to-blue-400/[0.06] p-8 shadow-[0_0_80px_rgba(34,211,238,0.1)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1">
                <span className="text-lg">👑</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">All Access</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                80 Dil · Sınırsız Erişim
              </h2>
              <p className="mt-2 max-w-xl text-base text-slate-300">
                Dünyanın her dilini öğren. Koshei'nin tüm içeriğine, tüm seviyelere, tüm özelliklere tek paketle eriş.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                {["İngilizce", "Japonca", "Arapça", "Çince", "Rusça", "Korece", "+74 dil"].map((lang) => (
                  <span key={lang} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-slate-200">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 text-center lg:text-right">
              <div className="flex items-end justify-center gap-1 lg:justify-end">
                <span className="text-6xl font-bold text-white">{getAllAccessPrice()}</span>
                <span className="mb-2 text-2xl text-slate-400">π</span>
                <span className="mb-1.5 text-sm text-slate-500">/{billing === "monthly" ? "ay" : "yıl"}</span>
              </div>
              {billing === "yearly" && (
                <p className="mt-1 text-sm text-emerald-400">
                  %20 tasarruf · aylık {Math.round(ALL_ACCESS.yearlyPi / 12)}π
                </p>
              )}
              {billing === "monthly" && (
                <p className="mt-1 text-sm text-slate-500">Yıllık: {ALL_ACCESS.yearlyPi}π</p>
              )}
              <button
                type="button"
                className="mt-4 h-14 w-full min-w-[220px] rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-base font-bold text-white shadow-[0_0_40px_rgba(34,211,238,0.3)] transition hover:opacity-90 lg:w-auto lg:px-8"
              >
                {getAllAccessPrice()}π ile Tüm Dilleri Aç
              </button>
            </div>
          </div>
        </div>

        {/* Free plan & karşılaştırma */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Ücretsiz Plan</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Önce dene</h3>
            <p className="mt-2 text-sm text-slate-300">
              Kayıt ol, 20 konuşma sorusu/gün ücretsiz kullan. Pi cüzdanı gerekmez.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li className="flex gap-2"><span className="text-cyan-400">✓</span> 20 soru/gün</li>
              <li className="flex gap-2"><span className="text-cyan-400">✓</span> AI düzeltme</li>
              <li className="flex gap-2"><span className="text-cyan-400">✓</span> Speaking score</li>
              <li className="flex gap-2"><span className="text-slate-600">✗</span> Sınırsız erişim</li>
              <li className="flex gap-2"><span className="text-slate-600">✗</span> Tüm diller</li>
            </ul>
            <Link
              href="/register"
              className="mt-5 flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
            >
              Ücretsiz Başla
            </Link>
          </div>

          <div className="rounded-[28px] border border-cyan-300/12 bg-cyan-400/[0.06] p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/70">Neden Pi?</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Şeffaf & adil fiyat</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3">
                <p className="text-xs text-cyan-200/60">Ders başı AI maliyeti</p>
                <p className="mt-1 text-xl font-bold text-cyan-100">~$0.00016</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3">
                <p className="text-xs text-cyan-200/60">Cambly vs Koshei</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">%94 ucuz</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3">
                <p className="text-xs text-cyan-200/60">Ödeme yöntemi</p>
                <p className="mt-1 text-xl font-bold text-cyan-100">Pi Network</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3">
                <p className="text-xs text-cyan-200/60">Kredi kartı?</p>
                <p className="mt-1 text-xl font-bold text-cyan-100">Hayır</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400">
              Pi Browser'ı indir → Koshei'yi aç → Pi cüzdanınla öde.
            </p>
          </div>
        </div>

        {/* SSS */}
        <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Sık Sorulan Sorular</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              { q: "Pi cüzdanım yoksa ne yapabilirim?", a: "Ücretsiz planla başlayabilirsin. Günde 20 soru hakkın var, kayıt gerekmez." },
              { q: "Yıllık paketi iptal edebilir miyim?", a: "Evet, istediğin zaman iptal edebilirsin. Kalan süren aktif kalır." },
              { q: "Hangi cihazlarda çalışır?", a: "Tüm cihazlarda web üzerinden çalışır. Pi ile ödeme için Pi Browser gerekir." },
              { q: "Dil değiştirebilir miyim?", a: "Dilini istediğin zaman değiştirebilirsin. Paketine dahil tüm dillere erişebilirsin." },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">{item.q}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
