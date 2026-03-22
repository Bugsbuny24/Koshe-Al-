import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function FunnelsPage() {
  return (
    <PlannedModulePage
      title="Funnels"
      version="V10"
      summary="Design and track multi-stage revenue funnels from awareness through retention."
      status="scaffolded"
      plannedCapabilities={[
        'Visual funnel builder',
        'Stage conversion targets',
        'Asset assignment per stage',
        'Audience segmentation',
        'Funnel performance tracking',
      ]}
      dependsOn={['execution', 'production']}
      ownerLayer="production"
      flagKey="V10_REVENUE_OPERATOR"
    />
  );
}
