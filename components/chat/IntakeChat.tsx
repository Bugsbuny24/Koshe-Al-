'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { IntentSummaryCard } from './IntentSummaryCard';
import { FlowRecommendationCard } from './FlowRecommendationCard';
import type { IntakeResult } from '@/types/intake';

type Stage = 'idle' | 'analyzing' | 'result';

const QUICK_STARTS = [
  'Otelim için rezervasyon alabilen WhatsApp botu istiyorum',
  'Bir landing page oluştur',
  'Python ile CSV analiz kodu yaz',
  'React hooks nasıl çalışır, anlat',
  'E-ticaret sitesi için MVP planı',
  'Zapier ile mail otomasyonu kur',
];

export function IntakeChat() {
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<Stage>('idle');
  const [result, setResult] = useState<IntakeResult | null>(null);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleAnalyze = useCallback(async (message?: string) => {
    const text = (message ?? input).trim();
    if (!text) return;

    setStage('analyzing');
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Analiz başarısız');
        setStage('idle');
        return;
      }

      setResult(data.data as IntakeResult);
      setStage('result');
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
      setStage('idle');
    }
  }, [input]);

  const handleReset = () => {
    setStage('idle');
    setResult(null);
    setError('');
    setInput('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleAnalyze();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Intro */}
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-6"
          >
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-xl font-bold text-white mb-2">Ne üretmemi istiyorsunuz?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              İhtiyacınızı doğal dilde yazın. Koschei isteği analiz edip sizi doğru akışa yönlendirecek.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      {stage !== 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-bg-card border border-white/8 rounded-2xl p-4 space-y-3"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Örn: Otelim için rezervasyon alabilen WhatsApp botu istiyorum..."
            rows={3}
            className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed"
            disabled={stage === 'analyzing'}
          />

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Enter ile analiz et</span>
            <Button
              onClick={() => void handleAnalyze()}
              loading={stage === 'analyzing'}
              disabled={!input.trim() || stage === 'analyzing'}
              size="sm"
            >
              {stage === 'analyzing' ? 'Analiz ediliyor...' : 'Analiz Et →'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick starts */}
      {stage === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-xs text-slate-600 mb-3 text-center">Hızlı başlangıç örnekleri:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_STARTS.map((qs) => (
              <button
                key={qs}
                onClick={() => {
                  setInput(qs);
                  void handleAnalyze(qs);
                }}
                className="text-left text-xs text-slate-400 hover:text-white bg-bg-card hover:bg-bg-card-hover border border-white/5 rounded-xl px-3 py-2.5 transition-all"
              >
                {qs}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Analyzing state */}
      {stage === 'analyzing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-8 gap-4"
        >
          <div className="flex gap-1.5">
            {[0, 150, 300].map((delay) => (
              <div
                key={delay}
                className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
          <p className="text-sm text-slate-400">Talebiniz analiz ediliyor...</p>
        </motion.div>
      )}

      {/* Result */}
      {stage === 'result' && result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-sm">
              🤖
            </div>
            <span>Koschei talebinizi analiz etti:</span>
          </div>

          <div className="ml-10 space-y-3">
            {/* User message bubble */}
            <div className="bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-300">
              {result.raw_user_request}
            </div>

            {/* Intent summary */}
            <IntentSummaryCard result={result} />

            {/* Flow recommendation with routing */}
            <FlowRecommendationCard result={result} onReset={handleReset} />
          </div>
        </motion.div>
      )}
    </div>
  );
}
