import type { FeatureFlagKey } from './flags';
import type { CapabilityStatus, LayerOwner } from '@/types/roadmap';

export type Capability = {
  id: string;
  name: string;
  version: string;
  category: string;
  summary: string;
  depends_on: string[];
  status: CapabilityStatus;
  route_prefix: string;
  owner_layer: LayerOwner;
  flag_key: FeatureFlagKey;
};

export const capabilities: Capability[] = [
  {
    id: 'production-v4',
    name: 'Production Engine',
    version: 'v4',
    category: 'Production & Ops Foundation',
    summary:
      'Structured AI deliverable generation from approved proposals. Provides the job queue, output schema, and generation pipeline.',
    depends_on: ['planning-v3'],
    status: 'scaffolded',
    route_prefix: '/production',
    owner_layer: 'production',
    flag_key: 'V4_PRODUCTION_ENGINE',
  },
  {
    id: 'intelligence-v5',
    name: 'Operational Intelligence',
    version: 'v5',
    category: 'Production & Ops Foundation',
    summary:
      'Real-time operational dashboards: throughput, error rates, and stage latency across all active deals.',
    depends_on: ['production-v4'],
    status: 'scaffolded',
    route_prefix: '/ops',
    owner_layer: 'intelligence',
    flag_key: 'V5_OPERATIONAL_INTELLIGENCE',
  },
  {
    id: 'delivery-v6',
    name: 'Deploy Connectors',
    version: 'v6',
    category: 'Production & Ops Foundation',
    summary:
      'One-click deployment of deliverables to Notion, Google Drive, email, and webhooks.',
    depends_on: ['production-v4', 'intelligence-v5'],
    status: 'scaffolded',
    route_prefix: '/deploy/connectors',
    owner_layer: 'delivery',
    flag_key: 'V6_DEPLOY_CONNECTORS',
  },
  {
    id: 'production-v7',
    name: 'Autonomous Production',
    version: 'v7',
    category: 'Autonomy & Learning',
    summary:
      'Scheduled and event-driven autonomous job execution with circuit breakers and cost controls.',
    depends_on: ['production-v4', 'delivery-v6'],
    status: 'scaffolded',
    route_prefix: '/autonomy',
    owner_layer: 'production',
    flag_key: 'V7_AUTONOMOUS_PRODUCTION',
  },
  {
    id: 'intake-v8',
    name: 'Team / Company OS',
    version: 'v8',
    category: 'Autonomy & Learning',
    summary:
      'Multi-user team workspace with roles, shared deal views, team inboxes, and permission layers.',
    depends_on: ['production-v7'],
    status: 'scaffolded',
    route_prefix: '/team',
    owner_layer: 'intake',
    flag_key: 'V8_TEAM_WORKSPACE',
  },
  {
    id: 'intelligence-v9',
    name: 'Learning Engine',
    version: 'v9',
    category: 'Autonomy & Learning',
    summary:
      'Feedback loops and outcome-learning that improves Koschei over time based on deal results.',
    depends_on: ['intake-v8'],
    status: 'scaffolded',
    route_prefix: '/intelligence',
    owner_layer: 'intelligence',
    flag_key: 'V9_LEARNING_ENGINE',
  },
  {
    id: 'delivery-v10',
    name: 'Revenue Operator',
    version: 'v10',
    category: 'Business Domination Layers',
    summary:
      'Automated revenue cycle: pricing models, upsell triggers, invoice generation, and payment tracking.',
    depends_on: ['delivery-v6', 'intelligence-v9'],
    status: 'scaffolded',
    route_prefix: '/revenue',
    owner_layer: 'delivery',
    flag_key: 'V10_REVENUE_OPERATOR',
  },
  {
    id: 'production-v11',
    name: 'Operations Operator',
    version: 'v11',
    category: 'Business Domination Layers',
    summary:
      'Internal operations automation: SOP library, automated QA checklists, and task assignment engine.',
    depends_on: ['production-v7', 'intake-v8'],
    status: 'scaffolded',
    route_prefix: '/operations',
    owner_layer: 'production',
    flag_key: 'V11_OPERATIONS_OPERATOR',
  },
  {
    id: 'intelligence-v12',
    name: 'Executive Operator',
    version: 'v12',
    category: 'Business Domination Layers',
    summary:
      'Executive command layer with KPI summaries, strategic recommendations, and board-level reporting.',
    depends_on: ['delivery-v10', 'production-v11'],
    status: 'scaffolded',
    route_prefix: '/executive',
    owner_layer: 'intelligence',
    flag_key: 'V12_EXECUTIVE_OPERATOR',
  },
  {
    id: 'planning-v13',
    name: 'Industry Packs',
    version: 'v13',
    category: 'Industry Packs',
    summary:
      'Pre-configured capability bundles for safe industries: tourism, ecommerce, agencies, services, and more.',
    depends_on: ['intelligence-v12'],
    status: 'scaffolded',
    route_prefix: '/industry',
    owner_layer: 'planning',
    flag_key: 'V13_INDUSTRY_PACKS',
  },
  {
    id: 'intelligence-v14',
    name: 'Sector Knowledge',
    version: 'v14',
    category: 'Industry Packs',
    summary:
      'Deep sector-specific knowledge bases, terminology dictionaries, and context injectors.',
    depends_on: ['planning-v13'],
    status: 'scaffolded',
    route_prefix: '/industry',
    owner_layer: 'intelligence',
    flag_key: 'V14_SECTOR_KNOWLEDGE',
  },
  {
    id: 'production-v15',
    name: 'Sector Workflows',
    version: 'v15',
    category: 'Industry Packs',
    summary:
      'End-to-end automated workflows tailored per sector: deal pipelines, automation sequences, delivery flows.',
    depends_on: ['planning-v13', 'intelligence-v14', 'production-v7'],
    status: 'scaffolded',
    route_prefix: '/industry',
    owner_layer: 'production',
    flag_key: 'V15_SECTOR_WORKFLOWS',
  },
  {
    id: 'production-v16',
    name: 'Autonomous Units',
    version: 'v16',
    category: 'Autonomous Business Units',
    summary:
      'Self-contained AI business units operating independently with isolated resources and execution.',
    depends_on: ['production-v7', 'production-v15'],
    status: 'scaffolded',
    route_prefix: '/units',
    owner_layer: 'production',
    flag_key: 'V16_AUTONOMOUS_UNITS',
  },
  {
    id: 'delivery-v17',
    name: 'Multi-Unit Routing',
    version: 'v17',
    category: 'Autonomous Business Units',
    summary:
      'Intelligent routing of work and clients across autonomous units using load balancing and specialization.',
    depends_on: ['production-v16'],
    status: 'scaffolded',
    route_prefix: '/units/routing',
    owner_layer: 'delivery',
    flag_key: 'V17_MULTI_UNIT_ROUTING',
  },
  {
    id: 'intelligence-v18',
    name: 'Unit Analytics',
    version: 'v18',
    category: 'Autonomous Business Units',
    summary:
      'Per-unit performance analytics, comparative benchmarking, and resource utilization dashboards.',
    depends_on: ['production-v16', 'delivery-v17'],
    status: 'scaffolded',
    route_prefix: '/units/analytics',
    owner_layer: 'intelligence',
    flag_key: 'V18_UNIT_ANALYTICS',
  },
  {
    id: 'intelligence-v19',
    name: 'Cross-Company Intelligence',
    version: 'v19',
    category: 'Cross-Company Intelligence',
    summary:
      'Anonymized signal aggregation across Koschei deployments for industry trend detection. Opt-in only.',
    depends_on: ['intelligence-v9', 'intelligence-v18'],
    status: 'scaffolded',
    route_prefix: '/network-intelligence',
    owner_layer: 'intelligence',
    flag_key: 'V19_CROSS_COMPANY_INTELLIGENCE',
  },
  {
    id: 'intelligence-v20',
    name: 'Benchmark Engine',
    version: 'v20',
    category: 'Cross-Company Intelligence',
    summary:
      'Percentile rankings, performance gap analysis, and improvement recommendations vs. industry peers.',
    depends_on: ['intelligence-v19'],
    status: 'scaffolded',
    route_prefix: '/network-intelligence/benchmarks',
    owner_layer: 'intelligence',
    flag_key: 'V20_BENCHMARK_ENGINE',
  },
];

export const SAFE_SECTORS: readonly string[] = [
  'tourism',
  'ecommerce',
  'agencies',
  'services',
  'real-estate-marketing',
  'education-content',
  'small-business-ops',
] as const;

export const PROHIBITED_SECTORS: readonly string[] = [
  'legal',
  'healthcare',
  'investment-advice',
  'credit-insurance-decisions',
  'medical',
  'active-cybersecurity-intervention',
] as const;
