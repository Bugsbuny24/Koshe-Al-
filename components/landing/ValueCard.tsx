interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ValueCard({ title, description, icon }: ValueCardProps) {
  return (
    <div className="bg-bg-card border border-white/5 rounded-2xl p-6 hover:border-accent-blue/20 transition-colors duration-200">
      <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-4">
        {icon}
      </div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
