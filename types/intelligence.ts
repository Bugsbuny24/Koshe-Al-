export type InsightType = 'pattern' | 'anomaly' | 'trend' | 'opportunity' | 'risk';
export type RecommendationType = 'workflow_optimization' | 'resource_allocation' | 'process_improvement' | 'risk_mitigation' | 'growth_action';
export type RiskSignalLevel = 'low' | 'medium' | 'high' | 'critical';
export type OptimizationDomain = 'speed' | 'quality' | 'cost' | 'reliability' | 'scalability';

export type Insight = {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  confidence: number;
  source_module: string;
  data_points: number;
  created_at: string;
  expires_at?: string;
};

export type Recommendation = {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  effort_level: 'low' | 'medium' | 'high';
  depends_on_insight?: string;
  created_at: string;
};

export type RiskSignal = {
  id: string;
  level: RiskSignalLevel;
  title: string;
  description: string;
  affected_module: string;
  detected_at: string;
  resolved: boolean;
};

export type OptimizationSuggestion = {
  id: string;
  domain: OptimizationDomain;
  title: string;
  description: string;
  estimated_improvement: string;
  implementation_complexity: 'low' | 'medium' | 'high';
};
