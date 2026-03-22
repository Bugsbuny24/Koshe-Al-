export type TeamRole = 'owner' | 'admin' | 'manager' | 'operator' | 'viewer';
export type ApprovalFlowStatus = 'pending' | 'approved' | 'rejected' | 'escalated';
export type WorkspaceType = 'personal' | 'team' | 'department' | 'company';

export type TeamMember = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: TeamRole;
  workspace_id: string;
  joined_at: string;
};

export type TeamWorkspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  description: string;
  member_count: number;
  created_at: string;
};

export type ApprovalFlow = {
  id: string;
  name: string;
  description: string;
  stages: ApprovalFlowStage[];
  created_at: string;
};

export type ApprovalFlowStage = {
  id: string;
  flow_id: string;
  name: string;
  approver_role: TeamRole;
  sequence: number;
  timeout_hours?: number;
};

export type SharedKnowledgeEntry = {
  id: string;
  workspace_id: string;
  title: string;
  content_summary: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
};
