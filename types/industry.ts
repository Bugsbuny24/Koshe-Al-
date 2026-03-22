// SAFE sectors only. Never add legal, healthcare, financial investment, credit/insurance, medical.
export type SafeSector =
  | 'tourism'
  | 'ecommerce'
  | 'agencies'
  | 'services'
  | 'real_estate_marketing'
  | 'education_content'
  | 'small_business_ops';

export type KnowledgeBlockType = 'template' | 'prompt' | 'workflow_step' | 'checklist' | 'glossary';
export type WorkflowTemplateCategory = 'intake' | 'production' | 'delivery' | 'reporting' | 'outreach';

export type IndustryPack = {
  id: string;
  sector: SafeSector;
  name: string;
  description: string;
  use_cases: string[];
  workflow_templates: string[];
  knowledge_blocks: string[];
  status: 'planned' | 'scaffolded' | 'active';
  version_introduced: string;
};

export type SectorUseCase = {
  id: string;
  sector: SafeSector;
  title: string;
  description: string;
  workflow_ids: string[];
  estimated_time_to_value: string;
};

export type KnowledgeBlock = {
  id: string;
  type: KnowledgeBlockType;
  sector: SafeSector;
  title: string;
  description: string;
  content_summary: string;
  tags: string[];
  version_introduced: string;
};

export type SectorWorkflowTemplate = {
  id: string;
  sector: SafeSector;
  category: WorkflowTemplateCategory;
  name: string;
  description: string;
  steps: WorkflowTemplateStep[];
  estimated_duration_hours: number;
  status: 'planned' | 'scaffolded' | 'active';
};

export type WorkflowTemplateStep = {
  id: string;
  sequence: number;
  title: string;
  description: string;
  required_inputs: string[];
  expected_outputs: string[];
};
