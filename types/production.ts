// Production Engine types for V4
export type ProductionStatus = 'idle' | 'queued' | 'running' | 'paused' | 'completed' | 'failed';
export type ArtifactType = 'document' | 'code' | 'report' | 'presentation' | 'data' | 'media' | 'other';
export type PipelineStage = 'input' | 'processing' | 'review' | 'output' | 'delivery';

export type OutputArtifact = {
  id: string;
  type: ArtifactType;
  title: string;
  description: string;
  stage: PipelineStage;
  status: ProductionStatus;
  created_at: string;
  updated_at: string;
};

export type ProductionRun = {
  id: string;
  execution_run_id?: string;
  title: string;
  description: string;
  status: ProductionStatus;
  pipeline_stage: PipelineStage;
  artifacts: OutputArtifact[];
  started_at?: string;
  completed_at?: string;
  created_at: string;
};

export type ProductionTemplate = {
  id: string;
  name: string;
  description: string;
  artifact_types: ArtifactType[];
  pipeline_stages: PipelineStage[];
  estimated_duration_minutes: number;
  category: string;
};

export type ProductionQueue = {
  id: string;
  runs: ProductionRun[];
  total: number;
  active: number;
  pending: number;
};
