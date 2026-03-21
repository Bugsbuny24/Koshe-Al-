'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function NewDealForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [title, setTitle] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Execution seed state — stored, used after deal creation
  const [executionRunId, setExecutionRunId] = useState<string | null>(null);
  const [scopeSeed, setScopeSeed] = useState('');
  const [milestoneMode, setMilestoneMode] = useState('standard');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>([]);
  const [checklistSeed, setChecklistSeed] = useState<string[]>([]);
  const [fromExecution, setFromExecution] = useState(false);

  useEffect(() => {
    const execRunId = searchParams.get('executionRunId');
    if (!execRunId) return;

    setExecutionRunId(execRunId);
    setFromExecution(true);

    const paramTitle = searchParams.get('title');
    if (paramTitle) setTitle(paramTitle);

    const paramScope = searchParams.get('scopeSeed');
    if (paramScope) setScopeSeed(paramScope);

    const paramMilestone = searchParams.get('milestoneMode');
    if (paramMilestone) setMilestoneMode(paramMilestone);

    try {
      const ac = searchParams.get('acceptanceCriteria');
      if (ac) {
        const parsed = JSON.parse(ac);
        if (Array.isArray(parsed)) setAcceptanceCriteria(parsed.filter((v): v is string => typeof v === 'string'));
      }
    } catch { /* ignore parse errors */ }

    try {
      const cs = searchParams.get('checklistSeed');
      if (cs) {
        const parsed = JSON.parse(cs);
        if (Array.isArray(parsed)) setChecklistSeed(parsed.filter((v): v is string => typeof v === 'string'));
      }
    } catch { /* ignore parse errors */ }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Başlık gerekli'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, buyerId: buyerId || undefined, sellerId: sellerId || undefined, totalAmount: parseFloat(totalAmount) || 0, currency }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Hata oluştu'); return; }

      const dealId: string = data.deal.id;

      // Back-link execution run to this deal
      if (executionRunId) {
        try {
          await fetch(`/api/execution/runs/${executionRunId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deal_id: dealId, status: 'linked_to_deal' }),
          });
        } catch (linkErr) {
          console.error('execution run back-link failed:', linkErr);
        }
      }

      // Navigate to scope page with execution seed if available
      if (scopeSeed) {
        const params = new URLSearchParams({ scopeSeed });
        if (acceptanceCriteria.length) params.set('acceptanceCriteria', JSON.stringify(acceptanceCriteria));
        if (checklistSeed.length) params.set('checklistSeed', JSON.stringify(checklistSeed));
        if (milestoneMode) params.set('milestoneMode', milestoneMode);
        router.push(`/deals/${dealId}/scope?${params.toString()}`);
      } else {
        router.push(`/deals/${dealId}`);
      }
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
      {fromExecution && (
        <div className="flex items-start gap-3 bg-accent-blue/10 border border-accent-blue/20 rounded-xl px-4 py-3 mb-5">
          <span className="text-lg shrink-0">⚡</span>
          <div>
            <p className="text-sm font-semibold text-accent-blue">Execution&apos;dan Yüklendi</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Başlık execution run sonucundan dolduruldu. Deal oluşturulduktan sonra scope sayfasına yönlendirileceksin.
            </p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-white mb-6">Yeni Deal Oluştur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Başlık *</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Deal başlığı" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Buyer ID</label>
            <Input value={buyerId} onChange={(e) => setBuyerId(e.target.value)} placeholder="uuid (opsiyonel)" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Seller ID</label>
            <Input value={sellerId} onChange={(e) => setSellerId(e.target.value)} placeholder="uuid (opsiyonel)" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Toplam Tutar</label>
            <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="1200" min="0" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Para Birimi</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="TRY">TRY</option>
            </select>
          </div>
        </div>

        {/* Execution seed summary */}
        {fromExecution && checklistSeed.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="text-xs text-slate-400 font-medium mb-2">Execution Checklist Seed ({checklistSeed.length} madde)</p>
            <ul className="space-y-1">
              {checklistSeed.slice(0, 4).map((item, i) => (
                <li key={i} className="text-xs text-slate-300 flex gap-2">
                  <span className="text-slate-600 shrink-0">•</span>
                  {item}
                </li>
              ))}
              {checklistSeed.length > 4 && (
                <li className="text-xs text-slate-500">+{checklistSeed.length - 4} daha...</li>
              )}
            </ul>
          </div>
        )}

        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Oluşturuluyor...' : 'Deal Oluştur'}
        </Button>
      </form>
    </Card>
  );
}
