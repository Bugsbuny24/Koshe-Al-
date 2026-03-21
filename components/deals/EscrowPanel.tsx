'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EscrowTransaction } from '@/types/deals';
import { ESCROW_STATUS_LABEL, ESCROW_STATUS_VARIANT } from '@/lib/deals/status';

type Props = { dealId: string; escrow: EscrowTransaction | null; onUpdate: () => void };

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
    if (linkLoading) return;

    const parsedAmount = parseFloat(amount) || 0;
    if (!extId.trim()) {
      setLinkError('Transaction ID gerekli');
      return;
    }
    if (parsedAmount < 0) {
      setLinkError('Tutar negatif olamaz');
      return;
    }

    setLinkLoading(true);
    setLinkError('');
    try {
      const res = await fetch(`/api/deals/${dealId}/escrow/link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: provider.trim(), externalTransactionId: extId.trim(), amount: parsedAmount, currency }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLinkError(data.error || 'Hata oluştu');
        return;
      }
      setExtId('');
      setAmount('');
      onUpdate();
    } catch {
      setLinkError('Bağlantı hatası');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (syncLoading) return;

    const parsedFunded = parseFloat(fundedAmount) || 0;
    const parsedReleased = parseFloat(releasedAmount) || 0;

    if (parsedFunded < 0) {
      setSyncError('Funded amount negatif olamaz');
      return;
    }
    if (parsedReleased < 0) {
      setSyncError('Released amount negatif olamaz');
      return;
    }
    if (parsedReleased > parsedFunded) {
      setSyncError("Released amount, funded amount'dan büyük olamaz");
      return;
    }

    setSyncLoading(true);
    setSyncError('');
    setSyncSuccess(false);
    try {
      const res = await fetch(`/api/deals/${dealId}/escrow/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: syncStatus,
          fundedAmount: parsedFunded,
          releasedAmount: parsedReleased,
          eventType: 'manual_sync',
          payload: { synced_at: new Date().toISOString() },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSyncError(data.error || 'Hata oluştu');
        return;
      }
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

  const statusVariant =
    escrow ? (ESCROW_STATUS_VARIANT[escrow.status] || 'gray') : 'gray';
  const statusLabel =
    escrow ? (ESCROW_STATUS_LABEL[escrow.status] || escrow.status) : '';

  return (
    <div className="space-y-6">
      {!escrow ? (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Escrow Transaction Bağla
          </h3>
          <form onSubmit={handleLink} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Provider</label>
                <Input
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="escrow.com"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">External Transaction ID *</label>
                <Input
                  value={extId}
                  onChange={(e) => setExtId(e.target.value)}
                  placeholder="TXN-12345"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Tutar</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1200"
                  min="0"
                />
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
            {linkError && <p className="text-red-400 text-sm">{linkError}</p>}
            <Button type="submit" disabled={linkLoading}>
              {linkLoading ? 'Bağlanıyor...' : '🔗 Escrow Bağla'}
            </Button>
          </form>
        </Card>
      ) : (
        <>
          <Card className="p-5 space-y-4" glow="blue">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Escrow Transaction</h3>
              <Badge variant={statusVariant}>{statusLabel}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-slate-500">Provider</p>
                <p className="text-white">{escrow.provider}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Transaction ID</p>
                <p className="font-mono text-xs text-accent-blue break-all">{escrow.external_transaction_id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Toplam Tutar</p>
                <p className="text-white font-mono">{escrow.currency} {(escrow.amount ?? 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Finanse Edilen</p>
                <p className="text-accent-green font-mono">
                  {escrow.currency} {(escrow.funded_amount ?? 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Serbest Bırakılan</p>
                <p className="text-pi-gold font-mono">
                  {escrow.currency} {(escrow.released_amount ?? 0).toLocaleString()}
                </p>
              </div>
              {escrow.last_synced_at && (
                <div>
                  <p className="text-xs text-slate-500">Son Sync</p>
                  <p className="text-slate-300 text-xs">
                    {new Date(escrow.last_synced_at).toLocaleString('tr-TR')}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Manuel Sync
            </h3>
            <form onSubmit={handleSync} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Status</label>
                  <select
                    value={syncStatus}
                    onChange={(e) => setSyncStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50"
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="funded">Finanse Edildi</option>
                    <option value="partially_released">Kısmen Serbest</option>
                    <option value="released">Serbest Bırakıldı</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Funded Amount</label>
                  <Input
                    type="number"
                    value={fundedAmount}
                    onChange={(e) => setFundedAmount(e.target.value)}
                    placeholder={String(escrow.funded_amount ?? 0)}
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Released Amount</label>
                  <Input
                    type="number"
                    value={releasedAmount}
                    onChange={(e) => setReleasedAmount(e.target.value)}
                    placeholder={String(escrow.released_amount ?? 0)}
                    min="0"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-600">
                Released amount, funded amount&apos;dan büyük olamaz. Mevcut değerleri korumak için alanları boş bırakın.
              </p>
              {syncError && <p className="text-red-400 text-sm">{syncError}</p>}
              {syncSuccess && (
                <p className="text-green-400 text-sm flex items-center gap-1.5">
                  <span>✓</span> Escrow durumu güncellendi
                </p>
              )}
              <Button type="submit" disabled={syncLoading}>
                {syncLoading ? 'Sync ediliyor...' : '🔄 Manuel Sync'}
              </Button>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}
