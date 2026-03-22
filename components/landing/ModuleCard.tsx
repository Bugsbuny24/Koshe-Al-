interface ModuleCardProps {
  name: string;
  description: string;
  accent?: 'blue' | 'green' | 'gold';
}

const accentMap = {
  blue: {
    border: 'border-accent-blue/20 hover:border-accent-blue/40',
    dot: 'bg-accent-blue',
    label: 'text-accent-blue',
  },
  green: {
    border: 'border-accent-green/20 hover:border-accent-green/40',
    dot: 'bg-accent-green',
    label: 'text-accent-green',
  },
  gold: {
    border: 'border-pi-gold/20 hover:border-pi-gold/40',
    dot: 'bg-pi-gold',
    label: 'text-pi-gold',
  },
};

export function ModuleCard({ name, description, accent = 'blue' }: ModuleCardProps) {
  const a = accentMap[accent];
  return (
    <div className={`bg-bg-card border ${a.border} rounded-2xl p-5 transition-colors duration-200`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${a.dot}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${a.label}`}>{name}</span>
      </div>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
