import type { ExternalIntegration } from '@/types/integrations';

/**
 * Registry of all external integrations layered onto the Koschei base.
 *
 * Integration command (origin):
 *   copilot integrate \
 *     --base-repo ./koschei \
 *     --add https://github.com/langgenius/dify \
 *     --add https://github.com/triggerdotdev/trigger.dev \
 *     --add https://github.com/appydave-templates/starter-nextjs-convex-ai \
 *     --add https://github.com/mem0ai/mem0 \
 *     --add https://github.com/bytedance/deer-flow \
 *     --add https://github.com/ruvnet/RuView \
 *     --add https://github.com/koala73/worldmonitor \
 *     --add https://github.com/obra/superpowers \
 *     --preserve-structure \
 *     --merge-strategy layered \
 *     --validate-build \
 *     --generate-docs
 */
export const integrationRegistry: ExternalIntegration[] = [
  {
    id: 'dify',
    name: 'Dify — LLM Application Platform',
    source_repo: 'https://github.com/langgenius/dify',
    category: 'llm-platform',
    layer: 'workflow',
    summary:
      'Open-source LLM application development platform. Provides visual workflow builder, RAG pipeline, agent capabilities, and model management. Powers Koschei\'s production engine with structured AI workflow execution.',
    powers: ['production-v4', 'production-v7', 'intelligence-v5'],
    status: 'registered',
    flag_key: 'INT_DIFY_WORKFLOW',
    route_prefix: '/integrations/dify',
    env_vars: ['DIFY_API_KEY', 'DIFY_API_BASE_URL'],
    merge_strategy: 'layered',
  },
  {
    id: 'trigger-dev',
    name: 'Trigger.dev — Background Job Scheduler',
    source_repo: 'https://github.com/triggerdotdev/trigger.dev',
    category: 'job-scheduler',
    layer: 'automation',
    summary:
      'Open-source background job and workflow scheduling platform. Enables Koschei to schedule, queue, and reliably execute long-running AI production jobs, deal pipeline tasks, and autonomous production runs.',
    powers: ['production-v4', 'production-v7', 'delivery-v6'],
    status: 'registered',
    flag_key: 'INT_TRIGGER_DEV',
    route_prefix: '/integrations/trigger',
    env_vars: ['TRIGGER_API_KEY', 'TRIGGER_API_URL'],
    merge_strategy: 'layered',
  },
  {
    id: 'starter-nextjs-convex-ai',
    name: 'Starter — Next.js + Convex + AI',
    source_repo: 'https://github.com/appydave-templates/starter-nextjs-convex-ai',
    category: 'starter-template',
    layer: 'foundation',
    summary:
      'Reference template for Next.js applications backed by Convex real-time database with AI integrations. Provides patterns for real-time data sync, AI-first routing, and type-safe backend calls that align with Koschei\'s architecture.',
    powers: ['intake-v1', 'planning-v2', 'planning-v3'],
    status: 'registered',
    flag_key: 'INT_CONVEX_AI_FOUNDATION',
    env_vars: ['NEXT_PUBLIC_CONVEX_URL'],
    merge_strategy: 'layered',
  },
  {
    id: 'mem0',
    name: 'Mem0 — AI Memory Layer',
    source_repo: 'https://github.com/mem0ai/mem0',
    category: 'memory-layer',
    layer: 'memory',
    summary:
      'Persistent, adaptive memory layer for AI agents. Enables Koschei to remember user preferences, past deal outcomes, and learned patterns across sessions — directly powering the Learning Engine and sector knowledge.',
    powers: ['intelligence-v9', 'intelligence-v14', 'intelligence-v19'],
    status: 'registered',
    flag_key: 'INT_MEM0_MEMORY',
    route_prefix: '/integrations/memory',
    env_vars: ['MEM0_API_KEY', 'MEM0_ORG_ID', 'MEM0_PROJECT_ID'],
    merge_strategy: 'layered',
  },
  {
    id: 'deer-flow',
    name: 'DeerFlow — Multi-Agent Research Framework',
    source_repo: 'https://github.com/bytedance/deer-flow',
    category: 'multi-agent',
    layer: 'agent',
    summary:
      'ByteDance open-source deep research and multi-agent orchestration framework. Powers Koschei\'s Autonomous Production and Executive Operator modules with structured multi-step research, planning, and execution flows.',
    powers: ['production-v7', 'intelligence-v12', 'intelligence-v5'],
    status: 'registered',
    flag_key: 'INT_DEER_FLOW_AGENTS',
    route_prefix: '/integrations/agents',
    env_vars: ['DEER_FLOW_API_KEY'],
    merge_strategy: 'layered',
  },
  {
    id: 'ruview',
    name: 'RuView — AI Code Review',
    source_repo: 'https://github.com/ruvnet/RuView',
    category: 'code-review',
    layer: 'tooling',
    summary:
      'AI-powered code review and analysis tool by ruvnet. Enables Koschei to run automated quality gates on generated code deliverables, supporting the Deploy Connectors and Operations Operator modules.',
    powers: ['delivery-v6', 'production-v11', 'intelligence-v5'],
    status: 'registered',
    flag_key: 'INT_RUVIEW_CODE_REVIEW',
    route_prefix: '/integrations/review',
    env_vars: ['RUVIEW_API_KEY'],
    merge_strategy: 'layered',
  },
  {
    id: 'worldmonitor',
    name: 'WorldMonitor — Global Signal Monitor',
    source_repo: 'https://github.com/koala73/worldmonitor',
    category: 'monitoring',
    layer: 'monitoring',
    summary:
      'Global monitoring and signal collection framework. Provides Koschei\'s Operational Intelligence and Cross-Company Intelligence modules with external trend data, system health signals, and benchmark inputs.',
    powers: ['intelligence-v5', 'intelligence-v18', 'intelligence-v19'],
    status: 'registered',
    flag_key: 'INT_WORLDMONITOR',
    route_prefix: '/integrations/monitor',
    env_vars: ['WORLDMONITOR_API_KEY', 'WORLDMONITOR_ENDPOINT'],
    merge_strategy: 'layered',
  },
  {
    id: 'superpowers',
    name: 'Superpowers — Developer Productivity Tools',
    source_repo: 'https://github.com/obra/superpowers',
    category: 'developer-tools',
    layer: 'tooling',
    summary:
      'Developer productivity and tooling extensions by obra. Augments Koschei\'s production pipeline with enhanced code generation, scaffolding, and developer-facing automation capabilities.',
    powers: ['production-v4', 'production-v11', 'delivery-v6'],
    status: 'registered',
    flag_key: 'INT_SUPERPOWERS',
    route_prefix: '/integrations/superpowers',
    env_vars: [],
    merge_strategy: 'layered',
  },
];

/** Look up a single integration by its ID */
export function getIntegration(id: string): ExternalIntegration | undefined {
  return integrationRegistry.find((i) => i.id === id);
}

/** Get all integrations that power a given Koschei capability */
export function getIntegrationsForCapability(capabilityId: string): ExternalIntegration[] {
  return integrationRegistry.filter((i) => i.powers.includes(capabilityId));
}

/** Get all registered (non-deprecated) integrations */
export function getActiveIntegrations(): ExternalIntegration[] {
  return integrationRegistry.filter((i) => i.status !== 'deprecated');
}
