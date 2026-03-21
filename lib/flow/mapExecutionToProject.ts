import type {
  RequirementExtractionResult,
  ArchitecturePlanResult,
  TaskBreakdownResult,
  DeliveryChecklistResult,
} from '@/types/execution';

export type ExecutionToProjectPayload = {
  title: string;
  description: string;
  prompt: string;
  tech_stack: string;
};

type ExecutionData = {
  brief: string;
  requirement?: RequirementExtractionResult | null;
  architecture?: ArchitecturePlanResult | null;
  tasks?: TaskBreakdownResult | null;
  checklist?: DeliveryChecklistResult | null;
  templateId?: string | null;
};

/**
 * Maps an execution run's results to a project create payload.
 * Used when the user clicks "Project İçin Kullan" in execution/new.
 */
export function mapExecutionToProject(data: ExecutionData): ExecutionToProjectPayload {
  const { brief, requirement, architecture, templateId } = data;

  const title = requirement?.project_type
    ? `${requirement.project_type} — ${new Date().toLocaleDateString('tr-TR')}`
    : brief.slice(0, 60).trim();

  const description = requirement?.business_goal ?? brief.slice(0, 200).trim();

  const stackParts: string[] = [];
  if (architecture?.recommended_stack?.length) {
    stackParts.push(...architecture.recommended_stack);
  } else if (requirement?.suggested_stack?.length) {
    stackParts.push(...requirement.suggested_stack);
  }

  // Map to known tech_stack option values used in NewProjectForm
  let tech_stack = '';
  if (templateId === 'hotel-landing') tech_stack = 'landing-page';
  else if (templateId === 'hotel-whatsapp') tech_stack = 'whatsapp-script';
  else if (templateId === 'hotel-offer') tech_stack = 'offer-pack';
  else if (stackParts.length) {
    const joined = stackParts.join(' ').toLowerCase();
    if (joined.includes('landing')) tech_stack = 'landing-page';
    else if (joined.includes('whatsapp')) tech_stack = 'whatsapp-script';
    else if (joined.includes('email')) tech_stack = 'email-campaign';
    else if (joined.includes('social')) tech_stack = 'social-media';
    else tech_stack = stackParts[0] ?? '';
  }

  return {
    title,
    description,
    prompt: brief,
    tech_stack,
  };
}
