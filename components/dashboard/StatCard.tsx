import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: 'blue' | 'green' | 'gold' | 'red';
  description?: string;
  className?: string;
}

export function StatCard({ label, value, icon, color = 'blue', description, className }: StatCardProps) {
  const colors = {
    blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/20',
    green: 'bg-accent-green/15 text-accent-green border-accent-green/20',
    gold: 'bg-pi-gold/15 text-pi-gold border-pi-gold/20',
    red: 'bg-red-500/15 text-red-400 border-red-500/20',
  };

  return (
    <div className={cn('bg-bg-card border border-white/5 rounded-xl p-5', className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center border text-lg', colors[color])}>
          {icon}
        </div>
      </div>
      {description && <p className="text-xs text-slate-500">{description}</p>}
    </div>
  );
}
