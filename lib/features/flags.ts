export type FeatureFlagKey =
  | 'V4_PRODUCTION_ENGINE'
  | 'V5_OPERATIONAL_INTELLIGENCE'
  | 'V6_DEPLOY_CONNECTORS'
  | 'V7_AUTONOMOUS_PRODUCTION'
  | 'V8_TEAM_WORKSPACE'
  | 'V9_LEARNING_ENGINE'
  | 'V10_REVENUE_OPERATOR'
  | 'V11_OPERATIONS_OPERATOR'
  | 'V12_EXECUTIVE_OPERATOR'
  | 'V13_INDUSTRY_PACKS'
  | 'V14_SECTOR_KNOWLEDGE'
  | 'V15_SECTOR_WORKFLOWS'
  | 'V16_AUTONOMOUS_UNITS'
  | 'V17_MULTI_UNIT_ROUTING'
  | 'V18_UNIT_ANALYTICS'
  | 'V19_CROSS_COMPANY_INTELLIGENCE'
  | 'V20_BENCHMARK_ENGINE'
  // Integration layer — external repos merged with --merge-strategy layered
  | 'INT_DIFY_WORKFLOW'
  | 'INT_TRIGGER_DEV'
  | 'INT_CONVEX_AI_FOUNDATION'
  | 'INT_MEM0_MEMORY'
  | 'INT_DEER_FLOW_AGENTS'
  | 'INT_RUVIEW_CODE_REVIEW'
  | 'INT_WORLDMONITOR'
  | 'INT_SUPERPOWERS';

export type FeatureFlag = {
  key: FeatureFlagKey;
  enabled: boolean;
  version: string;
  label: string;
  description: string;
};

