import type { SafeSector, IndustryPack } from '@/types/industry';

export const SAFE_SECTORS: SafeSector[] = [
  'tourism',
  'ecommerce',
  'agencies',
  'services',
  'real_estate_marketing',
  'education_content',
  'small_business_ops',
];

export const SECTOR_LABELS: Record<SafeSector, string> = {
  tourism: 'Tourism',
  ecommerce: 'E-commerce',
  agencies: 'Agencies',
  services: 'Services',
  real_estate_marketing: 'Real Estate Marketing',
  education_content: 'Education Content',
  small_business_ops: 'Small Business Ops',
};

export const INDUSTRY_PACKS: IndustryPack[] = [
  {
    id: 'pack-tourism',
    sector: 'tourism',
    name: 'Tourism Pack',
    description: 'Workflow templates and knowledge blocks for travel and tourism operators.',
    use_cases: ['uc-tourism-1', 'uc-tourism-2', 'uc-tourism-3'],
    workflow_templates: ['wf-tourism-intake', 'wf-tourism-delivery'],
    knowledge_blocks: ['kb-tourism-checklist', 'kb-tourism-glossary'],
    status: 'scaffolded',
    version_introduced: 'V13',
  },
  {
    id: 'pack-ecommerce',
    sector: 'ecommerce',
    name: 'E-commerce Pack',
    description: 'Pre-configured workflows for product listings, promotions, and order management.',
    use_cases: ['uc-ecommerce-1', 'uc-ecommerce-2', 'uc-ecommerce-3'],
    workflow_templates: ['wf-ecommerce-intake', 'wf-ecommerce-production'],
    knowledge_blocks: ['kb-ecommerce-template', 'kb-ecommerce-prompt'],
    status: 'scaffolded',
    version_introduced: 'V13',
  },
  {
    id: 'pack-agencies',
    sector: 'agencies',
    name: 'Agency Pack',
    description: 'Client intake, project scoping, and delivery workflows for creative agencies.',
    use_cases: ['uc-agencies-1', 'uc-agencies-2', 'uc-agencies-3'],
    workflow_templates: ['wf-agencies-intake', 'wf-agencies-reporting'],
    knowledge_blocks: ['kb-agencies-checklist', 'kb-agencies-workflow_step'],
    status: 'scaffolded',
    version_introduced: 'V13',
  },
  {
    id: 'pack-services',
    sector: 'services',
    name: 'Services Pack',
    description: 'Service scoping, scheduling, and delivery workflows for service businesses.',
    use_cases: ['uc-services-1', 'uc-services-2', 'uc-services-3'],
    workflow_templates: ['wf-services-intake', 'wf-services-delivery'],
    knowledge_blocks: ['kb-services-template', 'kb-services-checklist'],
    status: 'scaffolded',
    version_introduced: 'V14',
  },
  {
    id: 'pack-real_estate_marketing',
    sector: 'real_estate_marketing',
    name: 'Real Estate Marketing Pack',
    description: 'Listing content, outreach campaigns, and lead nurture workflows.',
    use_cases: ['uc-rem-1', 'uc-rem-2', 'uc-rem-3'],
    workflow_templates: ['wf-rem-outreach', 'wf-rem-production'],
    knowledge_blocks: ['kb-rem-prompt', 'kb-rem-template'],
    status: 'scaffolded',
    version_introduced: 'V14',
  },
  {
    id: 'pack-education_content',
    sector: 'education_content',
    name: 'Education Content Pack',
    description: 'Course creation, lesson planning, and learner engagement workflows.',
    use_cases: ['uc-edu-1', 'uc-edu-2', 'uc-edu-3'],
    workflow_templates: ['wf-edu-production', 'wf-edu-delivery'],
    knowledge_blocks: ['kb-edu-checklist', 'kb-edu-glossary'],
    status: 'scaffolded',
    version_introduced: 'V14',
  },
  {
    id: 'pack-small_business_ops',
    sector: 'small_business_ops',
    name: 'Small Business Ops Pack',
    description: 'Operational SOPs, client communications, and reporting workflows for SMBs.',
    use_cases: ['uc-sbo-1', 'uc-sbo-2', 'uc-sbo-3'],
    workflow_templates: ['wf-sbo-intake', 'wf-sbo-reporting'],
    knowledge_blocks: ['kb-sbo-checklist', 'kb-sbo-workflow_step'],
    status: 'scaffolded',
    version_introduced: 'V15',
  },
];

export function getPackBySector(sector: SafeSector): IndustryPack | undefined {
  return INDUSTRY_PACKS.find((pack) => pack.sector === sector);
}
