import type { KnowledgeBlockType } from '@/types/industry';

export const KNOWLEDGE_BLOCK_TYPE_LABELS: Record<KnowledgeBlockType, string> = {
  template: 'Template',
  prompt: 'Prompt',
  workflow_step: 'Workflow Step',
  checklist: 'Checklist',
  glossary: 'Glossary',
};

export type KnowledgeSchema = {
  type: KnowledgeBlockType;
  label: string;
  description: string;
  required_fields: string[];
  optional_fields: string[];
};

export const KNOWLEDGE_SCHEMA_REGISTRY: KnowledgeSchema[] = [
  {
    type: 'template',
    label: 'Template',
    description: 'A reusable document or content structure for a specific output type.',
    required_fields: ['title', 'content_summary', 'sector'],
    optional_fields: ['tags', 'example_output'],
  },
  {
    type: 'prompt',
    label: 'Prompt',
    description: 'A pre-written AI prompt optimised for a sector-specific task.',
    required_fields: ['title', 'content_summary', 'sector'],
    optional_fields: ['tags', 'example_output', 'model_hint'],
  },
  {
    type: 'workflow_step',
    label: 'Workflow Step',
    description: 'A discrete step definition that can be embedded in a workflow template.',
    required_fields: ['title', 'content_summary', 'sector'],
    optional_fields: ['tags', 'required_inputs', 'expected_outputs'],
  },
  {
    type: 'checklist',
    label: 'Checklist',
    description: 'A structured checklist for quality control or process completion.',
    required_fields: ['title', 'content_summary', 'sector'],
    optional_fields: ['tags', 'items'],
  },
  {
    type: 'glossary',
    label: 'Glossary',
    description: 'Sector-specific terminology definitions and reference material.',
    required_fields: ['title', 'content_summary', 'sector'],
    optional_fields: ['tags', 'terms'],
  },
];

export function getKnowledgeSchema(type: KnowledgeBlockType): KnowledgeSchema | undefined {
  return KNOWLEDGE_SCHEMA_REGISTRY.find((schema) => schema.type === type);
}
