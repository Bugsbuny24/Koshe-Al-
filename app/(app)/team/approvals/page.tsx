import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function ApprovalsPage() {
  return (
    <PlannedModulePage
      title="Approval Flows"
      version="V8"
      summary="Design multi-stage approval workflows that gate key actions, with role-based approvers and timeout escalation."
      status="scaffolded"
      plannedCapabilities={[
        'Visual approval flow builder',
        'Role-based approver assignment per stage',
        'Timeout and escalation rules',
        'Approval history and audit trail',
      ]}
      dependsOn={['deals', 'execution']}
      ownerLayer="intake"
      flagKey="V8_TEAM_WORKSPACE"
    />
  );
}
