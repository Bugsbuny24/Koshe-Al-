'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { StepCard } from './StepCard';

const steps = [
  {
    number: 1,
    title: 'İşini anlat',
    description:
      'Landing page, otomasyon, iç araç, kod, teklif sistemi ya da başka bir ihtiyaç. Doğal dilde yazman yeterli.',
  },
  {
    number: 2,
    title: 'Doğru akış kurulsun',
    description:
      'Sistem seni execution, builder, mentor veya workspace akışına yönlendirir.',
  },
  {
    number: 3,
    title: 'Çıktını al',
    description:
      'İş üretilir, workspace içinde takip edilir, gerekiyorsa revizyonla iyileştirilir ve teslim edilir.',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            3 adımda çalışır
          </h2>
        </motion.div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Connector line: spans the middle third between step numbers (centered at ~16.67% and ~83.33%) */}
          <div className="hidden md:block absolute top-5 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-accent-blue/15 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative z-10"
            >
              <StepCard {...step} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-10"
        >
          <Link
            href="/execution/new"
            className="inline-flex items-center gap-2 bg-accent-blue hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-accent-blue/20 hover:-translate-y-0.5"
          >
            İlk İş Akışını Kur
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
