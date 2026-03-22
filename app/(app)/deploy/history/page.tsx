import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function DeployHistoryPage() {
  return (
    <PlannedModulePage
      title="Deploy History"
      version="V6"
      summary="Browse the full history of deployments. Review statuses, durations, artifact links, and deployment logs."
      status="scaffolded"
      plannedCapabilities={[
        'Deployment log viewer',
        'Status filtering',
        'Duration tracking',
        'Artifact linkage',
        'Connector attribution',
      ]}
      dependsOn={['deploy']}
      ownerLayer="delivery"
      flagKey="V6_DEPLOY_CONNECTORS"
    />
  );
}
