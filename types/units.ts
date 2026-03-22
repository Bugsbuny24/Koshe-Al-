export type UnitType = 'growth' | 'sales' | 'operations' | 'product' | 'support';
export type UnitStatus = 'planned' | 'scaffolded' | 'active' | 'paused';
export type UnitGoalType = 'revenue' | 'efficiency' | 'quality' | 'growth' | 'cost_reduction';
export type RoutingRuleType = 'round_robin' | 'skill_match' | 'load_balanced' | 'priority' | 'manual';

export type BusinessUnit = {
  id: string;
  type: UnitType;
  name: string;
  description: string;
  status: UnitStatus;
  goals: UnitGoal[];
  routing_rules: RoutingRule[];
  created_at: string;
};

export type UnitGoal = {
  id: string;
  unit_id: string;
  type: UnitGoalType;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  unit_label: string;
  deadline?: string;
};

export type RoutingRule = {
  id: string;
  unit_id: string;
  type: RoutingRuleType;
  name: string;
  description: string;
  conditions: Record<string, unknown>;
  priority: number;
};

export type UnitPerformanceMetric = {
  id: string;
  unit_id: string;
  metric_name: string;
  value: number;
  unit_label: string;
  trend: 'up' | 'down' | 'stable';
  measured_at: string;
};

export type UnitHealthSummary = {
  unit_id: string;
  overall_status: 'healthy' | 'warning' | 'critical';
  active_goals: number;
  completed_goals: number;
  pending_tasks: number;
  last_activity_at?: string;
};
