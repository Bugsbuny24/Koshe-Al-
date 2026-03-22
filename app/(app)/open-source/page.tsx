'use client';

/**
 * Open Source Inspirations — /open-source
 *
 * Showcases the open-source projects that inspired and influenced
 * Koschei's features, architecture, and design decisions.
 * Inspired by: trigger.dev, Dify, mem0, Deer-Flow, open-swe,
 * RuView, build-your-own-x, WorldMonitor, superpowers, starter-nextjs-convex-ai
 */

import Link from 'next/link';
import { motion } from 'framer-motion';

interface OpenSourceProject {
  name: string;
  repo: string;
  url: string;
  license: string;
  licenseType: 'MIT' | 'Apache2' | 'Other';
  author: string;
  description: string;
  influence: string;
  koscheiModule: string;
  moduleHref: string;
  tag: string;
  tagColor: string;
}

const PROJECTS: OpenSourceProject[] = [
  {
    name: 'trigger.dev',
    repo: 'triggerdotdev/trigger.dev',
    url: 'https://github.com/triggerdotdev/trigger.dev',
    license: 'Apache 2.0',
    licenseType: 'Apache2',
    author: 'Trigger.dev Ltd.',
    description:
      'Durable, event-driven background job platform with retry logic, real-time status tracking, and a developer-friendly SDK.',
    influence:
      'Koschei Background Jobs ve Pipeline execution motoru, Trigger.dev\'in durable job mimarisinden ilham alır. Job durumu takibi, retry logic scaffolding ve async task queue.',
    koscheiModule: 'Background Jobs',
    moduleHref: '/jobs',
    tag: 'Jobs & Pipelines',
    tagColor: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  },
  {
    name: 'Dify',
    repo: 'langgenius/dify',
    url: 'https://github.com/langgenius/dify',
    license: 'Apache 2.0',
    licenseType: 'Apache2',
    author: 'LangGenius, Inc.',
    description:
      'LLM uygulama geliştirme platformu — görsel workflow editörü, template galerisi ve çok adımlı AI pipeline execution.',
    influence:
      'Koschei Pipeline Browser, Dify\'nin workflow template galerisinden doğrudan ilham alır. Template kartları, Run modalı ve node bazlı execution log görünümü Dify tasarım dilini referans alır.',
    koscheiModule: 'Pipeline',
    moduleHref: '/pipeline',
    tag: 'AI Workflows',
    tagColor: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  },
  {
    name: 'mem0',
    repo: 'mem0ai/mem0',
    url: 'https://github.com/mem0ai/mem0',
    license: 'Apache 2.0',
    licenseType: 'Apache2',
    author: 'mem0 AI',
    description:
      'AI uygulamaları için kalıcı bellek katmanı — kullanıcı tercihleri, geçmiş etkileşimler ve oturumlar arası bağlam yönetimi.',
    influence:
      'Koschei Chat modülündeki konuşma geçmişi kalıcılığı ve execution context carry-over, mem0\'ın memory store mimarisinden ilham alır. V9 Learning Engine mem0 tarzı retrieval katmanı kullanacak.',
    koscheiModule: 'Koschei Chat',
    moduleHref: '/chat',
    tag: 'AI Memory',
    tagColor: 'bg-accent-green/15 text-accent-green border-accent-green/20',
  },
  {
    name: 'Deer-Flow',
    repo: 'bytedance/deer-flow',
    url: 'https://github.com/bytedance/deer-flow',
    license: 'Apache 2.0',
    licenseType: 'Apache2',
    author: 'ByteDance Ltd.',
    description:
      'ByteDance\'in çok ajanlı derin araştırma frameworkü — planner, araştırmacı ve yazar ajanları ile yapılandırılmış araştırma akışları.',
    influence:
      'Koschei\'nin derin araştırma pipeline şablonu (Planner → Researcher → Synthesiser → Report Writer) Deer-Flow\'un ajan grafından modellenmiştir. V5 Operasyonel İstihbarat araştırma döngüsü Deer-Flow mimarisini referans alır.',
    koscheiModule: 'Pipeline',
    moduleHref: '/pipeline',
    tag: 'Research Agents',
    tagColor: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  },
  {
    name: 'open-swe',
    repo: 'langchain-ai/open-swe',
    url: 'https://github.com/langchain-ai/open-swe',
    license: 'MIT',
    licenseType: 'MIT',
    author: 'LangChain, Inc.',
    description:
      'Açık kaynaklı yazılım mühendisi ajanı — görevleri parçalar, kod yazar, testleri çalıştırır ve yinelemeli olarak geliştirme yapar.',
    influence:
      'Koschei Execution Core akışı (gereksinim çıkarma → mimari planlama → görev dağılımı → checklist) open-swe\'nin görev ayrıştırma döngüsünü yansıtır. V7 Otonom Üretim onay kapıları open-swe\'nin human-in-the-loop modelini referans alır.',
    koscheiModule: 'Execution Core',
    moduleHref: '/execution/new',
    tag: 'Engineering Agents',
    tagColor: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  },
  {
    name: 'RuView',
    repo: 'ruvnet/RuView',
    url: 'https://github.com/ruvnet/RuView',
    license: 'MIT',
    licenseType: 'MIT',
    author: 'ruvnet',
    description:
      'AI destekli kod inceleme aracı — diff analizi yapar, sorunları öncelik sırasına göre sınıflandırır ve iyileştirme önerileri üretir.',
    influence:
      'Koschei Builder modülündeki kod analizi ve inceleme çıktı şeması (severity seviyeleri, sorun kategorileri, actionable öneriler) RuView\'in yapılandırılmış çıktı modelinden ilham alır.',
    koscheiModule: 'Builder',
    moduleHref: '/builder',
    tag: 'Code Review',
    tagColor: 'bg-red-500/15 text-red-400 border-red-500/20',
  },
  {
    name: 'build-your-own-x',
    repo: 'codecrafters-io/build-your-own-x',
    url: 'https://github.com/codecrafters-io/build-your-own-x',
    license: 'MIT',
    licenseType: 'MIT',
    author: 'CodeCrafters',
    description:
      'Geliştiricilerin sıfırdan kendi teknolojilerini oluşturarak öğrenmesi için küratörlü tutorial koleksiyonu — git, Docker, Redis ve daha fazlası.',
    influence:
      'Koschei Kurslar modülündeki proje tabanlı öğrenme felsefesi (gerçek bir şey inşa ederek öğren) doğrudan build-your-own-x\'den ilham alır. Kurs yapısı, adım adım milestone\'larla "Kendi X\'ini İnşa Et" yaklaşımını benimser.',
    koscheiModule: 'Kurslar',
    moduleHref: '/courses',
    tag: 'Education',
    tagColor: 'bg-pi-gold/15 text-pi-gold border-pi-gold/20',
  },
  {
    name: 'WorldMonitor',
    repo: 'koala73/worldmonitor',
    url: 'https://github.com/koala73/worldmonitor',
    license: 'See Repository',
    licenseType: 'Other',
    author: 'koala73',
    description:
      'Sistem ve iş akışı sağlığını gerçek zamanlı izlemek için monitoring aracı.',
    influence:
      'Koschei Ops Health kartı ve operasyon dashboard\'u, WorldMonitor\'ın gerçek zamanlı sağlık göstergelerine yaklaşımından ilham alır. V5 Operasyonel İstihbarat izleme katmanı WorldMonitor\'ın sağlık sinyal modelini referans alır.',
    koscheiModule: 'Operations',
    moduleHref: '/operations',
    tag: 'Monitoring',
    tagColor: 'bg-accent-green/15 text-accent-green border-accent-green/20',
  },
  {
    name: 'superpowers',
    repo: 'obra/superpowers',
    url: 'https://github.com/obra/superpowers',
    license: 'See Repository',
    licenseType: 'Other',
    author: 'obra',
    description:
      'Bileşen araçlar ve power-user iş akışları aracılığıyla geliştirici yeteneklerini genişletmeye odaklanan proje.',
    influence:
      'Koschei\'nin geliştirici araçlama felsefesi — kilitli şablonlar yerine bileşen, güçlü primitifler sunmak — superpowers\'ın genişletilebilirlik öncelikli yaklaşımından bilgi alır. Mentor modülünün "power-user rehberlik" konsepti bu felsefeyi yansıtır.',
    koscheiModule: 'AI Mentor',
    moduleHref: '/mentor',
    tag: 'Developer Tools',
    tagColor: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  },
  {
    name: 'starter-nextjs-convex-ai',
    repo: 'appydave-templates/starter-nextjs-convex-ai',
    url: 'https://github.com/appydave-templates/starter-nextjs-convex-ai',
    license: 'MIT',
    licenseType: 'MIT',
    author: 'AppyDave',
    description:
      'Next.js App Router + Convex + AI entegrasyonu için production-ready başlangıç şablonu — kimlik doğrulama, gerçek zamanlı veri ve AI desenleri dahil.',
    influence:
      'Koschei\'nin Next.js App Router yapısı, kimlik doğrulama kalıpları (`(auth)` / `(app)` route grupları) ve ara katman yazılımı kuralları bu şablondan ilham alır. AI öncelikli durum yönetimi için gerçek zamanlı backend kombinasyonu benzer ilkeleri paylaşır.',
    koscheiModule: 'Dashboard',
    moduleHref: '/dashboard',
    tag: 'Architecture',
    tagColor: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
  },
];

