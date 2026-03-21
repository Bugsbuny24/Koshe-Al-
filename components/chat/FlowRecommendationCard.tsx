'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { IntakeResult } from '@/types/intake';

interface FlowRecommendationCardProps {
  result: IntakeResult;
  onReset?: () => void;
}

export function FlowRecommendationCard({ result, onReset }: FlowRecommendationCardProps) {
  const router = useRouter();

  const handleContinue = () => {
    if (result.recommended_flow === 'execution') {
      const params = new URLSearchParams({
        brief: result.auto_scope_seed ?? result.raw_user_request,
        intakeIntent: result.detected_intent,
        suggestedTitle: result.business_goal.slice(0, 80),
        ...(result.recommended_template ? { template: result.recommended_template } : {}),
      });
      router.push(`/execution/new?${params.toString()}`);
    } else if (result.recommended_flow === 'builder') {
      const params = new URLSearchParams({
        prompt: result.raw_user_request,
        source: 'chat',
      });
      router.push(`/builder?${params.toString()}`);
    } else if (result.recommended_flow === 'mentor') {
      const params = new URLSearchParams({
        topic: result.raw_user_request,
        source: 'chat',
      });
      router.push(`/mentor?${params.toString()}`);
    }
  };

  const FLOW_CONFIG = {
    execution: {
      icon: '⚙️',
      label: 'Execution Planning',
      desc: 'İhtiyacını teknik plana çevir, scope oluştur ve iş akışını başlat.',
      cta: 'Planlama Motorunu Başlat',
      color: 'from-accent-blue/20 to-accent-blue/5 border-accent-blue/20',
    },
    builder: {
      icon: '💻',
      label: 'Kod Üretici',
      desc: 'Talebini doğrudan kod üretim aracına aktar.',
      cta: 'Kod Üreticiye Git',
      color: 'from-accent-green/20 to-accent-green/5 border-accent-green/20',
    },
    mentor: {
      icon: '🧠',
      label: 'AI Mentor',
      desc: 'Öğrenme talebini AI mentörüne ilet ve detaylı açıklama al.',
      cta: "Mentor'a Git",
      color: 'from-purple-500/20 to-purple-500/5 border-purple-500/20',
    },
  };

  const config = FLOW_CONFIG[result.recommended_flow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-br ${config.color} p-5 space-y-4`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{config.icon}</span>
        <div>
          <p className="text-base font-bold text-white">{config.label}</p>
          <p className="text-sm text-slate-400 mt-0.5">{config.desc}</p>
        </div>
      </div>

      {result.clarifying_questions.length > 0 && (
        <div className="bg-black/20 rounded-xl p-3 space-y-1.5">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">
            Devam etmeden önce cevaplanabilir sorular:
          </p>
          {result.clarifying_questions.map((q, i) => (
            <p key={i} className="text-xs text-slate-400 flex gap-1.5">
              <span className="text-slate-600">•</span>
              {q}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={handleContinue} className="flex-1">
          {config.cta} →
        </Button>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-2"
          >
            Yeniden Başla
          </button>
        )}
      </div>
    </motion.div>
  );
}
