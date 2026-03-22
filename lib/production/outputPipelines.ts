import type { PipelineStage } from '@/types/production';

export type PipelineDefinition = {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  category: string;
};

export const outputPipelineRegistry: PipelineDefinition[] = [
  {
    id: 'standard',
    name: 'Standard Pipeline',
    description: 'Default pipeline for general artifact production.',
    stages: ['input', 'processing', 'review', 'output', 'delivery'],
    category: 'general',
  },
  {
    id: 'fast-track',
    name: 'Fast-Track Pipeline',
    description: 'Streamlined pipeline skipping the review stage.',
    stages: ['input', 'processing', 'output', 'delivery'],
    category: 'expedited',
  },
  {
    id: 'review-heavy',
    name: 'Review-Heavy Pipeline',
    description: 'Extended review cycles for high-stakes deliverables.',
    stages: ['input', 'processing', 'review', 'review', 'output', 'delivery'],
    category: 'quality',
  },
];

export function getDefaultPipeline(): PipelineDefinition {
  return outputPipelineRegistry[0];
}

export function getPipelineStages(pipelineId: string): PipelineStage[] {
  const pipeline = outputPipelineRegistry.find((p) => p.id === pipelineId);
  return pipeline ? pipeline.stages : getDefaultPipeline().stages;
}
