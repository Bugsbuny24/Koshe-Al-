import type { BenchmarkMetricType, BenchmarkMetric } from '@/types/network-intelligence';

export const BENCHMARK_METRIC_TYPE_LABELS: Record<BenchmarkMetricType, string> = {
  workflow_completion_time: 'Workflow Completion Time',
  output_quality_score: 'Output Quality Score',
  automation_rate: 'Automation Rate',
  revision_frequency: 'Revision Frequency',
  delivery_success_rate: 'Delivery Success Rate',
};

export type BenchmarkMetricConfig = {
  type: BenchmarkMetricType;
  label: string;
  description: string;
  unit: string;
};

export const BENCHMARK_METRIC_CONFIGS: Record<BenchmarkMetricType, BenchmarkMetricConfig> = {
  workflow_completion_time: {
    type: 'workflow_completion_time',
    label: 'Workflow Completion Time',
    description: 'Average time to complete a workflow from initiation to delivery.',
    unit: 'hours',
  },
  output_quality_score: {
    type: 'output_quality_score',
    label: 'Output Quality Score',
    description: 'Aggregated quality rating across all workflow outputs.',
    unit: 'score (0–100)',
  },
  automation_rate: {
    type: 'automation_rate',
    label: 'Automation Rate',
    description: 'Percentage of workflow steps completed without manual intervention.',
    unit: '%',
  },
  revision_frequency: {
    type: 'revision_frequency',
    label: 'Revision Frequency',
    description: 'Average number of revision cycles per workflow.',
    unit: 'revisions',
  },
  delivery_success_rate: {
    type: 'delivery_success_rate',
    label: 'Delivery Success Rate',
    description: 'Percentage of workflows delivered on time and accepted on first submission.',
    unit: '%',
  },
};

// Placeholder — populated when V19 benchmark engine is active
export const BENCHMARK_REGISTRY: BenchmarkMetric[] = [];

export function getBenchmarkMetricConfig(type: BenchmarkMetricType): BenchmarkMetricConfig {
  return BENCHMARK_METRIC_CONFIGS[type];
}
