import type { UnitGoal } from '@/types/units';
import { UNIT_GOAL_TYPE_LABELS, UNIT_GOAL_TYPE_CONFIGS } from '@/lib/units/unitGoals';

interface UnitGoalCardProps {
  goal: UnitGoal;
}

export default function UnitGoalCard({ goal }: UnitGoalCardProps) {
  const config = UNIT_GOAL_TYPE_CONFIGS[goal.type];
  const progress =
    goal.target_value > 0
      ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
      : 0;

  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-3">
      <div className="flex items-start gap-2">
        <span className="text-base">{config.icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{goal.title}</p>
          <p className="text-xs text-slate-500">{UNIT_GOAL_TYPE_LABELS[goal.type]}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400">{goal.description}</p>
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>
            {goal.current_value} / {goal.target_value} {goal.unit_label}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-bg-deep overflow-hidden">
          <div
            className="h-full rounded-full bg-accent-blue transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
