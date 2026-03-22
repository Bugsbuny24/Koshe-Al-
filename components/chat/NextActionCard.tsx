'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NextActionCardProps {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  onReset?: () => void;
  className?: string;
}

/**
 * Shows the recommendation and primary CTA without exposing any internal routing labels.
 */
export function NextActionCard({
  title,
  body,
  ctaLabel,
  ctaHref,
  onReset,
  className,
}: NextActionCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className={cn(
        'ml-11 rounded-2xl border border-accent-blue/20 bg-gradient-to-br from-accent-blue/10 to-accent-blue/3 p-4 space-y-3',
        className,
      )}
    >
      <div>
        <p className="text-sm font-semibold text-white leading-snug">{title}</p>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{body}</p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button
          onClick={() => router.push(ctaHref)}
          size="sm"
          className="flex-1 sm:flex-none"
        >
          {ctaLabel} →
        </Button>
        {onReset && (
          <button
            onClick={onReset}
            className="text-xs text-slate-500 hover:text-white transition-colors px-2 py-1.5"
          >
            Yeniden Başla
          </button>
        )}
      </div>
    </motion.div>
  );
}
