export type KPICategory = 'revenue' | 'operations' | 'growth' | 'team' | 'product' | 'customer';
export type DecisionType = 'strategic' | 'tactical' | 'operational' | 'risk_response';
export type RiskCategory = 'operational' | 'financial' | 'strategic' | 'reputational' | 'technical';
export type OpportunityType = 'market' | 'product' | 'partnership' | 'efficiency' | 'talent';

export type ExecutiveKPI = {
  id: string;
  category: KPICategory;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'on_track' | 'at_risk' | 'off_track';
  period: string;
};

export type DecisionContext = {
  id: string;
  type: DecisionType;
  title: string;
  description: string;
  options: DecisionOption[];
  recommendation?: string;
  deadline?: string;
  created_at: string;
};

export type DecisionOption = {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  risk_level: 'low' | 'medium' | 'high';
};

export type RiskOverview = {
  id: string;
  category: RiskCategory;
  title: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  owner?: string;
  status: 'identified' | 'mitigating' | 'resolved' | 'accepted';
};

export type OpportunitySignal = {
  id: string;
  type: OpportunityType;
  title: string;
  description: string;
  potential_impact: string;
  confidence: number;
  time_sensitivity: 'immediate' | 'short_term' | 'long_term';
};
