import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function WorkspacesPage() {
  return (
    <PlannedModulePage
      title="Workspaces"
      version="V8"
      summary="Create and manage workspaces scoped to individuals, teams, departments, or your entire organisation."
      status="scaffolded"
      plannedCapabilities={[
        'Create personal, team, department, and company workspaces',
        'Manage workspace members and access',
        'Workspace-level settings and branding',
        'Cross-workspace sharing and permissions',
      ]}
      dependsOn={['deals', 'execution']}
      ownerLayer="delivery"
      flagKey="V8_TEAM_WORKSPACE"
    />
  );
}
