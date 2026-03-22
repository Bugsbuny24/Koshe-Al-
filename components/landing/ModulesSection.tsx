'use client';

import { motion } from 'framer-motion';
import { ModuleCard } from './ModuleCard';

const modules = [
  {
    name: 'Chat',
    description:
      'İşi anlamak için ilk kapı. Talebini toplar, sınıflandırır, netleştirir ve doğru modüle yönlendirir.',
    accent: 'blue' as const,
  },
  {
    name: 'Execution',
    description:
      'Planlama motoru. Requirement, architecture, task breakdown ve teslim checklist\'i üretir.',
    accent: 'green' as const,
  },
  {
    name: 'Builder',
    description:
      'Teknik üretim modülü. Script, component, endpoint, otomasyon ve teknik yapı üretiminde çalışır.',
    accent: 'blue' as const,
  },
  {
    name: 'Workspace',
    description:
      'Teslim ve takip alanı. Scope, fazlar, teslimler ve revizyonlar tek yerde yönetilir.',
    accent: 'gold' as const,
  },
  {
    name: 'Mentor',
    description:
      'Öğrenme ve rehberlik katmanı. Nasıl yapılır, hangi yol izlenir, ne öğrenilmeli gibi talepleri karşılar.',
    accent: 'green' as const,
  },
];

export function ModulesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
            Her iş için aynı motor değil, doğru motor
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <ModuleCard {...mod} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
