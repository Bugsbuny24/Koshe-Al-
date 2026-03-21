'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  RequirementExtractionResult,
  ArchitecturePlanResult,
  TaskBreakdownResult,
  DeliveryChecklistResult,
} from '@/types/execution';
import { mapExecutionToProject } from '@/lib/flow/mapExecutionToProject';
import { mapExecutionToDeal } from '@/lib/flow/mapExecutionToDeal';

const TEMPLATES = [
  { id: 'hotel-landing', label: 'Hotel Landing Page', icon: '🏨' },
  { id: 'hotel-whatsapp', label: 'Hotel WhatsApp Flow', icon: '💬' },
  { id: 'hotel-offer', label: 'Hotel Offer Page', icon: '🎁' },
];

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS: Record<Step, string> = {
  1: 'Brief / Şablon',
  2: 'Gereksinimler',
  3: 'Mimari Plan',
  4: 'Görev Kırılımı',
  5: 'Teslim Checklist',
};

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20',
    green: 'bg-accent-green/15 text-accent-green border border-accent-green/20',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    red: 'bg-red-500/15 text-red-400 border border-red-500/20',
    slate: 'bg-white/5 text-slate-400 border border-white/10',
  };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md ${colors[color] ?? colors.slate}`}>
      {children}
    </span>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-bg-card border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
      {children}
    </div>
  );
}

function TagList({ items, color = 'slate' }: { items: string[]; color?: string }) {
  if (!items.length) return <p className="text-xs text-slate-500 italic">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, i) => (
        <Badge key={i} color={color}>{item}</Badge>
      ))}
    </div>
  );
}

function PriorityBadge({ value }: { value: string }) {
  const map: Record<string, string> = { high: 'red', medium: 'amber', low: 'green' };
  return <Badge color={map[value] ?? 'slate'}>{value}</Badge>;
}

function ComplexityBadge({ value }: { value: string }) {
  const map: Record<string, string> = { high: 'red', medium: 'amber', low: 'green' };
  return <Badge color={map[value] ?? 'slate'}>{value}</Badge>;
}

// ── Step 1: Brief / Template ─────────────────────────────────────────────────

function Step1({
  brief,
  setBrief,
  selectedTemplate,
  setSelectedTemplate,
  onNext,
  loading,
}: {
  brief: string;
  setBrief: (v: string) => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (v: string | null) => void;
  onNext: () => void;
  loading: boolean;
}) {
  const handleTemplateClick = useCallback(
    async (id: string) => {
      if (selectedTemplate === id) {
        setSelectedTemplate(null);
        return;
      }
      setSelectedTemplate(id);
      try {
        const res = await fetch('/api/execution/template-runtime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ templateId: id }),
        });
        const json = await res.json();
        if (json.success && json.data?.brief_seed) {
          setBrief(json.data.brief_seed);
        }
      } catch {
        // ignore
      }
    },
    [selectedTemplate, setSelectedTemplate, setBrief]
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-400 text-sm mb-4">
          Hazır şablon seçin veya serbest brief girin. Sistem teknik projeye, görev planına ve teslim
          checklist&apos;ine çevirecek.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTemplateClick(t.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                selectedTemplate === t.id
                  ? 'bg-accent-blue/15 border-accent-blue/40 text-white'
                  : 'bg-bg-card border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-sm font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Proje Brief&apos;i
        </label>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          rows={6}
          placeholder="Projenizi açıklayın... (örn: Otel için WhatsApp rezervasyon akışı ve mobil öncelikli landing page)"
          className="w-full bg-bg-deep border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-accent-blue/50 resize-none"
        />
        <p className="text-xs text-slate-600 mt-1">{brief.length} karakter</p>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!brief.trim() || loading}
        className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Analiz ediliyor...' : 'Gereksinimleri Çıkar →'}
      </button>
    </div>
  );
}

// ── Step 2: Requirements ─────────────────────────────────────────────────────

function Step2({
  data,
  onNext,
  loading,
}: {
  data: RequirementExtractionResult;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SectionCard title="Proje Tipi">
          <p className="text-sm text-white">{data.project_type}</p>
        </SectionCard>
        <SectionCard title="İş Hedefi">
          <p className="text-sm text-white">{data.business_goal}</p>
        </SectionCard>
        <SectionCard title="Hedef Kullanıcı">
          <p className="text-sm text-white">{data.target_user}</p>
        </SectionCard>
        <SectionCard title="Karmaşıklık">
          <ComplexityBadge value={data.estimated_complexity} />
        </SectionCard>
      </div>

      <SectionCard title="Temel Özellikler">
        <TagList items={data.core_features} color="blue" />
      </SectionCard>

      {data.optional_features.length > 0 && (
        <SectionCard title="Opsiyonel Özellikler">
          <TagList items={data.optional_features} color="slate" />
        </SectionCard>
      )}

      <SectionCard title="Teknik Gereksinimler">
        <TagList items={data.technical_requirements} color="green" />
      </SectionCard>

      {data.integrations.length > 0 && (
        <SectionCard title="Entegrasyonlar">
          <TagList items={data.integrations} color="amber" />
        </SectionCard>
      )}

      {data.risks.length > 0 && (
        <SectionCard title="Riskler">
          <TagList items={data.risks} color="red" />
        </SectionCard>
      )}

      <SectionCard title="Önerilen Stack">
        <TagList items={data.suggested_stack} color="blue" />
      </SectionCard>

      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Mimari planlanıyor...' : 'Mimari Planı Oluştur →'}
      </button>
    </div>
  );
}

// ── Step 3: Architecture ─────────────────────────────────────────────────────

function Step3({
  data,
  onNext,
  loading,
}: {
  data: ArchitecturePlanResult;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.frontend && (
          <SectionCard title="Frontend">
            <p className="text-sm text-white">{data.frontend}</p>
          </SectionCard>
        )}
        {data.backend && (
          <SectionCard title="Backend">
            <p className="text-sm text-white">{data.backend}</p>
          </SectionCard>
        )}
        {data.database && (
          <SectionCard title="Veritabanı">
            <p className="text-sm text-white">{data.database}</p>
          </SectionCard>
        )}
        {data.deployment && (
          <SectionCard title="Deploy">
            <p className="text-sm text-white">{data.deployment}</p>
          </SectionCard>
        )}
      </div>

      <SectionCard title="Önerilen Stack">
        <TagList items={data.recommended_stack} color="blue" />
      </SectionCard>

      {data.pages.length > 0 && (
        <SectionCard title="Sayfalar">
          <TagList items={data.pages} color="slate" />
        </SectionCard>
      )}

      {data.components.length > 0 && (
        <SectionCard title="Bileşenler">
          <TagList items={data.components} color="slate" />
        </SectionCard>
      )}

      {data.api_endpoints.length > 0 && (
        <SectionCard title="API Endpoint'leri">
          <TagList items={data.api_endpoints} color="green" />
        </SectionCard>
      )}

      {data.data_entities.length > 0 && (
        <SectionCard title="Veri Varlıkları">
          <TagList items={data.data_entities} color="amber" />
        </SectionCard>
      )}

      {data.architecture_notes.length > 0 && (
        <SectionCard title="Mimari Notlar">
          <ul className="space-y-1">
            {data.architecture_notes.map((n, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-slate-600 shrink-0">•</span>
                {n}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Görevler kırılıyor...' : 'Görev Kırılımı Oluştur →'}
      </button>
    </div>
  );
}

// ── Step 4: Tasks ────────────────────────────────────────────────────────────

function Step4({
  data,
  onNext,
  loading,
}: {
  data: TaskBreakdownResult;
  onNext: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      {data.phases.map((phase, pi) => (
        <div key={pi} className="bg-bg-card border border-white/5 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">{phase.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{phase.goal}</p>
            </div>
            <Badge color="blue">{phase.tasks.length} görev</Badge>
          </div>
          <div className="divide-y divide-white/5">
            {phase.tasks.map((task) => (
              <div key={task.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{task.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                    {task.estimated_output && (
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="text-slate-600">Çıktı:</span> {task.estimated_output}
                      </p>
                    )}
                    {task.depends_on.length > 0 && (
                      <p className="text-xs text-slate-600 mt-1">
                        Bağımlı: {task.depends_on.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <PriorityBadge value={task.priority} />
                    <ComplexityBadge value={task.difficulty} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {data.milestone_suggestions.length > 0 && (
        <SectionCard title="Milestone Önerileri">
          <div className="space-y-3">
            {data.milestone_suggestions.map((ms, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{ms.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{ms.description}</p>
                </div>
                <Badge color="green">%{ms.suggested_percentage}</Badge>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={loading}
        className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
      >
        {loading ? 'Checklist oluşturuluyor...' : 'Teslim Checklist\'i Oluştur →'}
      </button>
    </div>
  );
}

// ── Step 5: Checklist ────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  scope: 'Scope',
  technical: 'Teknik',
  content: 'İçerik',
  qa: 'QA',
  handoff: 'Teslim',
};

const CATEGORY_COLORS: Record<string, string> = {
  scope: 'blue',
  technical: 'green',
  content: 'amber',
  qa: 'red',
  handoff: 'slate',
};

function Step5({
  data,
  onReset,
  onSaveRun,
  onUseForProject,
  onUseForDeal,
  onShowJson,
  saving,
  savedRunId,
}: {
  data: DeliveryChecklistResult;
  onReset: () => void;
  onSaveRun: () => void;
  onUseForProject: () => void;
  onUseForDeal: () => void;
  onShowJson: () => void;
  saving: boolean;
  savedRunId: string | null;
}) {
  const categories = [...new Set(data.items.map((i) => i.category))];

  return (
    <div className="space-y-4">
      <div className="bg-bg-card border border-white/5 rounded-xl p-4">
        <h3 className="text-base font-semibold text-white mb-1">{data.checklist_title}</h3>
        <p className="text-xs text-slate-500">{data.items.length} madde</p>
      </div>

      {categories.map((cat) => {
        const items = data.items.filter((i) => i.category === cat);
        return (
          <SectionCard key={cat} title={CATEGORY_LABELS[cat] ?? cat}>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-4 h-4 mt-0.5 rounded border border-white/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <Badge color={CATEGORY_COLORS[cat] ?? 'slate'}>{CATEGORY_LABELS[cat]}</Badge>
                      {item.required && <Badge color="red">Zorunlu</Badge>}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        );
      })}

      {data.acceptance_checkpoints.length > 0 && (
        <SectionCard title="Kabul Checkpoint'leri">
          <ul className="space-y-1">
            {data.acceptance_checkpoints.map((cp, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-accent-green shrink-0">✓</span>
                {cp}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {data.handoff_notes.length > 0 && (
        <SectionCard title="Teslim Notları">
          <ul className="space-y-1">
            {data.handoff_notes.map((note, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2">
                <span className="text-slate-600 shrink-0">•</span>
                {note}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={onSaveRun}
          disabled={saving || !!savedRunId}
          className="bg-accent-green hover:bg-accent-green/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          {saving ? 'Kaydediliyor...' : savedRunId ? '✓ Kaydedildi' : '💾 Execution Run Kaydet'}
        </button>
        <button
          type="button"
          onClick={onUseForProject}
          disabled={saving}
          className="bg-white/10 hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          🗂️ Project İçin Kullan
        </button>
        <button
          type="button"
          onClick={onUseForDeal}
          disabled={saving}
          className="bg-accent-blue hover:bg-accent-blue/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          🤝 Deal İçin Kullan
        </button>
        <button
          type="button"
          onClick={onReset}
          className="bg-white/5 hover:bg-white/10 text-slate-300 font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          🔄 Tekrar Üret
        </button>
      </div>
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onShowJson}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {'{ }'} JSON Gör
        </button>
      </div>
    </div>
  );
}

// ── JSON Modal ───────────────────────────────────────────────────────────────

function JsonModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: unknown;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-bg-deep border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="text-base font-semibold text-white">Execution JSON</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        <pre className="flex-1 overflow-auto p-6 text-xs text-slate-300 font-mono">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function ExecutionNewPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [brief, setBrief] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [savedRunId, setSavedRunId] = useState<string | null>(null);

  const [requirement, setRequirement] = useState<RequirementExtractionResult | null>(null);
  const [architecture, setArchitecture] = useState<ArchitecturePlanResult | null>(null);
  const [tasks, setTasks] = useState<TaskBreakdownResult | null>(null);
  const [checklist, setChecklist] = useState<DeliveryChecklistResult | null>(null);

  const reset = useCallback(() => {
    setStep(1);
    setBrief('');
    setSelectedTemplate(null);
    setRequirement(null);
    setArchitecture(null);
    setTasks(null);
    setChecklist(null);
    setError(null);
    setSavedRunId(null);
  }, []);

  const handleExtractRequirements = useCallback(async () => {
    if (!brief.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/execution/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, templateId: selectedTemplate }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Gereksinimler çıkarılamadı');
      setRequirement(json.data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [brief, selectedTemplate, loading]);

  const handlePlanArchitecture = useCallback(async () => {
    if (!requirement || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/execution/architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Mimari plan oluşturulamadı');
      setArchitecture(json.data);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [requirement, loading]);

  const handleBreakdownTasks = useCallback(async () => {
    if (!requirement || !architecture || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/execution/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement, architecture }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Görev kırılımı oluşturulamadı');
      setTasks(json.data);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [requirement, architecture, loading]);

  const handleGenerateChecklist = useCallback(async () => {
    if (!requirement || !architecture || !tasks || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/execution/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement, architecture, tasks }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Checklist oluşturulamadı');
      setChecklist(json.data);
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [requirement, architecture, tasks, loading]);

  /** Save execution run to DB and return the run ID */
  const saveRunToDb = useCallback(async (): Promise<string | null> => {
    if (savedRunId) return savedRunId;
    const dealPayload = mapExecutionToDeal({ brief, requirement, tasks, checklist });
    const title = requirement?.project_type
      ? `${requirement.project_type} — ${new Date().toLocaleDateString('tr-TR')}`
      : brief.slice(0, 60).trim();
    const res = await fetch('/api/execution/runs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brief,
        templateId: selectedTemplate,
        title,
        milestoneMode: dealPayload.milestone_mode,
        requirement,
        architecture,
        tasks,
        checklist,
      }),
    });
    const json = await res.json();
    if (json.success && json.data?.id) {
      setSavedRunId(json.data.id);
      return json.data.id as string;
    }
    return null;
  }, [savedRunId, brief, selectedTemplate, requirement, architecture, tasks, checklist]);

  const handleSaveRun = useCallback(async () => {
    if (saving || savedRunId) return;
    setSaving(true);
    setError(null);
    try {
      await saveRunToDb();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kaydetme hatası');
    } finally {
      setSaving(false);
    }
  }, [saving, savedRunId, saveRunToDb]);

  const handleUseForProject = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const runId = await saveRunToDb();
      const payload = mapExecutionToProject({
        brief,
        requirement,
        architecture,
        tasks,
        checklist,
        templateId: selectedTemplate,
      });
      const params = new URLSearchParams({
        title: payload.title,
        description: payload.description,
        prompt: payload.prompt,
        tech_stack: payload.tech_stack,
      });
      if (runId) params.set('executionRunId', runId);
      router.push(`/projects/new?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  }, [saving, saveRunToDb, brief, requirement, architecture, tasks, checklist, selectedTemplate, router]);

  const handleUseForDeal = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const runId = await saveRunToDb();
      const payload = mapExecutionToDeal({
        brief,
        requirement,
        tasks,
        checklist,
      });
      const params = new URLSearchParams({
        title: payload.title,
        scopeSeed: payload.scope_seed,
        milestoneMode: payload.milestone_mode,
        acceptanceCriteria: JSON.stringify(payload.acceptance_criteria),
        checklistSeed: JSON.stringify(payload.checklist_seed),
      });
      if (runId) params.set('executionRunId', runId);
      router.push(`/deals/new?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hata oluştu');
    } finally {
      setSaving(false);
    }
  }, [saving, saveRunToDb, brief, requirement, tasks, checklist, router]);

  const jsonData = { brief, selectedTemplate, requirement, architecture, tasks, checklist };

  return (
    <>
      <JsonModal open={showJson} onClose={() => setShowJson(false)} data={jsonData} />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Execution Core</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Brief&apos;ten teknik plana, görev kırılımına ve teslim checklist&apos;ine.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
          {([1, 2, 3, 4, 5] as Step[]).map((s, idx) => (
            <div key={s} className="flex items-center shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  step === s
                    ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/30'
                    : step > s
                    ? 'text-accent-green'
                    : 'text-slate-600'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    step > s
                      ? 'bg-accent-green text-white'
                      : step === s
                      ? 'bg-accent-blue text-white'
                      : 'bg-white/10 text-slate-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </span>
                {STEP_LABELS[s]}
              </div>
              {idx < 4 && (
                <div className={`w-6 h-px mx-1 ${step > s ? 'bg-accent-green' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Step content */}
        <div className="bg-bg-deep border border-white/5 rounded-2xl p-6">
          {step === 1 && (
            <Step1
              brief={brief}
              setBrief={setBrief}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              onNext={handleExtractRequirements}
              loading={loading}
            />
          )}
          {step === 2 && requirement && (
            <Step2 data={requirement} onNext={handlePlanArchitecture} loading={loading} />
          )}
          {step === 3 && architecture && (
            <Step3 data={architecture} onNext={handleBreakdownTasks} loading={loading} />
          )}
          {step === 4 && tasks && (
            <Step4 data={tasks} onNext={handleGenerateChecklist} loading={loading} />
          )}
          {step === 5 && checklist && (
            <Step5
              data={checklist}
              onReset={reset}
              onSaveRun={handleSaveRun}
              onUseForProject={handleUseForProject}
              onUseForDeal={handleUseForDeal}
              onShowJson={() => setShowJson(true)}
              saving={saving}
              savedRunId={savedRunId}
            />
          )}
        </div>

        {/* Back button */}
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((prev) => (prev - 1) as Step)}
            className="mt-4 text-sm text-slate-500 hover:text-white transition-colors"
          >
            ← Geri
          </button>
        )}
      </div>
    </>
  );
}
