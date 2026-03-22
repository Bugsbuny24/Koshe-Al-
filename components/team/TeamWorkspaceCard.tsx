import type { TeamWorkspace } from '@/types/team';

interface TeamWorkspaceCardProps {
  workspace: TeamWorkspace;
}

export default function TeamWorkspaceCard({ workspace }: TeamWorkspaceCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{workspace.name}</p>
      <p className="mt-1 text-xs text-slate-400">{workspace.description}</p>
      <p className="mt-1 text-xs text-slate-500">Type: {workspace.type} · {workspace.member_count} members</p>
    </div>
  );
}
