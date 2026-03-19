interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({ value, max = 100, label, showPercent = true }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="space-y-1.5">
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-[#8A8680]">{label}</span>}
          {showPercent && <span className="text-[#F0A500] font-medium">{percent}%</span>}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-[rgba(240,165,0,0.1)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#F0A500] to-[#FF6B2B] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