const LICENSE_COLORS: Record<string, string> = {
  MIT: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  Apache2: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const LICENSE_LABELS: Record<string, string> = {
  MIT: 'MIT',
  Apache2: 'Apache 2.0',
  Other: 'See Repo',
};

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-bg-deep px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-bg-card px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-accent-blue border border-white/5">
              Açık Kaynak
            </span>
            <span className="rounded-md bg-accent-green/10 text-accent-green border border-accent-green/20 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest">
              {PROJECTS.length} Proje
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Açık Kaynak İlhamlar
          </h1>
          <p className="text-base leading-relaxed text-slate-400 max-w-2xl">
            Koschei, aşağıdaki açık kaynak projelerin tasarım, mimari ve fikirlerinden ilham almaktadır. Bu projeler Koschei&apos;nin özelliklerini şekillendirmiştir. Tüm orijinal çalışmalar kendi telif hakkı sahiplerine aittir.
          </p>
        </motion.div>

        {/* Notice banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="rounded-xl border border-white/5 bg-bg-card px-6 py-4 flex gap-4 items-start"
        >
          <span className="text-xl mt-0.5">⚖️</span>
          <div>
            <p className="text-sm font-medium text-white">Lisans Uyumluluğu</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Bu projelerden hiçbir kaynak kod bu repository&apos;ye kopyalanmamıştır. Tüm uygulamalar orijinal çalışmadır. Koschei yalnızca bu projelerin açık kaynak tasarım kalıpları, mimarileri ve fikirlerinden ilham almaktadır.{' '}
              <a
                href="https://github.com/Bugsbuny24/Koshe-Al-/blob/main/NOTICES.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-blue hover:underline"
              >
                NOTICES.md
              </a>{' '}
              dosyasına bakın.
            </p>
          </div>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.repo}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.35 }}
              className="group relative rounded-xl border border-white/5 bg-bg-card p-5 flex flex-col gap-4 hover:border-white/10 transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-white truncate">{project.name}</h2>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-accent-blue transition-colors font-mono"
                  >
                    {project.repo}
                  </a>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      LICENSE_COLORS[project.licenseType]
                    }`}
                  >
                    {LICENSE_LABELS[project.licenseType]}
                  </span>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${project.tagColor}`}
                  >
                    {project.tag}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>

              {/* Influence */}
              <div className="rounded-lg border border-white/5 bg-bg-deep px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 mb-1">
                  Koschei&apos;ye Etkisi
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">{project.influence}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-[10px] text-slate-600">
                  © {project.author}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={project.moduleHref}
                    className="text-[11px] font-medium text-accent-blue hover:underline"
                  >
                    {project.koscheiModule} →
                  </Link>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-slate-500 hover:text-white transition-colors"
                  >
                    GitHub ↗
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="text-center space-y-2 py-6 border-t border-white/5"
        >
          <p className="text-xs text-slate-500">
            Tüm atıflar{' '}
            <a
              href="https://github.com/Bugsbuny24/Koshe-Al-/blob/main/NOTICES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              NOTICES.md
            </a>{' '}
            dosyasında ve{' '}
            <a
              href="https://github.com/Bugsbuny24/Koshe-Al-/blob/main/docs/open-source-inspirations.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              docs/open-source-inspirations.md
            </a>{' '}
            dosyasında mevcuttur.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
