import { generateJson } from '@/lib/ai/gemini';
import { buildDeliveryChecklistPrompt } from './prompts';
import type {
  RequirementExtractionResult,
  ArchitecturePlanResult,
  TaskBreakdownResult,
  DeliveryChecklistResult,
} from '@/types/execution';

const FALLBACK: DeliveryChecklistResult = {
  checklist_title: 'Teslim Checklist\'i',
  items: [],
  handoff_notes: [],
  acceptance_checkpoints: [],
};

function isValidResult(data: unknown): data is DeliveryChecklistResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return typeof d.checklist_title === 'string' && Array.isArray(d.items);
}

export async function generateDeliveryChecklist(
  requirement: RequirementExtractionResult,
  architecture: ArchitecturePlanResult,
  tasks: TaskBreakdownResult,
  scopeText?: string,
  milestoneMode?: string
): Promise<DeliveryChecklistResult> {
  const prompt = buildDeliveryChecklistPrompt(requirement, architecture, tasks, scopeText, milestoneMode);
  try {
    const result = await generateJson<DeliveryChecklistResult>(prompt);
    if (!isValidResult(result)) return FALLBACK;
    return result;
  } catch {
    return FALLBACK;
  }
}
