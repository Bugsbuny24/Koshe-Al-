import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function UnitsPage() {
  return (
    <PlannedModulePage
      title="Autonomous Units"
      version="V16"
      summary="Business unit framework. Define and manage autonomous operational units for growth, sales, operations, product, and support."
      plannedCapabilities={[
        'Unit definition',
        'Goal management',
        'Task routing',
        'Performance tracking',
        'Inter-unit communication',
      ]}
      dependsOn={['autonomy', 'team', 'production']}
      ownerLayer="production"
      flagKey="V16_AUTONOMOUS_UNITS"
    />
  );
}
