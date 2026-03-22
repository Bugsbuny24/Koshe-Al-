import type { SectorWorkflowTemplate, WorkflowTemplateCategory } from '@/types/industry';

export const WORKFLOW_CATEGORY_LABELS: Record<WorkflowTemplateCategory, string> = {
  intake: 'Intake',
  production: 'Production',
  delivery: 'Delivery',
  reporting: 'Reporting',
  outreach: 'Outreach',
};

export const WORKFLOW_TEMPLATES: SectorWorkflowTemplate[] = [
  {
    id: 'wf-generic-intake',
    sector: 'services',
    category: 'intake',
    name: 'Generic Client Intake',
    description: 'Universal intake workflow for capturing client requirements and expectations.',
    steps: [
      {
        id: 'wf-generic-intake-1',
        sequence: 1,
        title: 'Initial Discovery',
        description: 'Gather high-level goals, timelines, and budget.',
        required_inputs: ['client_name', 'project_type', 'budget_range'],
        expected_outputs: ['discovery_summary'],
      },
      {
        id: 'wf-generic-intake-2',
        sequence: 2,
        title: 'Scope Confirmation',
        description: 'Confirm deliverables and agree on success criteria.',
        required_inputs: ['discovery_summary'],
        expected_outputs: ['scope_document'],
      },
    ],
    estimated_duration_hours: 1,
    status: 'scaffolded',
  },
  {
    id: 'wf-generic-production',
    sector: 'agencies',
    category: 'production',
    name: 'Generic Content Production',
    description: 'Draft, review, and finalise any content deliverable.',
    steps: [
      {
        id: 'wf-generic-production-1',
        sequence: 1,
        title: 'First Draft',
        description: 'Produce the initial draft based on the approved brief.',
        required_inputs: ['brief', 'brand_guidelines'],
        expected_outputs: ['first_draft'],
      },
      {
        id: 'wf-generic-production-2',
        sequence: 2,
        title: 'Review Cycle',
        description: 'Collect feedback and apply revisions.',
        required_inputs: ['first_draft', 'client_feedback'],
        expected_outputs: ['revised_draft'],
      },
      {
        id: 'wf-generic-production-3',
        sequence: 3,
        title: 'Final Approval',
        description: 'Obtain sign-off and prepare final files.',
        required_inputs: ['revised_draft'],
        expected_outputs: ['final_deliverable'],
      },
    ],
    estimated_duration_hours: 3,
    status: 'scaffolded',
  },
  {
    id: 'wf-generic-delivery',
    sector: 'ecommerce',
    category: 'delivery',
    name: 'Generic Delivery Handoff',
    description: 'Package and deliver final assets to the client with confirmation.',
    steps: [
      {
        id: 'wf-generic-delivery-1',
        sequence: 1,
        title: 'Package Assets',
        description: 'Organise and compress final deliverables.',
        required_inputs: ['final_deliverable'],
        expected_outputs: ['delivery_package'],
      },
      {
        id: 'wf-generic-delivery-2',
        sequence: 2,
        title: 'Client Handoff',
        description: 'Send delivery package and request acknowledgement.',
        required_inputs: ['delivery_package', 'client_email'],
        expected_outputs: ['delivery_confirmation'],
      },
    ],
    estimated_duration_hours: 1,
    status: 'scaffolded',
  },
  {
    id: 'wf-generic-reporting',
    sector: 'small_business_ops',
    category: 'reporting',
    name: 'Generic Performance Report',
    description: 'Compile key metrics and insights into a stakeholder report.',
    steps: [
      {
        id: 'wf-generic-reporting-1',
        sequence: 1,
        title: 'Data Collection',
        description: 'Pull relevant metrics for the reporting period.',
        required_inputs: ['reporting_period', 'data_sources'],
        expected_outputs: ['raw_data'],
      },
      {
        id: 'wf-generic-reporting-2',
        sequence: 2,
        title: 'Report Generation',
        description: 'Summarise data into narrative and visuals.',
        required_inputs: ['raw_data'],
        expected_outputs: ['performance_report'],
      },
    ],
    estimated_duration_hours: 2,
    status: 'scaffolded',
  },
  {
    id: 'wf-generic-outreach',
    sector: 'real_estate_marketing',
    category: 'outreach',
    name: 'Generic Outreach Campaign',
    description: 'Plan and execute a targeted outreach campaign across channels.',
    steps: [
      {
        id: 'wf-generic-outreach-1',
        sequence: 1,
        title: 'Audience Segmentation',
        description: 'Define target audience segments and messaging for each.',
        required_inputs: ['campaign_goal', 'audience_criteria'],
        expected_outputs: ['audience_segments'],
      },
      {
        id: 'wf-generic-outreach-2',
        sequence: 2,
        title: 'Content Creation',
        description: 'Write copy and design assets for each channel.',
        required_inputs: ['audience_segments', 'brand_guidelines'],
        expected_outputs: ['campaign_assets'],
      },
      {
        id: 'wf-generic-outreach-3',
        sequence: 3,
        title: 'Campaign Launch',
        description: 'Schedule and publish campaign across selected channels.',
        required_inputs: ['campaign_assets', 'launch_date'],
        expected_outputs: ['live_campaign'],
      },
    ],
    estimated_duration_hours: 4,
    status: 'scaffolded',
  },
];

export function getWorkflowTemplatesByCategory(
  category: WorkflowTemplateCategory,
): SectorWorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter((t) => t.category === category);
}
