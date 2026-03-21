import { motion } from 'framer-motion';

interface ComingSoonCardProps {
  title?: string;
  message?: string;
  icon?: string;
  className?: string;
}

export function ComingSoonCard({
  title = 'Yakında',
  message = 'Bu akış V1 kapsamında henüz aktif değil.',
  icon = '🔧',
  className = '',
}: ComingSoonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-bg-card border border-white/8 rounded-xl px-5 py-4 flex items-start gap-3 ${className}`}
    >
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{message}</p>
      </div>
    </motion.div>
  );
}
