'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Project, AiBriefResult } from '@/types/freelancer';

interface BriefPanelProps {
  project: Project;
  onUpdate?: () => void;
}

export function BriefPanel({ project, onUpdate }: BriefPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiBriefResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/brief`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error ?? 'Bilinmeyen hata');
      }
      if (onUpdate) onUpdate();
    } finally {
      setLoading(false);
    }
  };

  const cleaned = project.cleaned_brief;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Brief Analizi</h2>
        <Button onClick={handleGenerate} loading={loading} size="sm" variant="outline">
          🔄 Regenerate Brief
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Raw Brief */}
      <div className="bg-bg-card border border-white/5 rounded-xl p-5">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ham Brief</h3>
        <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{project.raw_brief}</p>
      </div>

      {/* Cleaned Brief (from DB) */}
      {cleaned && !result && (
        <div className="bg-bg-card border border-accent-blue/20 rounded-xl p-5">
          <h3 className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-3">Temizlenmiş Brief</h3>
          <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{cleaned}</p>
        </div>
      )}

      {/* AI Result */}
      {result && (
        <>
          {result.suggested_title && (
            <div className="bg-bg-card border border-accent-blue/10 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-1">Önerilen Başlık</h3>
              <p className="text-base font-semibold text-white">{result.suggested_title}</p>
            </div>
          )}

          <div className="bg-bg-card border border-accent-blue/20 rounded-xl p-5">
            <h3 className="text-xs font-semibold text-accent-blue uppercase tracking-wider mb-3">Özet</h3>
            <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">{result.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.objectives.length > 0 && (
              <div className="bg-bg-card border border-white/5 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-accent-green uppercase tracking-wider mb-3">Hedefler</h3>
                <ul className="space-y-2">
                  {result.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-accent-green mt-0.5">✓</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.deliverables.length > 0 && (
              <div className="bg-bg-card border border-white/5 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-pi-gold uppercase tracking-wider mb-3">Deliverables</h3>
                <ul className="space-y-2">
                  {result.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-pi-gold mt-0.5">→</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.missing_information.length > 0 && (
              <div className="bg-bg-card border border-pi-gold/20 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-pi-gold uppercase tracking-wider mb-3">Eksik Bilgiler</h3>
                <ul className="space-y-2">
                  {result.missing_information.map((info, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-pi-gold mt-0.5">?</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.risks.length > 0 && (
              <div className="bg-bg-card border border-red-500/20 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Riskler</h3>
                <ul className="space-y-2">
                  {result.risks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 mt-0.5">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {!cleaned && !result && !error && (
        <div className="bg-bg-card border border-white/5 rounded-xl p-8 text-center">
          <p className="text-slate-500 text-sm mb-4">Henüz brief analizi yapılmamış.</p>
          <Button onClick={handleGenerate} loading={loading} size="sm">
            ✨ Brief Oluştur
          </Button>
        </div>
      )}
    </div>
  );
}
