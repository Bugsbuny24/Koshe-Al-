import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function TeamPage() {
  return (
    <PlannedModulePage
      title="Team Workspace"
      version="V8"
      summary="Collaborative company OS — shared workspaces, role-based access, approval flows, and a shared knowledge base for your organisation."
      status="scaffolded"
      plannedCapabilities={[
        'Multi-tier workspace management (personal, team, department, company)',
        'Role-based access control with granular permissions',
        'Multi-stage approval flows',
        'Shared knowledge base with tagging',
        'Cross-workspace visibility controls',
      ]}
      dependsOn={['deals', 'execution']}
      ownerLayer="delivery"
      flagKey="V8_TEAM_WORKSPACE"
    />
  );
}
