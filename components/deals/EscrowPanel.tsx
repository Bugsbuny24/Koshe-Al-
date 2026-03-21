'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EscrowTransaction } from '@/types/deals';

type Props = { dealId: string; escrow: EscrowTransaction | null; onUpdate: () => void };

const escrowStatusVariant: Record<string, 'blue' | 'green' | 'gold' | 'red' | 'gray'> = {
  pending: 'gray', funded: 'blue', partially_released: 'gold', released: 'green', cancelled: 'red',
};
const escrowStatusLabel: Record<string, string> = {
  pending: 'Bekliyor', funded: 'Finanse Edildi', partially_released: 'Kısmen Serbest', released: 'Serbest Bırakıldı', cancelled: 'İptal',
};

export function EscrowPanel({ dealId, escrow, onUpdate }: Props) {
  const [provider, setProvider] = useState('escrow.com');
  const [extId, setExtId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const [syncStatus, setSyncStatus] = useState('funded');
  const [fundedAmount, setFundedAmount] = useState('');
  const [releasedAmount, setReleasedAmount] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extId.trim()) { setLinkError('Transaction ID gerekli'); return; }
    setLinkLoading(true); setLinkError('');
    try {
      const res = await fetch(`/api/deals/${dealId}/escrow/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, externalTransactionId: extId, amount: parseFloat(amount) || 0, currency }),
      });
      const data = await res.json();
      if (!res.ok) { setLinkError(data.error || 'Hata oluştu'); return; }
      setExtId(''); setAmount('');
      onUpdate();
    } catch {
      setLinkError('Bağlantı hatası');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncLoading(true); setSyncError(''); setSyncSuccess(false);
    try {
      const res = await fetch(`/api/deals/${dealId}/escrow/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: syncStatus,
          fundedAmount: parseFloat(fundedAmount) || 0,
          releasedAmount: parseFloat(releasedAmount) || 0,
          eventType: 'manual_sync',
          payload: { synced_at: new Date().toISOString() },
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSyncError(data.error || 'Hata oluştu'); return; }
      setSyncSuccess(true);
      onUpdate();
    } catch {
      setSyncError('Bağlantı hatası');
    } finally {
      setSyncLoading(false);
    }
  };

  useEffect(() => {
    if (!syncSuccess) return;
    const t = setTimeout(() => setSyncSuccess(false), 4000);
    return () => clearTimeout(t);
  }, [syncSuccess]);

  return (
    <div className="space-y-6">
      {!escrow ? (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Escrow Transaction Bağla</h3>
          <form onSubmit={handleLink} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Provider</label>
                <Input value={provider} onChange={(e) => setProvider(e.target.value)} placeholder="escrow.com" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">External Transaction ID *</label>
                <Input value={extId} onChange={(e) => setExtId(e.target.value)} placeholder="TXN-12345" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tutar</label>
                <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1200" min="0" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Para Birimi</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50">
                  <option value="USD">USD</option><option value="EUR">EUR</option><option value="TRY">TRY</option>
                </select>
              </div>
            </div>
            {linkError && <p className="text-red-400 text-sm">{linkError}</p>}
            <Button type="submit" disabled={linkLoading}>{linkLoading ? 'Bağlanıyor...' : '🔗 Escrow Bağla'}</Button>
          </form>
        </Card>
      ) : (
        <>
          <Card className="p-5 space-y-3" glow="blue">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Escrow Transaction</h3>
              <Badge variant={escrowStatusVariant[escrow.status] || 'gray'}>{escrowStatusLabel[escrow.status] || escrow.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-xs text-slate-500">Provider</p><p className="text-white">{escrow.provider}</p></div>
              <div><p className="text-xs text-slate-500">Transaction ID</p><p className="font-mono text-xs text-accent-blue">{escrow.external_transaction_id}</p></div>
              <div><p className="text-xs text-slate-500">Toplam Tutar</p><p className="text-white font-mono">{escrow.currency} {escrow.amount.toLocaleString()}</p></div>
              <div><p className="text-xs text-slate-500">Finanse Edilen</p><p className="text-accent-green font-mono">{escrow.currency} {escrow.funded_amount.toLocaleString()}</p></div>
              <div><p className="text-xs text-slate-500">Serbest Bırakılan</p><p className="text-pi-gold font-mono">{escrow.currency} {escrow.released_amount.toLocaleString()}</p></div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Manuel Sync</h3>
            <form onSubmit={handleSync} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <select value={syncStatus} onChange={(e) => setSyncStatus(e.target.value)} className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50">
                    <option value="pending">Pending</option>
                    <option value="funded">Funded</option>
                    <option value="partially_released">Partially Released</option>
                    <option value="released">Released</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Funded Amount</label>
                  <Input type="number" value={fundedAmount} onChange={(e) => setFundedAmount(e.target.value)} placeholder="1200" min="0" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Released Amount</label>
                  <Input type="number" value={releasedAmount} onChange={(e) => setReleasedAmount(e.target.value)} placeholder="400" min="0" />
                </div>
              </div>
              {syncError && <p className="text-red-400 text-sm">{syncError}</p>}
              {syncSuccess && (
                <p className="text-green-400 text-sm flex items-center gap-1.5">
                  <span>✓</span> Escrow durumu güncellendi
                </p>
              )}
              <Button type="submit" disabled={syncLoading}>{syncLoading ? 'Sync ediliyor...' : '🔄 Manuel Sync'}</Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
