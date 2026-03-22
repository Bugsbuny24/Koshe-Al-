import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function UnitRoutingPage() {
  return (
    <PlannedModulePage
      title="Unit Routing"
      version="V17"
      summary="Configure and manage task routing rules across autonomous business units. Define round-robin, skill-match, load-balanced, and priority-based routing strategies."
      plannedCapabilities={[
        'Routing rule builder',
        'Skill-based routing',
        'Load balancing',
        'Priority queues',
        'Routing analytics',
      ]}
      dependsOn={['autonomy', 'team']}
      ownerLayer="production"
      flagKey="V17_MULTI_UNIT_ROUTING"
    />
  );
}
