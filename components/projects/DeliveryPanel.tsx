'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProjectDelivery } from '@/types/freelancer';

interface DeliveryPanelProps {
  projectId: string;
  delivery?: ProjectDelivery | null;
  onUpdate?: () => void;
}

export function DeliveryPanel({ projectId, delivery: initialDelivery, onUpdate }: DeliveryPanelProps) {
  const [loading, setLoading] = useState(false);
  const [delivery, setDelivery] = useState<ProjectDelivery | null>(initialDelivery ?? null);

  const handlePrepare = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/delivery`, { method: 'POST' });
      const data = await res.json();
      if (data.delivery) setDelivery(data.delivery);
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  if (!delivery) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Teslim Paketi</h2>
        </div>
        <div className="bg-bg-card border border-white/5 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Henüz teslim paketi hazırlanmamış.</p>
          <Button onClick={handlePrepare} loading={loading} size="sm">
            📦 Prepare Delivery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Teslim Paketi</h2>
        <Button onClick={handlePrepare} loading={loading} size="sm" variant="outline">
          🔄 Regenerate
        </Button>
      </div>

      {delivery.delivery_summary && (
        <div className="bg-bg-card border border-accent-green/20 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-accent-green uppercase tracking-wider mb-3">Teslim Özeti</h3>
          <p className="text-sm text-slate-200 leading-relaxed">{delivery.delivery_summary}</p>
        </div>
      )}

      {delivery.client_message && (
        <div className="bg-bg-card border border-accent-blue/20 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-3">Müşteri Mesajı</h3>
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{delivery.client_message}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(delivery.client_message!).catch(() => {});
            }}
            className="mt-3 text-xs text-accent-blue hover:underline"
          >
            📋 Kopyala
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {delivery.assets_json && delivery.assets_json.length > 0 && (
          <div className="bg-bg-card border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-pi-gold uppercase tracking-wider mb-3">Final Assetler</h3>
            <ul className="space-y-2">
              {delivery.assets_json.map((asset, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-pi-gold mt-0.5">📎</span>
                  <span>{asset}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {delivery.next_steps_json && delivery.next_steps_json.length > 0 && (
          <div className="bg-bg-card border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-accent-green uppercase tracking-wider mb-3">Sonraki Adımlar</h3>
            <ul className="space-y-2">
              {delivery.next_steps_json.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-accent-green mt-0.5">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
