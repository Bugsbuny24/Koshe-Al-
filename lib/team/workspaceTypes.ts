import type { WorkspaceType } from '@/types/team';

type WorkspaceTypeConfig = {
  label: string;
  icon: string;
  description: string;
};

export const WORKSPACE_TYPE_LABELS: Record<WorkspaceType, string> = {
  personal: 'Personal',
  team: 'Team',
  department: 'Department',
  company: 'Company',
};

export const WORKSPACE_TYPE_ICONS: Record<WorkspaceType, string> = {
  personal: '👤',
  team: '👥',
  department: '🏢',
  company: '🏛️',
};

export function getWorkspaceTypeConfig(type: WorkspaceType): WorkspaceTypeConfig {
  const descriptions: Record<WorkspaceType, string> = {
    personal: 'A private workspace for individual use.',
    team: 'Shared workspace for a small group or squad.',
    department: 'Workspace scoped to a department or division.',
    company: 'Organisation-wide workspace with full visibility.',
  };
  return {
    label: WORKSPACE_TYPE_LABELS[type],
    icon: WORKSPACE_TYPE_ICONS[type],
    description: descriptions[type],
  };
}
