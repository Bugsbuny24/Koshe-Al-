"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const languageNodes = [
  { city: "London", language: "English", x: "18%", y: "28%" },
  { city: "Berlin", language: "Deutsch", x: "49%", y: "24%" },
  { city: "Paris", language: "Français", x: "44%", y: "31%" },
  { city: "Madrid", language: "Español", x: "40%", y: "38%" },
  { city: "İstanbul", language: "Türkçe", x: "56%", y: "35%" },
  { city: "Riyadh", language: "العربية", x: "62%", y: "43%" },
  { city: "Moscow", language: "Русский", x: "64%", y: "21%" },
  { city: "Delhi", language: "हिन्दी", x: "72%", y: "46%" },
  { city: "Tokyo", language: "日本語", x: "86%", y: "36%" },
  { city: "Seoul", language: "한국어", x: "82%", y: "33%" },
  { city: "Beijing", language: "中文", x: "79%", y: "30%" },
  { city: "Rome", language: "Italiano", x: "47%", y: "36%" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_16%),linear-gradient(180deg,#020617_0%,#041127_48%,#020617_100%)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <header className="mb-4 flex items-center justify-between rounded-[24px] border border-cyan-300/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
          <div className="text-sm font-medium text-white">Koshei</div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
            >
              Giriş Yap
            </Link>

            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-[32px] border border-cyan-300/10 bg-[#030817] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.14),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.14),transparent_26%),radial-gradient(circle_at_50%_82%,rgba(14,165,233,0.10),transparent_28%)]" />
          <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.12),rgba(2,6,23,0.72))]" />

          <div className="relative grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100/80"
              >
                80+ dil • ücretsiz beta
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="mt-5 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl"
              >
                Dil öğrenmenin{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  daha akıllı yolu
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16 }}
                className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg"
              >
                Sorularla ilerle, konuşarak geliş.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href="/live"
                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Konuşmaya Başla
                </Link>

                <Link
                  href="/lesson"
                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
                >
                  Örnek Ders
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.32 }}
                className="mt-8 grid gap-3 sm:grid-cols-3"
              >
                <MiniCard title="Odak" value="Gerçek konuşma pratiği" />
                <MiniCard title="Deneyim" value="Yazı + mikrofon" />
                <MiniCard title="Akış" value="Soru → cevap → düzeltme" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.16 }}
              className="relative"
            >
              <div className="relative mx-auto aspect-[1.28/1] w-full max-w-[720px] overflow-hidden rounded-[40px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="absolute inset-[7%] rounded-[999px] border border-cyan-300/10 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.08),transparent_60%)]" />

                <div className="absolute inset-[7%] rounded-[999px] border border-white/10" />
                <div className="absolute inset-[13%] rounded-[999px] border border-white/8" />
                <div className="absolute inset-[19%] rounded-[999px] border border-white/7" />

                <div className="absolute inset-y-[12%] left-1/2 w-px -translate-x-1/2 bg-white/10" />
                <div className="absolute inset-y-[18%] left-[30%] w-px bg-white/8" />
                <div className="absolute inset-y-[18%] right-[30%] w-px bg-white/8" />

                <div className="absolute inset-x-[10%] top-1/2 h-px -translate-y-1/2 bg-white/10" />
                <div className="absolute inset-x-[16%] top-[34%] h-px bg-white/8" />
                <div className="absolute inset-x-[16%] bottom-[34%] h-px bg-white/8" />

                <motion.div
                  className="absolute inset-[10%] rounded-[999px] border border-cyan-300/8"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />

                <motion.div
                  className="absolute inset-[16%] rounded-[999px] border border-sky-300/8"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                />

                <div className="absolute left-[16%] top-[27%] h-px w-[33%] rotate-[8deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/30 to-cyan-300/0" />
                <div className="absolute left-[47%] top-[30%] h-px w-[36%] rotate-[8deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/28 to-cyan-300/0" />
                <div className="absolute left-[54%] top-[43%] h-px w-[28%] rotate-[-6deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/25 to-cyan-300/0" />
                <div className="absolute left-[39%] top-[36%] h-px w-[18%] rotate-[3deg] bg-gradient-to-r from-cyan-300/0 via-cyan-300/24 to-cyan-300/0" />

                {languageNodes.map((node, i) => (
                  <motion.div
                    key={`${node.city}-${node.language}`}
                    className="absolute"
                    style={{ left: node.x, top: node.y }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.08 * i }}
                  >
                    <div className="relative">
                      <motion.div
                        className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/20 blur-md"
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.9, 0.3] }}
                        transition={{
                          duration: 2.4 + (i % 3) * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="relative h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.95)]" />
                    </div>

                    <motion.div
                      className="ml-3 mt-[-10px] hidden rounded-2xl border border-white/10 bg-[#081326]/85 px-3 py-2 text-left shadow-xl backdrop-blur-md md:block"
                      animate={{ y: [0, -4, 0] }}
                      transition={{
                        duration: 3 + (i % 4) * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                        {node.city}
                      </div>
                      <div className="mt-1 text-xs font-medium text-cyan-100">
                        {node.language}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}

                <div className="absolute bottom-6 left-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-md">
                  <div className="text-[10px] uppercase tracking-[0.16em] text-slate-400">
                    Global Language Layer
                  </div>
                  <div className="mt-1 text-sm text-white">
                    Hangi dili seçersen, Koshei oradan başlar.
                  </div>
                </div>

                <motion.div
                  className="absolute right-6 top-6 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 backdrop-blur-md"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-[10px] uppercase tracking-[0.16em] text-cyan-100/70">
                    Active
                  </div>
                  <div className="mt-1 text-sm text-cyan-50">80+ dil desteği</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <CompareCard
            title="Duolingo"
            desc="Quiz ağırlıklı. Gerçek konuşma akışı zayıf."
          />
          <CompareCard
            title="Cambly"
            desc="İnsan öğretmen. Randevu gerekir ve maliyet yüksektir."
          />
          <CompareCard
            title="Koshei"
            desc="AI öğretmen. Sorar, dinler, düzeltir ve seni ilerletir."
            active
          />
        </section>

        <section className="mt-4 rounded-[28px] border border-cyan-300/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="text-[11px] uppercase tracking-[0.22em] text-cyan-200/70">
            Nasıl çalışır
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <StepCard number="1" text="Dil ve seviyeni seç" />
            <StepCard number="2" text="Koshei sana konuşma görevi verir" />
            <StepCard number="3" text="Yaz veya mikrofonla cevap ver" />
            <StepCard number="4" text="AI düzeltir ve sonraki adıma geçer" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
              Kayıt ücretsiz. Kredi kartı gerekmez.
            </p>

            <Link
              href="/register"
              className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white transition hover:bg-blue-400"
            >
              Şimdi Ücretsiz Dene
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {title}
      </div>
      <div className="mt-2 text-sm text-slate-200">{value}</div>
    </div>
  );
}

function CompareCard({
  title,
  desc,
  active = false,
}: {
  title: string;
  desc: string;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[24px] border p-5 backdrop-blur-xl",
        active
          ? "border-cyan-300/14 bg-cyan-400/[0.06]"
          : "border-white/10 bg-white/[0.03]",
      ].join(" ")}
    >
      <div
        className={[
          "text-sm font-semibold",
          active ? "text-cyan-100" : "text-white",
        ].join(" ")}
      >
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{desc}</p>
    </div>
  );
}

function StepCard({ number, text }: { number: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-400/10 text-sm font-semibold text-cyan-200">
        {number}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-200">{text}</p>
    </div>
  );
                }
