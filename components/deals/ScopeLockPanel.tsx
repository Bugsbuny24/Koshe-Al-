'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealScopeSnapshot } from '@/types/deals';

type Props = { dealId: string; scope: DealScopeSnapshot | null; onUpdate: () => void; scopeSeed?: string };

export function ScopeLockPanel({ dealId, scope, onUpdate, scopeSeed }: Props) {
  const [rawText, setRawText] = useState(scopeSeed ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleLock = async () => {
    if (loading) return;
    if (!rawText.trim()) {
      setError('Scope metni gerekli');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/deals/${dealId}/scope/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawScopeText: rawText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Hata oluştu');
        return;
      }
      setRawText('');
      setSuccess(true);
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
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Scope Kilitle
        </h3>
        <p className="text-xs text-slate-600 mb-4">
          Ham scope metnini gir. AI, metni analiz edip teslimatlar, kapsam dışı maddeler, revizyon politikası ve kabul kriterlerine ayrıştıracak.
        </p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Proje kapsamını buraya yaz…&#10;&#10;Örn: Hotel Direct Booking Pack projesi için mobil uyumlu landing page tasarımı. Oda galerisi, fiyat karşılaştırma modülü ve rezervasyon formu içerecek."
          rows={8}
          className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/50 resize-none"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        {success && (
          <p className="text-green-400 text-sm mt-2 flex items-center gap-1.5">
            <span>✓</span> Scope başarıyla kilitlendi
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <Button onClick={handleLock} disabled={loading || !rawText.trim()}>
            {loading ? '🔒 Kilitleniyor...' : '🔒 Scope Kilitle'}
          </Button>
          {loading && (
            <span className="text-xs text-slate-500">AI analiz ediyor, lütfen bekleyin…</span>
          )}
        </div>
      </Card>

      {scope && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Kilitli Scope</h3>
            <Badge variant="green">v{scope.version}</Badge>
            <span className="text-xs text-slate-500 ml-auto">
              {new Date(scope.locked_at).toLocaleDateString('tr-TR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{scope.summary}</p>

          {(scope.deliverables_json ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-2">
                Teslimatlar
              </p>
              <ul className="space-y-1">
                {scope.deliverables_json.map((d, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-accent-blue flex-shrink-0">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(scope.exclusions_json ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                Kapsam Dışı
              </p>
              <ul className="space-y-1">
                {scope.exclusions_json.map((e, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-red-400 flex-shrink-0">✗</span>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(scope.revision_policy_json ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Revizyon Politikası
              </p>
              <ul className="space-y-1">
                {scope.revision_policy_json.map((r, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-slate-500 flex-shrink-0">·</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(scope.acceptance_criteria_json ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-pi-gold uppercase tracking-wider mb-2">
                Kabul Kriterleri
              </p>
              <ul className="space-y-1">
                {scope.acceptance_criteria_json.map((a, i) => (
                  <li key={i} className="text-sm text-slate-300 flex gap-2">
                    <span className="text-pi-gold flex-shrink-0">★</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

