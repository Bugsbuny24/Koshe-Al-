'use client';

/**
 * Background Jobs Dashboard — /jobs
 *
 * Inspired by Trigger.dev's "Runs" dashboard where users see all background
 * task executions with their status, step breakdown, and real-time progress.
 *
 * Features:
 * - Submit an execution plan as a background job
 * - List all recent jobs with status badges
 * - Click a job to open its detail view with step log and SSE live updates
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Job, JobEvent, JobStep } from '@/types/jobs';

// ── Status helpers ────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  queued: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  running: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  completed: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  failed: 'bg-red-500/10 text-red-400 border-red-500/20',
  cancelled: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const STATUS_LABELS: Record<string, string> = {
  queued: 'Bekliyor',
  running: 'Çalışıyor',
  completed: 'Tamamlandı',
  failed: 'Başarısız',
  cancelled: 'İptal',
};

const STEP_STATUS_ICONS: Record<string, string> = {
  pending: '○',
  running: '◉',
  completed: '✓',
  failed: '✗',
  skipped: '—',
};

const STEP_STATUS_COLORS: Record<string, string> = {
  pending: 'text-slate-600',
  running: 'text-accent-blue',
  completed: 'text-accent-green',
  failed: 'text-red-400',
  skipped: 'text-slate-600',
};

function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? STATUS_COLORS.queued;
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${cls}`}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

function formatDuration(ms?: number): string {
  if (!ms) return '';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return iso;
  }
}

// ── Step list ─────────────────────────────────────────────────────────────────

function StepList({ steps }: { steps: JobStep[] }) {
  if (!steps.length) return null;
  return (
    <div className="space-y-2 mt-3">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-3 text-sm">
          <span className={`text-xs w-4 text-center ${STEP_STATUS_COLORS[step.status] ?? 'text-slate-500'}`}>
            {STEP_STATUS_ICONS[step.status] ?? '?'}
          </span>
          <span className={step.status === 'completed' ? 'text-slate-300' : step.status === 'running' ? 'text-white' : 'text-slate-500'}>
            {step.label}
          </span>
          {step.durationMs !== undefined && (
            <span className="ml-auto text-xs text-slate-600">{formatDuration(step.durationMs)}</span>
          )}
          {step.error && (
            <span className="text-xs text-red-400 ml-2 truncate max-w-xs">{step.error}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Job detail panel ──────────────────────────────────────────────────────────

function JobDetail({ job: initialJob }: { job: Job }) {
  const [job, setJob] = useState<Job>(initialJob);
  const evtRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Only open SSE if job is active
    if (['queued', 'running'].includes(job.status)) {
      const es = new EventSource(`/api/jobs/${job.id}/stream`);
      evtRef.current = es;

      es.onmessage = (e: MessageEvent<string>) => {
        try {
          const event = JSON.parse(e.data) as (JobEvent | { type: 'snapshot'; job: Job }) & { job?: Job };
          if (event.type === 'snapshot' && event.job) {
            setJob(event.job);
          } else {
            // Re-fetch current state on any update event
            fetch(`/api/jobs/${job.id}`)
              .then((r) => r.json())
              .then((d: { success: boolean; job?: Job }) => { if (d.success && d.job) setJob(d.job); })
              .catch(() => null);
          }
        } catch {
          // Ignore parse errors
        }
      };

      es.onerror = () => es.close();

      return () => {
        es.close();
        evtRef.current = null;
      };
    }
  }, [job.id, job.status]);

  return (
    <div className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-white">{job.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5 font-mono">{job.id}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={job.status} />
          {job.durationMs && (
            <span className="text-xs text-slate-600">{formatDuration(job.durationMs)}</span>
          )}
        </div>
      </div>

      <div className="flex gap-4 text-xs text-slate-500">
        <span>Oluşturuldu: {formatDate(job.createdAt)}</span>
        {job.completedAt && <span>Tamamlandı: {formatDate(job.completedAt)}</span>}
      </div>

      {/* Step log */}
      {job.steps.length > 0 && (
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
            Adımlar
          </p>
          <StepList steps={job.steps} />
        </div>
      )}

      {/* Error */}
      {job.error && (
        <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {job.error}
        </div>
      )}

      {/* Output preview */}
      {job.output && (
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Çıktı</p>
          <pre className="text-xs text-slate-300 overflow-auto max-h-56 whitespace-pre-wrap bg-bg-deep rounded-lg p-3">
            {JSON.stringify(job.output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [brief, setBrief] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json() as { jobs: Job[] };
      setJobs(data.jobs ?? []);
    } catch {
      // Ignore fetch errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchJobs();
    const interval = setInterval(() => { void fetchJobs(); }, 5000);
    return () => clearInterval(interval);
  }, []);

  const submitJob = async () => {
    if (!brief.trim()) return;
    setSubmitting(true);
    setSubmitError('');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'execution_plan',
          title: brief.trim().slice(0, 60),
          input: { brief: brief.trim() },
        }),
      });
      const data = await res.json() as { success: boolean; job?: Job; error?: string };
      if (!res.ok || !data.success) {
        setSubmitError(data.error ?? 'İş gönderilemedi');
      } else if (data.job) {
        setJobs((prev) => [data.job!, ...prev]);
        setSelectedJob(data.job);
        setBrief('');
      }
    } catch {
      setSubmitError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Arka Plan İşleri</h1>
            <p className="text-slate-500 text-sm">
              Uzun süren AI görevlerini arka planda çalıştır — Trigger.dev yapısından ilham alındı
            </p>
          </div>
        </div>
      </motion.div>

      {/* Submit new job */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-card border border-white/5 rounded-xl p-5 space-y-3"
      >
        <h2 className="text-sm font-semibold text-white">Yeni Execution Plan İşi Gönder</h2>
        <textarea
          rows={3}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="Brief'inizi girin (örn: Otel rezervasyon sistemi kurmak istiyorum)..."
          className="w-full bg-bg-deep border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/40 resize-none"
        />
        {submitError && (
          <p className="text-sm text-red-400">{submitError}</p>
        )}
        <button
          onClick={submitJob}
          disabled={submitting || !brief.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {submitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Gönderiliyor…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              İş Gönder
            </>
          )}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job list */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Tüm İşler {jobs.length > 0 && `(${jobs.length})`}
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 text-slate-500 text-sm py-8">
              <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
              Yükleniyor…
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-slate-500 text-sm py-8 text-center">
              Henüz iş yok. Yukarıdan bir brief gönderin.
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job, i) => (
                <motion.button
                  key={job.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedJob(job)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedJob?.id === job.id
                      ? 'border-amber-500/40 bg-amber-500/5'
                      : 'border-white/5 bg-bg-card hover:border-white/15'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-white truncate">{job.title}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-600">{formatDate(job.createdAt)}</span>
                    {job.durationMs && (
                      <span className="text-xs text-slate-600">{formatDuration(job.durationMs)}</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Job detail */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
            İş Detayı
          </h2>
          <AnimatePresence mode="wait">
            {selectedJob ? (
              <motion.div
                key={selectedJob.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <JobDetail job={selectedJob} />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-500 text-sm py-8 text-center bg-bg-card border border-white/5 rounded-xl"
              >
                Soldaki listeden bir iş seçin
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
