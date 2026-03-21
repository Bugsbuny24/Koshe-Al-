'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🧠',
    title: 'AI Mentor',
    desc: 'Gemini 2.5 destekli kişisel AI öğretmeninizle her konuyu anlayın. Soru sorun, derinlemesine öğrenin.',
    color: 'accent-blue',
    badge: 'Starter',
  },
  {
    icon: '⚡',
    title: 'Kod Üretici',
    desc: 'Doğal dil ile kod yazın. Python, JavaScript, TypeScript ve daha fazla dil desteği.',
    color: 'accent-green',
    badge: 'Pro',
  },
  {
    icon: '🎙️',
    title: 'Ses Eğitimi',
    desc: 'Metinden ses üretin. Ders materyallerinizi dinleyerek öğrenin, istediğiniz yerde.',
    color: 'pi-gold',
    badge: 'Starter',
  },
  {
    icon: '🎨',
    title: 'Görsel Üretici',
    desc: 'Imagen 4 ile eğitim materyalleri, diyagramlar ve görsel içerikler oluşturun.',
    color: 'accent-blue',
    badge: 'Pro',
  },
  {
    icon: '🎬',
    title: 'Video Üretimi',
    desc: 'Veo 3 teknolojisiyle 15 saniyelik eğitim videoları oluşturun. Konseptleri görselleştirin.',
    color: 'accent-green',
    badge: 'Ultra',
  },
  {
    icon: '🔴',
    title: 'Canlı Ses',
    desc: 'Gerçek zamanlı ses ile AI ile konuşun. Sözlü pratik yapın, anında geri bildirim alın.',
    color: 'pi-gold',
    badge: 'Pro',
  },
];

const badgeColors: Record<string, string> = {
  Starter: 'bg-slate-700/50 text-slate-300',
  Pro: 'bg-accent-blue/20 text-accent-blue',
  Ultra: 'bg-pi-gold/20 text-pi-gold',
};

const borderColors: Record<string, string> = {
  'accent-blue': 'group-hover:border-accent-blue/30',
  'accent-green': 'group-hover:border-accent-green/30',
  'pi-gold': 'group-hover:border-pi-gold/30',
};

const iconBgColors: Record<string, string> = {
  'accent-blue': 'bg-accent-blue/10 group-hover:bg-accent-blue/20',
  'accent-green': 'bg-accent-green/10 group-hover:bg-accent-green/20',
  'pi-gold': 'bg-pi-gold/10 group-hover:bg-pi-gold/20',
};

export function Features() {
  return (
    <section id="features" className="py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent-blue text-sm font-semibold tracking-widest uppercase mb-3 block">
            Özellikler
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Her şey bir arada
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            En güçlü AI modellerini tek platformda kullanarak öğrenme deneyiminizi dönüştürün.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group bg-bg-card border border-white/5 ${borderColors[feature.color]} rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${iconBgColors[feature.color]} flex items-center justify-center text-2xl transition-all duration-300`}>
                  {feature.icon}
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColors[feature.badge]}`}>
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
