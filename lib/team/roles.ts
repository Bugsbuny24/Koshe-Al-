import type { TeamRole } from '@/types/team';

type RoleConfig = {
  label: string;
  description: string;
  permissions: string[];
};

export const TEAM_ROLE_LABELS: Record<TeamRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  operator: 'Operator',
  viewer: 'Viewer',
};

export const TEAM_ROLE_PERMISSIONS: Record<TeamRole, string[]> = {
  owner: [
    'workspace.manage',
    'members.invite',
    'members.remove',
    'roles.assign',
    'approvals.manage',
    'knowledge.write',
    'knowledge.read',
    'runs.execute',
    'runs.view',
  ],
  admin: [
    'members.invite',
    'members.remove',
    'roles.assign',
    'approvals.manage',
    'knowledge.write',
    'knowledge.read',
    'runs.execute',
    'runs.view',
  ],
  manager: [
    'members.invite',
    'approvals.manage',
    'knowledge.write',
    'knowledge.read',
    'runs.execute',
    'runs.view',
  ],
  operator: [
    'knowledge.read',
    'runs.execute',
    'runs.view',
  ],
  viewer: [
    'knowledge.read',
    'runs.view',
  ],
};

export function getRoleConfig(role: TeamRole): RoleConfig {
  return {
    label: TEAM_ROLE_LABELS[role],
    description: getRoleDescription(role),
    permissions: TEAM_ROLE_PERMISSIONS[role],
  };
}

function getRoleDescription(role: TeamRole): string {
  const descriptions: Record<TeamRole, string> = {
    owner: 'Full control over the workspace, members, and all settings.',
    admin: 'Can manage members and configure workspace settings.',
    manager: 'Can invite members and manage approval workflows.',
    operator: 'Can execute runs and read shared knowledge.',
    viewer: 'Read-only access to runs and shared knowledge.',
  };
  return descriptions[role];
}
