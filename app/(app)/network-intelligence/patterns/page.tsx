import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function PatternInsightsPage() {
  return (
    <PlannedModulePage
      title="Pattern Insights"
      version="V19"
      summary="Aggregated, anonymized workflow pattern detection. Discover common success patterns, bottlenecks, and optimisation triggers observed across similar workflows — no individual data ever used."
      plannedCapabilities={[
        'Success pattern detection',
        'Bottleneck identification',
        'Optimisation trigger alerts',
        'Failure mode awareness',
        'Sector-filtered insights',
      ]}
      dependsOn={['intelligence', 'ops']}
      ownerLayer="intelligence"
      flagKey="V19_CROSS_COMPANY_INTELLIGENCE"
    />
  );
}
