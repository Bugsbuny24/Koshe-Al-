'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealScopeSnapshot } from '@/types/deals';

type Props = { dealId: string; scope: DealScopeSnapshot | null; onUpdate: () => void };

export function ScopeLockPanel({ dealId, scope, onUpdate }: Props) {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLock = async () => {
    if (!rawText.trim()) { setError('Scope metni gerekli'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/deals/${dealId}/scope/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawScopeText: rawText }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Hata oluştu'); return; }
      setRawText('');
      onUpdate();
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Scope Kilitle</h3>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Ham scope metnini buraya gir..."
          rows={6}
          className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/50 resize-none"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <Button onClick={handleLock} disabled={loading} className="mt-3">
          {loading ? '🔒 Kilitleniyor...' : '🔒 Scope Kilitle'}
        </Button>
      </Card>

      {scope && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Kilitli Scope</h3>
            <Badge variant="green">v{scope.version}</Badge>
            <span className="text-xs text-slate-500 ml-auto">{new Date(scope.locked_at).toLocaleDateString('tr-TR')}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{scope.summary}</p>
          {scope.deliverables_json?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-2">Deliverables</p>
              <ul className="space-y-1">{scope.deliverables_json.map((d, i) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-accent-blue">✓</span>{d}</li>)}</ul>
            </div>
          )}
          {scope.exclusions_json?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Kapsam Dışı</p>
              <ul className="space-y-1">{scope.exclusions_json.map((e, i) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-red-400">✗</span>{e}</li>)}</ul>
            </div>
          )}
          {scope.acceptance_criteria_json?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-pi-gold uppercase tracking-wider mb-2">Kabul Kriterleri</p>
              <ul className="space-y-1">{scope.acceptance_criteria_json.map((a, i) => <li key={i} className="text-sm text-slate-300 flex gap-2"><span className="text-pi-gold">★</span>{a}</li>)}</ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
