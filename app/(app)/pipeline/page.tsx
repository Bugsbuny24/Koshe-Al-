'use client';

/**
 * Pipeline Browser — /pipeline
 *
 * Inspired by Dify's workflow template gallery where users browse and run
 * pre-built AI workflow templates. Each card shows the pipeline name,
 * description, and node count. Users can run a pipeline with a custom input.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  nodeCount: number;
}

interface NodeLog {
  nodeId: string;
  nodeLabel: string;
  status: string;
  durationMs?: number;
  outputPreview?: string;
  error?: string;
}

interface PipelineRun {
  id: string;
  status: string;
  nodeLogs: NodeLog[];
  output: Record<string, unknown> | null;
  durationMs?: number;
}

const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  {
    id: 'koschei-execution-plan-v1',
    name: 'Execution Plan',
    description:
      "Brief'i gereksinimlere, mimariye, görev listesine ve teslim kontrolüne dönüştürür. Koschei'nin temel V2 Execution Core akışını dört ayrı LLM adımına böler.",
    nodeCount: 5,
  },
  {
    id: 'koschei-content-summariser-v1',
    name: 'İçerik Özetleyici',
    description:
      'Uzun bir metni önce ana başlıklara böler, ardından her başlığı özetler ve son olarak tek bir özet paragraf üretir.',
    nodeCount: 4,
  },
  {
    id: 'koschei-marketing-copy-v1',
    name: 'Pazarlama Metni Üretici',
    description:
      'Ürün veya hizmet bilgisinden hedef kitle analizi yaparak landing page için başlık, özellik listesi ve CTA metni üretir.',
    nodeCount: 4,
  },
];

const NODE_STATUS_COLORS: Record<string, string> = {
  completed: 'text-accent-green',
  failed: 'text-red-400',
  running: 'text-accent-blue',
  pending: 'text-slate-500',
  skipped: 'text-slate-600',
};

const NODE_STATUS_ICONS: Record<string, string> = {
  completed: '✓',
  failed: '✗',
  running: '◉',
  pending: '○',
  skipped: '—',
};

export default function PipelinePage() {
  const [selected, setSelected] = useState<PipelineTemplate | null>(null);
  const [input, setInput] = useState('');
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState<PipelineRun | null>(null);
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!selected || !input.trim()) return;
    setRunning(true);
    setRun(null);
    setError('');

    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineId: selected.id, input: { input: input.trim() } }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Pipeline çalıştırma hatası');
      } else {
        setRun(data.run as PipelineRun);
      }
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Pipeline Builder</h1>
            <p className="text-slate-500 text-sm">
              Hazır AI iş akışı şablonlarını çalıştır — Dify workflow yapısından ilham alındı
            </p>
          </div>
        </div>
      </motion.div>

      {/* Template cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PIPELINE_TEMPLATES.map((tpl, i) => (
          <motion.button
            key={tpl.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => { setSelected(tpl); setRun(null); setError(''); setInput(''); }}
            className={`text-left p-4 rounded-xl border transition-all ${
              selected?.id === tpl.id
                ? 'border-purple-500/60 bg-purple-500/10 shadow-md shadow-purple-500/10'
                : 'border-white/5 bg-bg-card hover:border-white/15'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-white text-sm leading-tight">{tpl.name}</h3>
              <span className="flex-shrink-0 text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                {tpl.nodeCount} node
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{tpl.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Run panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4"
          >
            <h2 className="text-sm font-semibold text-white">
              Çalıştır: <span className="text-purple-400">{selected.name}</span>
            </h2>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Girdi (input)</label>
              <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selected.id === 'koschei-execution-plan-v1'
                    ? 'Otele rezervasyon sistemi kurmak istiyorum...'
                    : selected.id === 'koschei-content-summariser-v1'
                    ? 'Özetlenmesini istediğiniz metni buraya yapıştırın...'
                    : 'Ürün veya hizmetinizi tanımlayın...'
                }
                className="w-full bg-bg-deep border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/40 resize-none"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={running || !input.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
            >
              {running ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Çalışıyor…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pipeline Çalıştır
                </>
              )}
            </button>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run results */}
      <AnimatePresence>
        {run && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Status bar */}
            <div className="flex items-center justify-between bg-bg-card border border-white/5 rounded-xl px-5 py-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${run.status === 'completed' ? 'bg-accent-green' : 'bg-red-400'}`} />
                <span className="text-sm font-medium text-white">
                  {run.status === 'completed' ? 'Tamamlandı' : 'Başarısız'}
                </span>
              </div>
              {run.durationMs && (
                <span className="text-xs text-slate-500">{(run.durationMs / 1000).toFixed(1)}s</span>
              )}
            </div>

            {/* Node timeline */}
            <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                Node Çalışma Kaydı
              </h3>
              {run.nodeLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className={`text-xs font-mono mt-0.5 w-4 text-center ${NODE_STATUS_COLORS[log.status] ?? 'text-slate-500'}`}>
                    {NODE_STATUS_ICONS[log.status] ?? '?'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-white">{log.nodeLabel}</span>
                      {log.durationMs && (
                        <span className="text-xs text-slate-600 flex-shrink-0">{log.durationMs}ms</span>
                      )}
                    </div>
                    {log.outputPreview && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{log.outputPreview}</p>
                    )}
                    {log.error && (
                      <p className="text-xs text-red-400 mt-0.5">{log.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Output */}
            {run.output && (
              <div className="bg-bg-card border border-white/5 rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  Çıktı
                </h3>
                <pre className="text-xs text-slate-300 overflow-auto max-h-72 whitespace-pre-wrap">
                  {JSON.stringify(run.output, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
