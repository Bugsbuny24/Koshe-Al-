import { generateJson } from '@/lib/ai/gemini';
import { buildArchitecturePlannerPrompt } from './prompts';
import type { RequirementExtractionResult, ArchitecturePlanResult } from '@/types/execution';

const FALLBACK: ArchitecturePlanResult = {
  recommended_stack: [],
  frontend: null,
  backend: null,
  database: null,
  auth: null,
  deployment: null,
  external_services: [],
  pages: [],
  components: [],
  data_entities: [],
  api_endpoints: [],
  architecture_notes: ['Mimari plan oluşturulamadı'],
  delivery_strategy: [],
  scalability_notes: [],
};

function isValidResult(data: unknown): data is ArchitecturePlanResult {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return Array.isArray(d.recommended_stack) && Array.isArray(d.pages);
}

export async function planArchitecture(
  requirement: RequirementExtractionResult
): Promise<ArchitecturePlanResult> {
  const prompt = buildArchitecturePlannerPrompt(requirement);
  try {
    const result = await generateJson<ArchitecturePlanResult>(prompt);
    if (!isValidResult(result)) return FALLBACK;
    return result;
  } catch {
    return FALLBACK;
  }
}
