import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function OpsFeedbackPage() {
  return (
    <PlannedModulePage
      title="Feedback Inbox"
      version="V5"
      summary="Centralised inbox for feedback across deals, executions, and deliveries. Triage, resolve, and act on quality signals."
      status="scaffolded"
      plannedCapabilities={[
        'Cross-source feedback aggregation',
        'Category filtering',
        'Resolution tracking',
        'Rating summaries',
        'Feedback routing',
      ]}
      dependsOn={['ops']}
      ownerLayer="ops"
      flagKey="V5_OPERATIONAL_INTELLIGENCE"
    />
  );
}
