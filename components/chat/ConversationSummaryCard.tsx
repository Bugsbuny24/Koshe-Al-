'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ConversationSummaryCardProps {
  summary: string;
  className?: string;
}

/**
 * Shows a gentle, user-friendly understanding summary.
 * Never exposes raw intent labels or confidence levels.
 */
export function ConversationSummaryCard({ summary, className }: ConversationSummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'ml-11 rounded-xl border border-white/8 bg-white/3 px-4 py-3',
        className,
      )}
    >
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
        Anladığım kadarıyla
      </p>
      <p className="text-sm text-slate-300 leading-relaxed">{summary}</p>
    </motion.div>
  );
}
