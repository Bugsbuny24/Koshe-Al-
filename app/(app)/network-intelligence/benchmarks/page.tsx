import PlannedModulePage from '@/components/common/PlannedModulePage';

export default function BenchmarksPage() {
  return (
    <PlannedModulePage
      title="Benchmarks"
      version="V19-V20"
      summary="Anonymized workflow performance benchmarks. Compare your metrics against aggregated, fully anonymized data from similar workflows — opt-in only."
      plannedCapabilities={[
        'Opt-in benchmark participation',
        'Sector-level comparisons',
        'Workflow completion time benchmarks',
        'Quality score benchmarks',
        'Delivery success rate comparisons',
      ]}
      dependsOn={['intelligence', 'ops']}
      ownerLayer="intelligence"
      flagKey="V20_BENCHMARK_ENGINE"
    />
  );
}
