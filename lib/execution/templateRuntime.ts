import { getTemplate, listTemplates } from './templates';
import type { TemplateRuntimeResult } from '@/types/execution';

export function resolveTemplate(templateId: string): TemplateRuntimeResult | null {
  return getTemplate(templateId);
}

export function getAllTemplates(): TemplateRuntimeResult[] {
  return listTemplates();
}
