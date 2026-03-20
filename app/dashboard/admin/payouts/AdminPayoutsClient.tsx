'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type PayoutRow = {
  id: string;
  wallet_address: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  txid: string | null;
  payment_id: string | null;
  error_message: string | null;
  owner_note: string | null;
  sent_by: string | null;
  created_at: string;
  completed_at: string | null;
};

type ApiResponse = {
  success?: boolean;
  error?: string;
  payouts?: PayoutRow[];
  stats?: {
    uniqueCompletedWallets: number;
    targetWallets: number;
    remainingWallets: number;
  };
};

export default function AdminPayoutsClient() {
  const user = useUserStore((s) => s.user);

  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('0.01');
  const [ownerNote, setOwnerNote] = useState('');
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [uniqueCompletedWallets, setUniqueCompletedWallets] = useState(0);
  const [targetWallets, setTargetWallets] = useState(10);
  const [remainingWallets, setRemainingWallets] = useState(10);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [txidMap, setTxidMap] = useState<Record<string, string>>({});
  const [failMap, setFailMap] = useState<Record<string, string>>({});

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  const loadPayouts = async () => {
    if (!user?.id) return;

    setPageLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/payouts', {
        headers: {
          'x-koshei-user-id': user.id,
        },
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        throw new Error(data?.error || 'Payout data could not be loaded');
      }

      setPayouts(data?.payouts ?? []);
      setUniqueCompletedWallets(data?.stats?.uniqueCompletedWallets ?? 0);
      setTargetWallets(data?.stats?.targetWallets ?? 10);
      setRemainingWallets(data?.stats?.remainingWallets ?? 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && isAdmin) {
      void loadPayouts();
    } else {
      setPageLoading(false);
    }
  }, [user?.id, isAdmin]);

  const createPayout = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const parsedAmount = Number(amount);

      const res = await fetch('/api/admin/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-koshei-user-id': user.id,
        },
        body: JSON.stringify({
          walletAddress,
          amount: parsedAmount,
          ownerNote,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        throw new Error(data?.error || 'Payout oluşturulamadı');
      }

      setWalletAddress('');
      setAmount('0.01');
      setOwnerNote('');
      await loadPayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const markCompleted = async (id: string) => {
    if (!user?.id) return;

    const txid = txidMap[id]?.trim();

    if (!txid) {
      setError('Completed işaretlemek için txid girmen lazım');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-koshei-user-id': user.id,
        },
        body: JSON.stringify({
          id,
          status: 'completed',
          txid,
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        throw new Error(data?.error || 'Payout completed yapılamadı');
      }

      setTxidMap((prev) => ({ ...prev, [id]: '' }));
      await loadPayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const markFailed = async (id: string) => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/payouts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-koshei-user-id': user.id,
        },
        body: JSON.stringify({
          id,
          status: 'failed',
          errorMessage: failMap[id] || 'Manual failure mark',
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok) {
        throw new Error(data?.error || 'Payout failed işaretlenemedi');
      }

      setFailMap((prev) => ({ ...prev, [id]: '' }));
      await loadPayouts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
        <h1 className="text-2xl font-bold text-[#F0EDE6]">Admin Payouts</h1>
        <p className="mt-3 text-sm text-[#8A8680]">
          Bu alan sadece admin kullanıcılar için açık.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F0EDE6]">Koschei Testnet Payout Panel</h1>
        <p className="mt-2 text-sm text-[#8A8680]">
          10 farklı wallet’a gönderim takibi için admin ekranı.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5">
          <div className="text-sm text-[#8A8680]">Completed Unique Wallets</div>
          <div className="mt-2 text-3xl font-bold text-[#F0A500]">
            {uniqueCompletedWallets} / {targetWallets}
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5">
          <div className="text-sm text-[#8A8680]">Remaining</div>
          <div className="mt-2 text-3xl font-bold text-[#F0EDE6]">
            {remainingWallets}
          </div>
        </div>

        <div className="rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5">
          <div className="text-sm text-[#8A8680]">Total Rows</div>
          <div className="mt-2 text-3xl font-bold text-[#F0EDE6]">
            {payouts.length}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5">
        <h2 className="text-lg font-semibold text-[#F0EDE6]">Yeni Payout Kaydı</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Input
            label="Wallet Address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="G..."
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
          />

          <Input
            label="Not"
            value={ownerNote}
            onChange={(e) => setOwnerNote(e.target.value)}
            placeholder="Wallet owner / test note"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={createPayout} loading={loading}>
            Payout Kaydı Oluştur
          </Button>
          <Button variant="secondary" onClick={loadPayouts} disabled={pageLoading}>
            Yenile
          </Button>
        </div>

        <p className="mt-3 text-xs text-[#8A8680]">
          Not: Bu sürüm gerçek Pi gönderimini otomatik yapmaz. Önce payout kaydı açar,
          sonra dışarıda gönderdiğin işlemi txid ile completed işaretlersin.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#F0EDE6]">Son Payoutlar</h2>
          {pageLoading && <span className="text-sm text-[#8A8680]">Yükleniyor...</span>}
        </div>

        <div className="space-y-4">
          {payouts.map((row) => (
            <div
              key={row.id}
              className="rounded-xl border border-[rgba(240,165,0,0.08)] bg-[#0C0C10] p-4"
            >
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <div className="text-xs text-[#8A8680]">Wallet</div>
                  <div className="mt-1 break-all text-sm text-[#F0EDE6]">
                    {row.wallet_address}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#8A8680]">Amount</div>
                  <div className="mt-1 text-sm text-[#F0EDE6]">{row.amount} π</div>
                </div>

                <div>
                  <div className="text-xs text-[#8A8680]">Status</div>
                  <div className="mt-1 text-sm">
                    <span
                      className={[
                        'rounded-full px-2 py-1 text-xs font-semibold',
                        row.status === 'completed'
                          ? 'bg-green-500/10 text-green-400'
                          : row.status === 'failed'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-yellow-500/10 text-yellow-400',
                      ].join(' ')}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-[#8A8680]">Created</div>
                  <div className="mt-1 text-sm text-[#F0EDE6]">
                    {new Date(row.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              {row.owner_note && (
                <div className="mt-3 text-sm text-[#8A8680]">
                  Not: {row.owner_note}
                </div>
              )}

              {row.txid && (
                <div className="mt-3 break-all text-sm text-[#8A8680]">
                  txid: <span className="text-[#F0EDE6]">{row.txid}</span>
                </div>
              )}

              {row.error_message && (
                <div className="mt-3 text-sm text-red-400">
                  Hata: {row.error_message}
                </div>
              )}

              {row.status === 'pending' && (
                <div className="mt-4 grid gap-3 md:grid-cols-[1.5fr_1fr_auto_auto]">
                  <Input
                    value={txidMap[row.id] ?? ''}
                    onChange={(e) =>
                      setTxidMap((prev) => ({ ...prev, [row.id]: e.target.value }))
                    }
                    placeholder="Completed sonrası txid gir"
                  />

                  <Input
                    value={failMap[row.id] ?? ''}
                    onChange={(e) =>
                      setFailMap((prev) => ({ ...prev, [row.id]: e.target.value }))
                    }
                    placeholder="Fail reason"
                  />

                  <Button onClick={() => markCompleted(row.id)} loading={loading}>
                    Completed
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => markFailed(row.id)}
                    disabled={loading}
                  >
                    Failed
                  </Button>
                </div>
              )}
            </div>
          ))}

          {!pageLoading && payouts.length === 0 && (
            <div className="rounded-xl border border-[rgba(240,165,0,0.08)] bg-[#0C0C10] p-6 text-sm text-[#8A8680]">
              Henüz payout kaydı yok.
            </div>
          )}
        </div>
      </div>
    </div>
  );
      }
