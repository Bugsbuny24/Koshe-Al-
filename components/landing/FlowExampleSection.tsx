'use client';

import { motion } from 'framer-motion';
import { FlowNode } from './FlowNode';

const flowSteps = ['Chat', 'Execution', 'Workspace', 'Delivery', 'Revision'];

export function FlowExampleSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Bir talep nasıl ilerler?
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-bg-deep border border-white/5 rounded-2xl p-8"
        >
          {/* Example request */}
          <div className="mb-8 flex items-start gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center mt-0.5">
              <svg className="w-3 h-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
              </svg>
            </span>
            <div>
              <p className="text-xs text-slate-500 mb-1 uppercase tracking-widest font-semibold">Kullanıcı talebi</p>
              <p className="text-slate-200 text-base font-medium italic">
                &ldquo;Otelim için teklif odaklı landing page istiyorum.&rdquo;
              </p>
            </div>
          </div>

          {/* Flow */}
          <div className="flex flex-wrap items-center gap-2">
            {flowSteps.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.09 }}
                className="flex items-center gap-2"
              >
                <FlowNode label={step} isFirst={i === 0} />
                {i < flowSteps.length - 1 && (
                  <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer note */}
          <p className="mt-8 text-slate-600 text-xs pt-6 border-t border-white/5">
            Fikirden teslimata tek omurga.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