export const featureFlags: Record<FeatureFlagKey, FeatureFlag> = {
  V4_PRODUCTION_ENGINE: {
    key: 'V4_PRODUCTION_ENGINE',
    enabled: false,
    version: 'v4',
    label: 'Production Engine',
    description:
      'Structured AI deliverable generation engine. Takes approved proposals and produces content, assets, and documents at scale.',
  },
  V5_OPERATIONAL_INTELLIGENCE: {
    key: 'V5_OPERATIONAL_INTELLIGENCE',
    enabled: false,
    version: 'v5',
    label: 'Operational Intelligence',
    description:
      'Real-time operational dashboards showing pipeline throughput, error rates, and stage latency across all active deals.',
  },
  V6_DEPLOY_CONNECTORS: {
    key: 'V6_DEPLOY_CONNECTORS',
    enabled: false,
    version: 'v6',
    label: 'Deploy Connectors',
    description:
      'One-click deployment of deliverables to external platforms: Notion, Google Drive, email, and webhooks.',
  },
  V7_AUTONOMOUS_PRODUCTION: {
    key: 'V7_AUTONOMOUS_PRODUCTION',
    enabled: false,
    version: 'v7',
    label: 'Autonomous Production',
    description:
      'Scheduled and event-driven autonomous job execution. Allows Koschei to self-trigger production runs without manual initiation.',
  },
  V8_TEAM_WORKSPACE: {
    key: 'V8_TEAM_WORKSPACE',
    enabled: false,
    version: 'v8',
    label: 'Team / Company OS',
    description:
      'Multi-user team workspace with role-based access, shared deal views, team inboxes, and permission layers.',
  },
  V9_LEARNING_ENGINE: {
    key: 'V9_LEARNING_ENGINE',
    enabled: false,
    version: 'v9',
    label: 'Learning Engine',
    description:
      'Feedback loops and outcome-learning system that improves Koschei over time based on completed deal results.',
  },
  V10_REVENUE_OPERATOR: {
    key: 'V10_REVENUE_OPERATOR',
    enabled: false,
    version: 'v10',
    label: 'Revenue Operator',
    description:
      'Automated revenue cycle management: pricing models, upsell triggers, invoice generation, and payment tracking.',
  },
  V11_OPERATIONS_OPERATOR: {
    key: 'V11_OPERATIONS_OPERATOR',
    enabled: false,
    version: 'v11',
    label: 'Operations Operator',
    description:
      'Internal operations automation: SOP library, automated QA checklists, and task assignment engine.',
  },
  V12_EXECUTIVE_OPERATOR: {
    key: 'V12_EXECUTIVE_OPERATOR',
    enabled: false,
    version: 'v12',
    label: 'Executive Operator',
    description:
      'Executive command layer with KPI summaries, strategic recommendations, and board-level reporting.',
  },
  V13_INDUSTRY_PACKS: {
    key: 'V13_INDUSTRY_PACKS',
    enabled: false,
    version: 'v13',
    label: 'Industry Packs',
    description:
      'Pre-configured capability bundles for specific safe industries: tourism, ecommerce, agencies, services, and more.',
  },
  V14_SECTOR_KNOWLEDGE: {
    key: 'V14_SECTOR_KNOWLEDGE',
    enabled: false,
    version: 'v14',
    label: 'Sector Knowledge',
    description:
      'Deep sector-specific knowledge bases, terminology dictionaries, and context injectors for AI reasoning.',
  },
  V15_SECTOR_WORKFLOWS: {
    key: 'V15_SECTOR_WORKFLOWS',
    enabled: false,
    version: 'v15',
    label: 'Sector Workflows',
    description:
      'End-to-end automated workflows tailored to each sector: sector-specific deal pipelines, automation sequences, and delivery flows.',
  },
  V16_AUTONOMOUS_UNITS: {
    key: 'V16_AUTONOMOUS_UNITS',
    enabled: false,
    version: 'v16',
    label: 'Autonomous Units',
    description:
      'Self-contained AI business units that operate independently with isolated resources and execution environments.',
  },
  V17_MULTI_UNIT_ROUTING: {
    key: 'V17_MULTI_UNIT_ROUTING',
    enabled: false,
    version: 'v17',
    label: 'Multi-Unit Routing',
    description:
      'Intelligent routing of work and clients across multiple autonomous units using load balancing and specialization algorithms.',
  },
  V18_UNIT_ANALYTICS: {
    key: 'V18_UNIT_ANALYTICS',
    enabled: false,
    version: 'v18',
    label: 'Unit Analytics',
    description:
      'Per-unit performance analytics: KPIs, comparative benchmarking, and resource utilization dashboards.',
  },
  V19_CROSS_COMPANY_INTELLIGENCE: {
    key: 'V19_CROSS_COMPANY_INTELLIGENCE',
    enabled: false,
    version: 'v19',
    label: 'Cross-Company Intelligence',
    description:
      'Anonymized signal aggregation across Koschei deployments for industry trend detection and pattern recognition. Opt-in only.',
  },
  V20_BENCHMARK_ENGINE: {
    key: 'V20_BENCHMARK_ENGINE',
    enabled: false,
    version: 'v20',
    label: 'Benchmark Engine',
    description:
      'Percentile rankings, performance gap analysis, and improvement recommendations versus industry peers.',
  },
  // ── Integration layer ──────────────────────────────────────────────────────
  INT_DIFY_WORKFLOW: {
    key: 'INT_DIFY_WORKFLOW',
    enabled: false,
    version: 'int',
    label: 'Dify Workflow Integration',
    description:
      'Visual LLM workflow builder and RAG pipeline from Dify. Powers structured AI workflow execution in the Production Engine.',
  },
  INT_TRIGGER_DEV: {
    key: 'INT_TRIGGER_DEV',
    enabled: false,
    version: 'int',
    label: 'Trigger.dev Job Scheduler',
    description:
      'Background job and workflow scheduling via Trigger.dev. Enables reliable long-running AI production jobs and autonomous runs.',
  },
  INT_CONVEX_AI_FOUNDATION: {
    key: 'INT_CONVEX_AI_FOUNDATION',
    enabled: false,
    version: 'int',
    label: 'Next.js + Convex + AI Foundation',
    description:
      'Real-time backend patterns from the starter-nextjs-convex-ai template. Provides type-safe, AI-first data sync conventions.',
  },
  INT_MEM0_MEMORY: {
    key: 'INT_MEM0_MEMORY',
    enabled: false,
    version: 'int',
    label: 'Mem0 AI Memory Layer',
    description:
      'Persistent adaptive memory for AI agents via Mem0. Enables cross-session learning, user preference retention, and context recall.',
  },
  INT_DEER_FLOW_AGENTS: {
    key: 'INT_DEER_FLOW_AGENTS',
    enabled: false,
    version: 'int',
    label: 'DeerFlow Multi-Agent Framework',
    description:
      'ByteDance deep research and multi-agent orchestration. Powers autonomous multi-step planning and executive reporting flows.',
  },
  INT_RUVIEW_CODE_REVIEW: {
    key: 'INT_RUVIEW_CODE_REVIEW',
    enabled: false,
    version: 'int',
    label: 'RuView AI Code Review',
    description:
      'AI-powered code review and quality gate for generated deliverables. Surfaces issues before deployment via Deploy Connectors.',
  },
  INT_WORLDMONITOR: {
    key: 'INT_WORLDMONITOR',
    enabled: false,
    version: 'int',
    label: 'WorldMonitor Signal Monitor',
    description:
      'Global monitoring and external signal collection. Feeds trend data into Operational Intelligence and Cross-Company Intelligence.',
  },
  INT_SUPERPOWERS: {
    key: 'INT_SUPERPOWERS',
    enabled: false,
    version: 'int',
    label: 'Superpowers Developer Tools',
    description:
      'Developer productivity extensions for code generation, scaffolding, and automation in the Production and Operations pipelines.',
  },
};

export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  return featureFlags[key]?.enabled ?? false;
}
