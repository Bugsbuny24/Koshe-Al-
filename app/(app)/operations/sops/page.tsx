import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function SOPsPage() {
  return (
    <PlannedModulePage
      title="SOPs & Runbooks"
      version="V11"
      summary="Centralised library of standard operating procedures, checklists, runbooks, and escalation protocols."
      status="scaffolded"
      plannedCapabilities={[
        'SOP creation and versioning',
        'Step-by-step runbook builder',
        'Role assignment per step',
        'Review scheduling',
        'Checklist mode',
      ]}
      dependsOn={['execution', 'production', 'ops']}
      ownerLayer="production"
      flagKey="V11_OPERATIONS_OPERATOR"
    />
  );
}
