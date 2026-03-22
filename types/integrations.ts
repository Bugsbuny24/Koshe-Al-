export type IntegrationStatus = 'registered' | 'scaffolded' | 'active' | 'deprecated';

export type IntegrationLayer =
  | 'workflow'
  | 'automation'
  | 'memory'
  | 'agent'
  | 'monitoring'
  | 'tooling'
  | 'foundation';

export type IntegrationCategory =
  | 'llm-platform'
  | 'job-scheduler'
  | 'memory-layer'
  | 'multi-agent'
  | 'code-review'
  | 'monitoring'
  | 'developer-tools'
  | 'starter-template';

export type ExternalIntegration = {
  /** Unique integration identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Source repository URL */
  source_repo: string;
  /** Functional category */
  category: IntegrationCategory;
  /** Architectural layer this integration belongs to */
  layer: IntegrationLayer;
  /** Short description of what this integration provides */
  summary: string;
  /** Which Koschei modules / capabilities this integration powers */
  powers: string[];
  /** Whether this integration is currently enabled */
  status: IntegrationStatus;
  /** Corresponding feature flag key (if any) */
  flag_key?: string;
  /** Route prefix where this integration surfaces in the UI */
  route_prefix?: string;
  /** Required environment variables */
  env_vars?: string[];
  /** Merge strategy used when integrating */
  merge_strategy: 'layered';
};
