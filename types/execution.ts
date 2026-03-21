export type RequirementExtractionResult = {
  project_type: string;
  business_goal: string;
  target_user: string;
  core_features: string[];
  optional_features: string[];
  technical_requirements: string[];
  integrations: string[];
  constraints: string[];
  risks: string[];
  unknowns: string[];
  recommended_template: string | null;
  estimated_complexity: 'low' | 'medium' | 'high';
  suggested_stack: string[];
};

export type ArchitecturePlanResult = {
  recommended_stack: string[];
  frontend: string | null;
  backend: string | null;
  database: string | null;
  auth: string | null;
  deployment: string | null;
  external_services: string[];
  pages: string[];
  components: string[];
  data_entities: string[];
  api_endpoints: string[];
  architecture_notes: string[];
  delivery_strategy: string[];
  scalability_notes: string[];
};

export type TaskBreakdownResult = {
  phases: Array<{
    title: string;
    goal: string;
    tasks: Array<{
      id: string;
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
      difficulty: 'low' | 'medium' | 'high';
      depends_on: string[];
      estimated_output: string;
    }>;
  }>;
  milestone_suggestions: Array<{
    title: string;
    description: string;
    suggested_percentage: number;
  }>;
};

export type DeliveryChecklistResult = {
  checklist_title: string;
  items: Array<{
    title: string;
    description: string;
    category: 'scope' | 'technical' | 'content' | 'qa' | 'handoff';
    required: boolean;
  }>;
  handoff_notes: string[];
  acceptance_checkpoints: string[];
};

export type TemplateRuntimeResult = {
  template_id: string;
  title: string;
  description: string;
  brief_seed: string;
  scope_seed: string;
  default_milestone_mode: 'standard' | 'fast' | 'iterative';
  revision_policy: string[];
  acceptance_criteria: string[];
  delivery_checklist_seed: string[];
};

export type ExecutionRunStatus =
  | 'draft'
  | 'analyzed'
  | 'planned'
  | 'ready_for_project'
  | 'ready_for_deal'
  | 'linked_to_project'
  | 'linked_to_deal';

export type ExecutionRun = {
  id: string;
  user_id: string | null;
  template_id: string | null;
  /** Human-readable title set when saving the run */
  title: string | null;
  brief: string;
  requirement_json: RequirementExtractionResult | null;
  architecture_json: ArchitecturePlanResult | null;
  tasks_json: TaskBreakdownResult | null;
  checklist_json: DeliveryChecklistResult | null;
  project_id: string | null;
  deal_id: string | null;
  /** Milestone mode forwarded from template or task breakdown */
  milestone_mode: 'standard' | 'fast' | 'iterative' | null;
  /** Lifecycle status of this execution run */
  status: ExecutionRunStatus;
  /** Latest revision notes json stored for back-link feedback loop */
  revision_notes_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
