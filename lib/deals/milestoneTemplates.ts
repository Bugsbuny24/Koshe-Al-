// Milestone template definitions used by both the API and the UI.
// All percentage-based splits are applied to the deal's total_amount at runtime.

export type MilestoneTemplateItem = {
  title: string;
  description: string;
  /** Percentage of total deal amount (0-100) */
  pct: number;
};

export type MilestoneTemplateKey = 'standard' | 'fast' | 'iterative';

export const MILESTONE_TEMPLATES: Record<MilestoneTemplateKey, MilestoneTemplateItem[]> = {
  /** Standard 20 / 40 / 40 split */
  standard: [
    { title: 'Başlangıç Ödemesi', description: 'Projenin başlaması için yapılan ön ödeme (%20)', pct: 20 },
    { title: 'Ara Teslim', description: 'Taslak ve ilerleme teslimatı (%40)', pct: 40 },
    { title: 'Final Teslim', description: 'Projenin tamamlanması ve son onay (%40)', pct: 40 },
  ],
  /** Fast track 50 / 50 split */
  fast: [
    { title: 'Ön Ödeme', description: 'Hızlı başlangıç için %50 ön ödeme', pct: 50 },
    { title: 'Teslim Ödemesi', description: 'Projenin tamamlanmasında %50 kalan ödeme', pct: 50 },
  ],
  /** Iterative sprint 25 × 4 split */
  iterative: [
    { title: 'Sprint 1', description: '1. sprint teslimi (%25)', pct: 25 },
    { title: 'Sprint 2', description: '2. sprint teslimi (%25)', pct: 25 },
    { title: 'Sprint 3', description: '3. sprint teslimi (%25)', pct: 25 },
    { title: 'Sprint 4', description: '4. sprint teslimi – final (%25)', pct: 25 },
  ],
};

export const MILESTONE_TEMPLATE_LABELS: Record<MilestoneTemplateKey, string> = {
  standard: 'Standard (20/40/40)',
  fast: 'Hızlı (50/50)',
  iterative: 'İteratif (25×4)',
};

/**
 * Build a list of milestone inserts from a template key and the deal's total amount.
 * Rounds each milestone amount; the last milestone absorbs any rounding difference
 * to ensure the total always equals `totalAmount`.
 */
export function buildMilestonesFromTemplate(
  templateKey: MilestoneTemplateKey,
  totalAmount: number
): { title: string; description: string; amount: number; sort_order: number }[] {
  const items = MILESTONE_TEMPLATES[templateKey];
  let allocated = 0;

  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    const amount = isLast
      ? totalAmount - allocated
      : Math.floor((totalAmount * item.pct) / 100);
    allocated += amount;
    return {
      title: item.title,
      description: item.description,
      amount,
      sort_order: i + 1,
    };
  });
}

export function isMilestoneTemplateKey(key: string): key is MilestoneTemplateKey {
  return key in MILESTONE_TEMPLATES;
}
