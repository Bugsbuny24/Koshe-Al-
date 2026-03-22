interface AudienceCardProps {
  label: string;
}

export function AudienceCard({ label }: AudienceCardProps) {
  return (
    <div className="bg-bg-card border border-white/5 rounded-xl px-4 py-3 text-center hover:border-accent-blue/20 transition-colors duration-200">
      <span className="text-slate-300 text-sm font-medium">{label}</span>
    </div>
  );
}
