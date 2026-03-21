import { generateJson } from '@/lib/ai/gemini';
import { buildTaskBreakdownPrompt } from './prompts';
import type { RequirementExtractionResult, ArchitecturePlanResult, TaskBreakdownResult } from '@/types/execution';

const FALLBACK: TaskBreakdownResult = {
  phases: [],
  milestone_suggestions: [],
};

function isValidResult(data: unknown): data is TaskBreakdownResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return Array.isArray(d.phases) && Array.isArray(d.milestone_suggestions);
}

export async function breakdownTasks(
  requirement: RequirementExtractionResult,
  architecture: ArchitecturePlanResult
): Promise<TaskBreakdownResult> {
  const prompt = buildTaskBreakdownPrompt(requirement, architecture);
  try {
    const result = await generateJson<TaskBreakdownResult>(prompt);
    if (!isValidResult(result)) return FALLBACK;
    return result;
  } catch {
    return FALLBACK;
  }
}
