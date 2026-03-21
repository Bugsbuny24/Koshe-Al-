'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DealDelivery, DealMilestone } from '@/types/deals';

type Props = { dealId: string; milestones: DealMilestone[]; deliveries: DealDelivery[]; onUpdate: () => void };

const deliveryTypeLabel: Record<string, string> = {
  figma_link: 'Figma',
  zip_link: 'ZIP',
  live_url: 'Canlı URL',
  doc: 'Döküman',
  other: 'Diğer',
};
const deliveryTypes = Object.keys(deliveryTypeLabel);

export function DeliveryPanel({ dealId, milestones, deliveries, onUpdate }: Props) {
  const [milestoneId, setMilestoneId] = useState('');
  const [deliveryType, setDeliveryType] = useState('other');
  const [assetUrl, setAssetUrl] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!milestoneId) {
      setError('Milestone seçmek zorunlu');
      return;
    }
    if (!assetUrl.trim()) {
      setError('URL gerekli');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/deals/${dealId}/deliveries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, deliveryType, assetUrl: assetUrl.trim(), note: note.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Hata oluştu');
        return;
      }
      setAssetUrl('');
      setNote('');
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
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Yeni Teslimat
        </h3>
        {milestones.length === 0 ? (
          <p className="text-slate-500 text-sm">
            Teslimat eklemek için önce milestone oluşturun.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Milestone *</label>
                <select
                  value={milestoneId}
                  onChange={(e) => setMilestoneId(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50"
                  required
                >
                  <option value="">Seç…</option>
                  {milestones.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Teslim Türü</label>
                <select
                  value={deliveryType}
                  onChange={(e) => setDeliveryType(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-deep border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-accent-blue/50"
                >
                  {deliveryTypes.map((t) => (
                    <option key={t} value={t}>
                      {deliveryTypeLabel[t]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Asset URL *</label>
              <Input
                value={assetUrl}
                onChange={(e) => setAssetUrl(e.target.value)}
                placeholder="https://…"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Not (opsiyonel)</label>
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Teslim notu…"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && (
              <p className="text-green-400 text-sm flex items-center gap-1.5">
                <span>✓</span> Teslim başarıyla kaydedildi
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? 'Kaydediliyor…' : '📦 Teslim Kaydet'}
            </Button>
          </form>
        )}
      </Card>

      {deliveries.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Teslim Geçmişi ({deliveries.length})
          </h3>
          {deliveries.map((d) => {
            const ms = milestones.find((m) => m.id === d.milestone_id);
            return (
              <Card key={d.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge variant="blue">{deliveryTypeLabel[d.delivery_type] || d.delivery_type}</Badge>
                      {ms ? (
                        <span className="text-xs font-medium text-slate-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          📋 {ms.title}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Milestone bulunamadı</span>
                      )}
                      <span className="text-xs text-slate-600 ml-auto">v{d.version}</span>
                    </div>
                    <a
                      href={d.asset_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent-blue text-sm hover:underline truncate block"
                    >
                      {d.asset_url}
                    </a>
                    {d.note && <p className="text-xs text-slate-400 mt-1">{d.note}</p>}
                  </div>
                  <span className="text-xs text-slate-600 flex-shrink-0">
                    {new Date(d.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-slate-500 text-sm">Henüz teslim yok.</p>
        </Card>
      )}
    </div>
  );
}

