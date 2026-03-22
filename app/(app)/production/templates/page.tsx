import { PlannedModulePage } from '@/components/common/PlannedModulePage';

export default function ProductionTemplatesPage() {
  return (
    <PlannedModulePage
      title="Production Templates"
      version="V4"
      summary="Manage reusable production templates. Define pipeline stages, artifact types, and estimated durations for common output patterns."
      status="scaffolded"
      plannedCapabilities={[
        'Template library',
        'Pipeline stage configuration',
        'Artifact type selection',
        'Duration estimates',
        'Category organisation',
      ]}
      dependsOn={['production']}
      ownerLayer="production"
      flagKey="V4_PRODUCTION_ENGINE"
    />
  );
}
