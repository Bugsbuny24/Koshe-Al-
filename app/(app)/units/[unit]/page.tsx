import { use } from 'react';
import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function UnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit } = use(params);

  return (
    <PlannedModulePage
      title={`Unit: ${unit}`}
      version="V16–V18"
      summary="This autonomous business unit is scaffolded for future versions. Goal management, task routing, and performance tracking will be available here."
      dependsOn={['autonomy', 'team', 'production']}
      ownerLayer="production"
      flagKey="V16_AUTONOMOUS_UNITS"
    />
  );
}
