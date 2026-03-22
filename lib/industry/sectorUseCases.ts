import type { SectorUseCase, SafeSector } from '@/types/industry';

export const SECTOR_USE_CASES: SectorUseCase[] = [
  // Tourism
  {
    id: 'uc-tourism-1',
    sector: 'tourism',
    title: 'Custom Itinerary Creation',
    description: 'Build bespoke multi-day travel itineraries tailored to client preferences.',
    workflow_ids: ['wf-tourism-intake', 'wf-tourism-delivery'],
    estimated_time_to_value: '2 hours',
  },
  {
    id: 'uc-tourism-2',
    sector: 'tourism',
    title: 'Group Tour Coordination',
    description: 'Coordinate logistics, accommodation, and activities for group travel packages.',
    workflow_ids: ['wf-tourism-intake'],
    estimated_time_to_value: '4 hours',
  },
  {
    id: 'uc-tourism-3',
    sector: 'tourism',
    title: 'Travel Content Production',
    description: 'Produce destination guides, social media content, and email newsletters.',
    workflow_ids: ['wf-tourism-delivery'],
    estimated_time_to_value: '3 hours',
  },
  // E-commerce
  {
    id: 'uc-ecommerce-1',
    sector: 'ecommerce',
    title: 'Product Launch Campaign',
    description: 'End-to-end product listing creation with copy, images, and promotions.',
    workflow_ids: ['wf-ecommerce-intake', 'wf-ecommerce-production'],
    estimated_time_to_value: '3 hours',
  },
  {
    id: 'uc-ecommerce-2',
    sector: 'ecommerce',
    title: 'Seasonal Promotion Setup',
    description: 'Configure seasonal discounts, promotional copy, and email campaigns.',
    workflow_ids: ['wf-ecommerce-production'],
    estimated_time_to_value: '2 hours',
  },
  {
    id: 'uc-ecommerce-3',
    sector: 'ecommerce',
    title: 'Catalogue Refresh',
    description: 'Bulk update and refresh existing product listings with improved copy and visuals.',
    workflow_ids: ['wf-ecommerce-intake', 'wf-ecommerce-production'],
    estimated_time_to_value: '5 hours',
  },
  // Agencies
  {
    id: 'uc-agencies-1',
    sector: 'agencies',
    title: 'New Client Onboarding',
    description: 'Structured onboarding workflow from brief to kickoff meeting.',
    workflow_ids: ['wf-agencies-intake'],
    estimated_time_to_value: '1 hour',
  },
  {
    id: 'uc-agencies-2',
    sector: 'agencies',
    title: 'Campaign Performance Reporting',
    description: 'Automated monthly report generation with key metrics and recommendations.',
    workflow_ids: ['wf-agencies-reporting'],
    estimated_time_to_value: '2 hours',
  },
  {
    id: 'uc-agencies-3',
    sector: 'agencies',
    title: 'Content Production Pipeline',
    description: 'Manage multi-format content production from brief to delivery.',
    workflow_ids: ['wf-agencies-intake', 'wf-agencies-reporting'],
    estimated_time_to_value: '4 hours',
  },
  // Services
  {
    id: 'uc-services-1',
    sector: 'services',
    title: 'Service Quote and Scope',
    description: 'Capture client requirements and generate a scoped service proposal.',
    workflow_ids: ['wf-services-intake'],
    estimated_time_to_value: '1 hour',
  },
  {
    id: 'uc-services-2',
    sector: 'services',
    title: 'Appointment Scheduling Workflow',
    description: 'Automate appointment booking, reminders, and follow-ups.',
    workflow_ids: ['wf-services-intake', 'wf-services-delivery'],
    estimated_time_to_value: '2 hours',
  },
  {
    id: 'uc-services-3',
    sector: 'services',
    title: 'Post-Service Follow-Up',
    description: 'Send satisfaction surveys and request reviews after service delivery.',
    workflow_ids: ['wf-services-delivery'],
    estimated_time_to_value: '1 hour',
  },
  // Real Estate Marketing
  {
    id: 'uc-rem-1',
    sector: 'real_estate_marketing',
    title: 'Property Listing Campaign',
    description: 'Create and distribute property listing content across channels.',
    workflow_ids: ['wf-rem-outreach', 'wf-rem-production'],
    estimated_time_to_value: '3 hours',
  },
  {
    id: 'uc-rem-2',
    sector: 'real_estate_marketing',
    title: 'Lead Nurture Sequence',
    description: 'Automated email sequence to nurture prospective buyers and renters.',
    workflow_ids: ['wf-rem-outreach'],
    estimated_time_to_value: '2 hours',
  },
  {
    id: 'uc-rem-3',
    sector: 'real_estate_marketing',
    title: 'Open Home Promotion',
    description: 'Promote open home events via social, email, and SMS.',
    workflow_ids: ['wf-rem-outreach', 'wf-rem-production'],
    estimated_time_to_value: '2 hours',
  },
  // Education Content
  {
    id: 'uc-edu-1',
    sector: 'education_content',
    title: 'Online Course Build',
    description: 'Plan, script, and produce a complete online course module by module.',
    workflow_ids: ['wf-edu-production', 'wf-edu-delivery'],
    estimated_time_to_value: '8 hours',
  },
  {
    id: 'uc-edu-2',
    sector: 'education_content',
    title: 'Learner Engagement Campaign',
    description: 'Email and in-app campaigns to re-engage inactive learners.',
    workflow_ids: ['wf-edu-delivery'],
    estimated_time_to_value: '2 hours',
  },
  {
    id: 'uc-edu-3',
    sector: 'education_content',
    title: 'Workshop Material Production',
    description: 'Create slide decks, handouts, and facilitator guides for live workshops.',
    workflow_ids: ['wf-edu-production'],
    estimated_time_to_value: '4 hours',
  },
  // Small Business Ops
  {
    id: 'uc-sbo-1',
    sector: 'small_business_ops',
    title: 'SOP Documentation',
    description: 'Document and standardise core business processes into reusable SOPs.',
    workflow_ids: ['wf-sbo-intake'],
    estimated_time_to_value: '3 hours',
  },
  {
    id: 'uc-sbo-2',
    sector: 'small_business_ops',
    title: 'Weekly Ops Review',
    description: 'Automated weekly ops summary for the business owner.',
    workflow_ids: ['wf-sbo-reporting'],
    estimated_time_to_value: '1 hour',
  },
  {
    id: 'uc-sbo-3',
    sector: 'small_business_ops',
    title: 'Client Communication Templates',
    description: 'Build a library of reusable client communication templates.',
    workflow_ids: ['wf-sbo-intake', 'wf-sbo-reporting'],
    estimated_time_to_value: '2 hours',
  },
];

export function getUseCasesBySector(sector: SafeSector): SectorUseCase[] {
  return SECTOR_USE_CASES.filter((uc) => uc.sector === sector);
}
