'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DealHeader } from '@/components/deals/DealHeader';
import { DealTabs } from '@/components/deals/DealTabs';
import { ScopeLockPanel } from '@/components/deals/ScopeLockPanel';
import { Deal, DealScopeSnapshot } from '@/types/deals';

export default function DealScopePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const id = params.id;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [scope, setScope] = useState<DealScopeSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  // Execution seed from query params
  const scopeSeed = searchParams.get('scopeSeed') ?? '';
  const milestoneMode = searchParams.get('milestoneMode') ?? '';
  const acceptanceCriteriaRaw = searchParams.get('acceptanceCriteria') ?? '';
  const checklistSeedRaw = searchParams.get('checklistSeed') ?? '';

  let acceptanceCriteria: string[] = [];
  let checklistSeed: string[] = [];
  try { acceptanceCriteria = acceptanceCriteriaRaw ? (JSON.parse(acceptanceCriteriaRaw) as string[]) : []; } catch { /* ignore */ }
  try { checklistSeed = checklistSeedRaw ? (JSON.parse(checklistSeedRaw) as string[]) : []; } catch { /* ignore */ }

  const hasExecutionSeed = !!(scopeSeed || acceptanceCriteria.length || checklistSeed.length);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/deals/${id}`);
      const d = await res.json();
      if (d.deal) { setDeal(d.deal); setScope(d.scope); }
    } catch (err) {
      console.error('Scope page load error:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex items-center justify-center py-16"><div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>;
  if (!deal) return <div className="text-center py-16"><Link href="/deals" className="text-accent-blue text-sm">← Geri dön</Link></div>;

  return (
    <div className="max-w-5xl mx-auto">
      <DealHeader deal={deal} />
      <DealTabs dealId={id} />

      {/* Execution seed helper panel */}
      {hasExecutionSeed && !scope && (
        <div className="mb-5 bg-accent-blue/10 border border-accent-blue/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <p className="text-sm font-semibold text-accent-blue">Execution&apos;dan Gelen Scope İskeleti</p>
            {milestoneMode && (
              <span className="ml-auto text-xs bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded-md">
                {milestoneMode}
              </span>
            )}
          </div>

          {scopeSeed && (
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Scope Seed</p>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap bg-black/20 rounded-lg p-3 leading-relaxed">
                {scopeSeed}
              </pre>
            </div>
          )}

          {acceptanceCriteria.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Kabul Kriterleri</p>
              <ul className="space-y-1">
                {acceptanceCriteria.map((c, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-accent-green shrink-0">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {checklistSeed.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 font-medium mb-1">Teslim Checklist&apos;i</p>
              <ul className="space-y-1">
                {checklistSeed.map((item, i) => (
                  <li key={i} className="text-xs text-slate-300 flex gap-2">
                    <span className="text-slate-600 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ScopeLockPanel dealId={id} scope={scope} onUpdate={load} scopeSeed={scopeSeed || undefined} />
    </div>
  );
}

