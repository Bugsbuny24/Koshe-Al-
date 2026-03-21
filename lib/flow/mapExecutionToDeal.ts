import type {
  RequirementExtractionResult,
  TaskBreakdownResult,
  DeliveryChecklistResult,
  TemplateRuntimeResult,
} from '@/types/execution';

export type ExecutionToDealPayload = {
  title: string;
  description: string;
  scope_seed: string;
  deliverables: string[];
  acceptance_criteria: string[];
  milestone_mode: 'standard' | 'fast' | 'iterative';
  checklist_seed: string[];
  suggested_total_amount: number | null;
};

type ExecutionData = {
  brief: string;
  requirement?: RequirementExtractionResult | null;
  tasks?: TaskBreakdownResult | null;
  checklist?: DeliveryChecklistResult | null;
  templateRuntime?: TemplateRuntimeResult | null;
};

/**
 * Maps an execution run's results to a deal seed payload.
 * Used when the user clicks "Deal İçin Kullan" in execution/new.
 */
export function mapExecutionToDeal(data: ExecutionData): ExecutionToDealPayload {
  const { brief, requirement, tasks, checklist, templateRuntime } = data;

  const title = requirement?.project_type
    ? `${requirement.project_type} — Deal`
    : brief.slice(0, 60).trim();

  const description = requirement?.business_goal ?? brief.slice(0, 200).trim();

  // Build scope seed from requirement + template
  const scopeParts: string[] = [];
  if (requirement?.business_goal) scopeParts.push(`Hedef: ${requirement.business_goal}`);
  if (requirement?.core_features?.length) {
    scopeParts.push(`Özellikler: ${requirement.core_features.join(', ')}`);
  }
  if (templateRuntime?.scope_seed) scopeParts.push(templateRuntime.scope_seed);
  const scope_seed = scopeParts.join('\n\n') || brief.slice(0, 500);

  // Deliverables from requirements or template
  const deliverables: string[] = [];
  if (templateRuntime?.delivery_checklist_seed?.length) {
    deliverables.push(...templateRuntime.delivery_checklist_seed);
  } else if (requirement?.core_features?.length) {
    deliverables.push(...requirement.core_features.slice(0, 5));
  }

  // Acceptance criteria
  const acceptance_criteria: string[] = [];
  if (templateRuntime?.acceptance_criteria?.length) {
    acceptance_criteria.push(...templateRuntime.acceptance_criteria);
  } else if (checklist?.acceptance_checkpoints?.length) {
    acceptance_criteria.push(...checklist.acceptance_checkpoints);
  }

  // Milestone mode from template or task breakdown
  let milestone_mode: 'standard' | 'fast' | 'iterative' = 'standard';
  if (templateRuntime?.default_milestone_mode) {
    milestone_mode = templateRuntime.default_milestone_mode;
  } else if (tasks?.phases?.length) {
    if (tasks.phases.length === 1) milestone_mode = 'fast';
    else if (tasks.phases.length >= 3) milestone_mode = 'iterative';
  }

  // Checklist seed from checklist result or template
  const checklist_seed: string[] = [];
  if (checklist?.items?.length) {
    checklist_seed.push(
      ...checklist.items
        .filter((i) => i.required)
        .slice(0, 8)
        .map((i) => i.title)
    );
  } else if (templateRuntime?.delivery_checklist_seed?.length) {
    checklist_seed.push(...templateRuntime.delivery_checklist_seed.slice(0, 8));
  }

  return {
    title,
    description,
    scope_seed,
    deliverables,
    acceptance_criteria,
    milestone_mode,
    checklist_seed,
    suggested_total_amount: null,
  };
}
