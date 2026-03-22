// Privacy-safe benchmark and pattern intelligence types
// CRITICAL: No actual customer data. Anonymized aggregates only.
export type BenchmarkMetricType =
  | 'workflow_completion_time'
  | 'output_quality_score'
  | 'automation_rate'
  | 'revision_frequency'
  | 'delivery_success_rate';

export type PatternType =
  | 'workflow_sequence'
  | 'bottleneck_location'
  | 'optimization_trigger'
  | 'failure_mode'
  | 'success_pattern';

export type PrivacyLevel = 'fully_anonymized' | 'aggregated_only' | 'no_data';

export type BenchmarkMetric = {
  id: string;
  type: BenchmarkMetricType;
  name: string;
  description: string;
  // Aggregate value only — no individual attribution
  aggregate_value: number;
  unit: string;
  sample_size_range: string; // e.g., "100-500 workflows"
  sector?: string;
  period: string;
  privacy_level: PrivacyLevel;
};

export type PatternInsight = {
  id: string;
  type: PatternType;
  title: string;
  description: string;
  // Confidence based on anonymized aggregate data
  confidence: number;
  sample_description: string; // e.g., "Observed across 200+ similar workflows"
  privacy_level: PrivacyLevel;
  applicable_sectors: string[];
};

export type PrivacyGuard = {
  id: string;
  rule_name: string;
  description: string;
  enforced: boolean;
  // What data is explicitly excluded
  exclusions: string[];
};

export type BenchmarkComparison = {
  id: string;
  metric_type: BenchmarkMetricType;
  user_value?: number; // Optional - user opt-in only
  benchmark_value: number;
  percentile_range?: string; // e.g., "top 25%"
  privacy_level: PrivacyLevel;
};
