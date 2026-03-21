'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function NewDealForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      router.push(`/deals/${data.deal.id}`);
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-xl mx-auto">
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
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Oluşturuluyor...' : 'Deal Oluştur'}
        </Button>
      </form>
    </Card>
  );
}
