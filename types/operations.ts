export type SOPType = 'process' | 'checklist' | 'runbook' | 'escalation' | 'onboarding';
export type InternalToolCategory = 'automation' | 'reporting' | 'integration' | 'workflow' | 'communication';
export type RequestFlowType = 'approval' | 'fulfillment' | 'escalation' | 'information' | 'change_request';
export type AutomationOpportunityLevel = 'quick_win' | 'medium_effort' | 'high_impact_project';

export type SOPDefinition = {
  id: string;
  type: SOPType;
  name: string;
  description: string;
  department: string;
  steps: SOPStep[];
  version: number;
  last_reviewed_at?: string;
  created_at: string;
};

export type SOPStep = {
  id: string;
  sop_id: string;
  sequence: number;
  title: string;
  description: string;
  responsible_role?: string;
  estimated_minutes?: number;
};

export type InternalTool = {
  id: string;
  category: InternalToolCategory;
  name: string;
  description: string;
  status: 'planned' | 'building' | 'active' | 'deprecated';
  use_cases: string[];
};

export type RequestFlow = {
  id: string;
  type: RequestFlowType;
  name: string;
  description: string;
  steps: string[];
  sla_hours?: number;
};

export type AutomationOpportunity = {
  id: string;
  level: AutomationOpportunityLevel;
  title: string;
  description: string;
  affected_process: string;
  estimated_time_saved_hours_per_week: number;
};
