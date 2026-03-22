import type { TeamRole } from '@/types/team';
import { TEAM_ROLE_LABELS, TEAM_ROLE_PERMISSIONS } from '@/lib/team/roles';

interface RoleCardProps {
  role: TeamRole;
}

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{TEAM_ROLE_LABELS[role]}</p>
      <p className="mt-1 text-xs text-slate-500">
        {TEAM_ROLE_PERMISSIONS[role].length} permissions
      </p>
    </div>
  );
}
