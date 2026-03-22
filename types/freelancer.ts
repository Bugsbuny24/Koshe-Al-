// Client interface — requires 'clients' table (not yet in DB, schema expansion needed)
export interface Client {
  id: string;
  workspace_id?: string;
  name: string;
  brand_name: string;
  niche?: string;
  website?: string;
  notes?: string;
  created_at: string;
}

// Project interface — matches the current public.projects schema
export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  prompt: string | null;
  generated_code: string | null;
  tech_stack: string[] | null;
  deploy_url: string | null;
  price_pi: number | null;
  is_published: boolean;
  is_deployed: boolean;
  created_at: string;
  updated_at: string;
}

// ProjectScope — requires 'project_scope' table (not yet in DB, schema expansion needed)
export interface ProjectScope {
  id: string;
  project_id: string;
  summary?: string;
  objectives?: string[];
  deliverables_json?: string[];
  exclusions_json?: string[];
  risks_json?: string[];
  questions_json?: string[];
  estimated_timeline_json?: Record<string, string> | string[];
  created_at: string;
}

// ProjectDraft — requires 'project_drafts' table (not yet in DB, schema expansion needed)
export interface ProjectDraft {
  id: string;
  project_id: string;
  draft_type: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
}

// ProjectRevision — requires 'project_revisions' table (not yet in DB, schema expansion needed)
export interface ProjectRevision {
  id: string;
  project_id: string;
  raw_feedback: string;
  parsed_feedback_json?: AiRevisionResult;
  scope_status?: 'in_scope' | 'partially_out_of_scope' | 'out_of_scope';
  action_items_json?: string[];
  created_at: string;
}

// ProjectDelivery — requires 'project_deliveries' table (not yet in DB, schema expansion needed)
export interface ProjectDelivery {
  id: string;
  project_id: string;
  delivery_summary?: string;
  client_message?: string;
  assets_json?: string[];
  next_steps_json?: string[];
  created_at: string;
}

export interface AiBriefResult {
  summary: string;
  objectives: string[];
  deliverables: string[];
  missing_information: string[];
  risks: string[];
  suggested_title: string;
}

export interface AiScopeResult {
  summary: string;
  objectives: string[];
  deliverables: string[];
  exclusions: string[];
  risks: string[];
  questions: string[];
  estimated_timeline: string[];
}

export interface AiDraftResult {
  drafts: {
    draft_type: string;
    title: string;
    content: string;
  }[];
}

export interface AiRevisionResult {
  summary: string;
  scope_status: 'in_scope' | 'partially_out_of_scope' | 'out_of_scope';
  requested_changes: string[];
  affected_sections: string[];
  action_items: string[];
  client_reply_suggestion: string;
}

export interface AiDeliveryResult {
  delivery_summary: string;
  client_message: string;
  assets: string[];
  next_steps: string[];
}
