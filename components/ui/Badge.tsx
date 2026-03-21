import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'gold' | 'red' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'blue', className }: BadgeProps) {
  const variants = {
    blue: 'bg-accent-blue/15 text-accent-blue border border-accent-blue/20',
    green: 'bg-accent-green/15 text-accent-green border border-accent-green/20',
    gold: 'bg-pi-gold/15 text-pi-gold border border-pi-gold/20',
    red: 'bg-red-500/15 text-red-400 border border-red-500/20',
    gray: 'bg-white/5 text-slate-400 border border-white/10',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  );
}
