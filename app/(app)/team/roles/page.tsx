import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function RolesPage() {
  return (
    <PlannedModulePage
      title="Roles & Permissions"
      version="V8"
      summary="Define team roles and fine-grained permissions that control what members can see and do across workspaces."
      status="scaffolded"
      plannedCapabilities={[
        'Built-in roles: owner, admin, manager, operator, viewer',
        'Custom role creation with permission sets',
        'Per-workspace role overrides',
        'Permission audit log',
      ]}
      dependsOn={['deals', 'execution']}
      ownerLayer="intake"
      flagKey="V8_TEAM_WORKSPACE"
    />
  );
}
