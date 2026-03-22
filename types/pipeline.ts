/**
 * Pipeline / Workflow node system — inspired by Dify's workflow builder.
 *
 * A Pipeline is a directed sequence of Nodes. Each Node has a type,
 * configuration, and produces an output that the next Node can consume.
 * This mirrors Dify's approach of composing LLM nodes, code blocks,
 * conditional routers, and knowledge-retrieval steps into a single flow.
 */

// ── Node types ────────────────────────────────────────────────────────────────

export type NodeType =
  | 'llm'          // Call an LLM with a prompt (Dify: LLM node)
  | 'transform'    // Transform / map data (Dify: Code node)
  | 'condition'    // Conditional branch (Dify: IF/ELSE node)
  | 'retrieval'    // Knowledge base retrieval (Dify: Knowledge Retrieval node)
  | 'output';      // Final output collector

export type NodeStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

// ── Node definitions ──────────────────────────────────────────────────────────

export interface LLMNodeConfig {
  model: 'gemini-2.5-flash' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  promptTemplate: string;  // May reference {{input}} or prior node output vars
  temperature?: number;    // 0–1, defaults to 0.3
  jsonMode?: boolean;      // Parse output as JSON
  outputKey: string;       // Key name for downstream nodes to reference
}

export interface TransformNodeConfig {
  /** JavaScript-like expression string evaluated server-side safely */
  expression: string;
  outputKey: string;
}

export interface ConditionNodeConfig {
  /** Variable reference like "{{requirements.estimated_complexity}}" */
  variable: string;
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt';
  value: string | number;
  trueBranchNodeId: string;
  falseBranchNodeId: string;
}

export interface RetrievalNodeConfig {
  knowledgeBaseId: string;
  query: string;      // May reference {{input}}
  topK: number;
  outputKey: string;
}

export interface OutputNodeConfig {
  /** Keys from prior node outputs to include in the final result */
  collectKeys: string[];
}

export type NodeConfig =
  | ({ type: 'llm' } & LLMNodeConfig)
  | ({ type: 'transform' } & TransformNodeConfig)
  | ({ type: 'condition' } & ConditionNodeConfig)
  | ({ type: 'retrieval' } & RetrievalNodeConfig)
  | ({ type: 'output' } & OutputNodeConfig);

// ── Pipeline node ─────────────────────────────────────────────────────────────

export interface PipelineNode {
  id: string;
  label: string;
  config: NodeConfig;
  /** Node IDs this node depends on (for DAG ordering) */
  dependsOn?: string[];
}

// ── Pipeline definition ───────────────────────────────────────────────────────

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  /** Ordered list of nodes; conditional branches resolved at runtime */
  nodes: PipelineNode[];
  /** ID of the first node to execute */
  entryNodeId: string;
  createdAt: string;
  updatedAt: string;
}

// ── Pipeline run ──────────────────────────────────────────────────────────────

export type PipelineRunStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface NodeRunLog {
  nodeId: string;
  nodeLabel: string;
  status: NodeStatus;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  outputPreview?: string;  // First 200 chars of output
  error?: string;
}

export interface PipelineRun {
  id: string;
  pipelineId: string;
  pipelineName: string;
  input: Record<string, unknown>;
  status: PipelineRunStatus;
  nodeLogs: NodeRunLog[];
  output: Record<string, unknown> | null;
  error?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}
