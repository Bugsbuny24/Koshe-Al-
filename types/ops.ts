export type HealthStatus = 'healthy' | 'warning' | 'critical' | 'unknown';
export type FeedbackCategory = 'quality' | 'speed' | 'communication' | 'scope' | 'other';
export type QualitySignalType = 'completion_rate' | 'revision_rate' | 'approval_rate' | 'error_rate' | 'satisfaction_score';

export type WorkflowHealthMetric = {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: HealthStatus;
  trend: 'up' | 'down' | 'stable';
  measured_at: string;
};

export type FeedbackItem = {
  id: string;
  source_id: string;
  source_type: 'deal' | 'execution' | 'production' | 'delivery';
  category: FeedbackCategory;
  rating?: number;
  note: string;
  created_at: string;
  resolved: boolean;
};

export type QualitySignal = {
  id: string;
  type: QualitySignalType;
  value: number;
  label: string;
  period: string;
  trend: 'improving' | 'stable' | 'declining';
};

export type OpsHealthSummary = {
  overall: HealthStatus;
  metrics: WorkflowHealthMetric[];
  signals: QualitySignal[];
  open_feedback_count: number;
  last_updated: string;
};
