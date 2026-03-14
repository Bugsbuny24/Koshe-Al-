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
    languages: [
      "Arapça", "Farsça", "Hintçe", "Bengalce", "Vietnamca",
      "Tayca", "Endonezce", "Swahili", "Amharca", "Filipince",
      "+18 dil daha",
    ],
    features: [
      "Professional'daki her şey",
      "28 Asya/Afrika/OD dili",
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
    subtitle: "En Zor Diller",
    badge: "En Prestijli",
    monthlyPi: 250,
    yearlyPi: 2400,
    difficulty: "Çok Zor",
    languages: [
      "Japonca", "Çince (Mandarin)", "Korece", "Kantonca",
      "Tibetçe", "Moğolca", "Gürcüce", "Ermenice",
    ],
    features: [
      "Advanced'daki her şey",
      "8 en zor dünya dili",
      "Karakter sistemi eğitimi",
      "Tonlama & telaffuz AI",
      "Özel hafıza sistemi",
    ],
    color: "purple",
    popular: false,
  },
];

const ALL_ACCESS = { monthlyPi: 400, yearlyPi: 3840 };

type ColorKey = "emerald" | "cyan" | "amber" | "purple";

const COLOR_MAP: Record<ColorKey, {
  border: string; bg: string; badge: string; btn: string; glow: string; check: string;
}> = {
  emerald: {
    border: "border-emerald-400/20",
    bg: "bg-emerald-400/[0.06]",
    badge: "bg-emerald-500/20 text-emerald-200 border-emerald-400/20",
    btn: "bg-emerald-500 hover:bg-emerald-400",
    glow: "",
    check: "text-emerald-400",
  },
  cyan: {
    border: "border-cyan-300/25",
    bg: "bg-cyan-400/[0.08]",
    badge: "bg-cyan-500/20 text-cyan-200 border-cyan-400/20",
    btn: "bg-blue-500 hover:bg-blue-400",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.18)]",
    check: "text-cyan-400",
  },
  amber: {
    border: "border-amber-400/20",
    bg: "bg-amber-400/[0.06]",
    badge: "bg-amber-500/20 text-amber-200 border-amber-400/20",
    btn: "bg-amber-500 hover:bg-amber-400",
    glow: "",
    check: "text-amber-400",
  },
  purple: {
    border: "border-purple-400/20",
    bg: "bg-purple-400/[0.06]",
    badge: "bg-purple-500/20 text-purple-200 border-purple-400/20",
    btn: "bg-purple-500 hover:bg-purple-400",
    glow: "",
    check: "text-purple-400",
  },
};

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");

  const getPrice = (t: typeof TIERS[0]) =>
    billing === "monthly" ? t.monthlyPi : t.yearlyPi;

  const getAllAccessPrice = () =>
    billing === "monthly" ? ALL_ACCESS.monthlyPi : ALL_ACCESS.yearlyPi;

  const savingPct = (t: typeof TIERS[0]) => {
    const full = t.monthlyPi * 12;
    return Math.round(((full - t.yearlyPi) / full) * 100);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.12),transparent_50%),linear-gradient(180deg,#020617_0%,#041127_50%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">

        {/* Header */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-[11px] uppercase tracking-[0.24em] text-cyan-200/50 transition hover:text-cyan-200/80"
          >
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

          <div className="mx-auto mt-5 inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-cyan-300/15 bg-cyan-400/[0.08] px-5 py-2.5">
            <span className="text-sm text-slate-400">
              Cambly İngilizce: <span className="line-through">$200/ay</span>
            </span>
            <span className="text-sm font-bold text-cyan-300">Koshei: 125π/ay</span>
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
              %94 UCUZ
            </span>
          </div>
        </div>

        {/* Billing toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={[
              "rounded-2xl px-5 py-2.5 text-sm font-medium transition",
              billing === "monthly" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
            ].join(" ")}
          >
            Aylık
          </button>

          <button
            type="button"
            onClick={() => setBilling(b => b === "monthly" ? "yearly" : "monthly")}
            className="relative h-7 w-14 rounded-full border border-cyan-300/20 bg-cyan-400/10"
          >
            <div className={[
              "absolute top-1 h-5 w-5 rounded-full bg-cyan-400 transition-all",
              billing === "yearly" ? "left-8" : "left-1",
            ].join(" ")} />
          </button>

          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={[
              "flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition",
              billing === "yearly" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white",
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
            const c = COLOR_MAP[tier.color as ColorKey];
            const price = getPrice(tier);
            return (
              <div
                key={tier.id}
                className={[
                  "relative flex flex-col rounded-[28px] border p-6 transition",
                  c.border, c.bg, c.glow,
                ].join(" ")}
              >
                {tier.badge && (
                  <span className={[
                    "absolute -top-3 left-6 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]",
                    c.badge,
                  ].join(" ")}>
                    {tier.badge}
                  </span>
                )}

                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{tier.difficulty}</p>
                  <h2 className="mt-1 text-2xl font-bold text-white">{tier.name}</h2>
                  <p className="text-sm text-slate-400">{tier.subtitle}</p>
                </div>

                <div className="mt-5">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-bold text-white">{price}</span>
                    <span className="mb-1.5 text-xl text-slate-400">π</span>
                    <span className="mb-1 text-sm text-slate-500">/{billing === "monthly" ? "ay" : "yıl"}</span>
                  </div>
                  {billing === "yearly" ? (
                    <p className="mt-1 text-xs text-emerald-400">
                      %{savingPct(tier)} tasarruf · aylık {Math.round(tier.yearlyPi / 12)}π
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">Yıllık: {tier.yearlyPi}π</p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-slate-500">Dahil diller</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {tier.languages.slice(0, 5).map((l) => (
                      <span key={l} className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-300">
                        {l}
                      </span>
                    ))}
                    {tier.languages.length > 5 && (
                      <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">
                        +{tier.languages.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                <ul className="mt-4 flex-1 space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className={`mt-0.5 ${c.check}`}>✓</span> {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={["mt-5 h-12 w-full rounded-2xl text-sm font-bold text-white transition", c.btn].join(" ")}
                >
                  {price}π ile Başla
                </button>
              </div>
            );
          })}
        </div>

        {/* ALL ACCESS */}
        <div className="mt-5 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-400/[0.07] via-purple-400/[0.05] to-blue-400/[0.07] p-8 shadow-[0_0_80px_rgba(34,211,238,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1.5">
                <span>👑</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-yellow-300">All Access</span>
              </div>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                80 Dil · Tam Erişim
              </h2>
              <p className="mt-2 max-w-xl text-base text-slate-300">
                Dünyanın her dilini öğren. Tüm tier&apos;lar, tüm özellikler, tek paket.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["İngilizce", "Japonca", "Arapça", "Çince", "Rusça", "Korece", "+74 dil"].map((l) => (
                  <span key={l} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-200">
                    {l}
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
              {billing === "yearly" ? (
                <p className="mt-1 text-sm text-emerald-400">
                  %20 tasarruf · aylık {Math.round(ALL_ACCESS.yearlyPi / 12)}π
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-500">Yıllık: {ALL_ACCESS.yearlyPi}π</p>
              )}
              <button
                type="button"
                className="mt-4 h-14 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-8 text-base font-bold text-white shadow-[0_0_40px_rgba(34,211,238,0.25)] transition hover:opacity-90 lg:w-auto"
              >
                {getAllAccessPrice()}π ile Tüm Dilleri Aç
              </button>
            </div>
          </div>
        </div>

        {/* Free + Neden Pi */}
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Ücretsiz Plan</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Önce dene</h3>
            <p className="mt-2 text-sm text-slate-300">Kayıt ol, 20 soru/gün ücretsiz kullan.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {["20 soru/gün", "AI düzeltme", "Speaking score"].map(f => (
                <li key={f} className="flex gap-2"><span className="text-cyan-400">✓</span>{f}</li>
              ))}
              {["Sınırsız erişim", "Tüm diller"].map(f => (
                <li key={f} className="flex gap-2"><span className="text-slate-600">✗</span>{f}</li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-5 flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-medium transition hover:bg-white/[0.08]"
            >
              Ücretsiz Başla
            </Link>
          </div>

          <div className="rounded-[28px] border border-cyan-300/12 bg-cyan-400/[0.06] p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/70">Şeffaf Maliyet</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Neden bu kadar ucuz?</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Ders başı AI maliyet", val: "~$0.00016" },
                { label: "Cambly vs Koshei", val: "%94 ucuz" },
                { label: "Ödeme yöntemi", val: "Pi Network" },
                { label: "Kredi kartı?", val: "Hayır" },
              ].map(item => (
                <div key={item.label} className="rounded-2xl border border-cyan-300/12 bg-cyan-400/[0.08] p-3">
                  <p className="text-[10px] text-cyan-200/60">{item.label}</p>
                  <p className="mt-1 text-lg font-bold text-cyan-100">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SSS */}
        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">SSS</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              { q: "Pi cüzdanım yoksa?", a: "Ücretsiz planla başla. Günde 20 soru, kayıt gerekmez." },
              { q: "Yıllık paket iptal edilebilir mi?", a: "Evet, istediğin zaman. Kalan süren aktif kalır." },
              { q: "Hangi cihazlarda çalışır?", a: "Tüm cihazlarda web'den. Pi ödemesi için Pi Browser gerekir." },
              { q: "Dil değiştirebilir miyim?", a: "Evet, paketine dahil tüm diller arasında serbestçe geçiş yaparsın." },
            ].map(item => (
              <div key={item.q} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">{item.q}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-300">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

