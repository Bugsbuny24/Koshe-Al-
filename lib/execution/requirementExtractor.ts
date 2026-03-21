import { generateJson } from '@/lib/ai/gemini';
import { buildRequirementExtractorPrompt } from './prompts';
import type { RequirementExtractionResult } from '@/types/execution';

const FALLBACK: RequirementExtractionResult = {
  project_type: 'web application',
  business_goal: 'Brief analiz edilemedi, lütfen daha fazla detay ekleyin.',
  target_user: 'Belirtilmedi',
  core_features: [],
  optional_features: [],
  technical_requirements: [],
  integrations: [],
  constraints: [],
  risks: [],
  unknowns: ['Brief analiz edilemedi'],
  recommended_template: null,
  estimated_complexity: 'medium',
  suggested_stack: [],
};

function isValidResult(data: unknown): data is RequirementExtractionResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.project_type === 'string' &&
    typeof d.business_goal === 'string' &&
    Array.isArray(d.core_features)
  );
}

export async function extractRequirements(
  brief: string,
  templateId?: string | null
): Promise<RequirementExtractionResult> {
  const prompt = buildRequirementExtractorPrompt(brief, templateId);
  try {
    const result = await generateJson<RequirementExtractionResult>(prompt);
    if (!isValidResult(result)) return FALLBACK;
    return result;
  } catch {
    return FALLBACK;
  }
}
