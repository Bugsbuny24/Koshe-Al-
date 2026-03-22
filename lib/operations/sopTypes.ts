import type { SOPType } from '@/types/operations';

export const SOP_TYPE_LABELS: Record<SOPType, string> = {
  process: 'Process',
  checklist: 'Checklist',
  runbook: 'Runbook',
  escalation: 'Escalation',
  onboarding: 'Onboarding',
};

export const SOP_TYPE_ICONS: Record<SOPType, string> = {
  process: '⚙️',
  checklist: '✅',
  runbook: '📖',
  escalation: '🚨',
  onboarding: '🚀',
};

type SOPTypeConfigEntry = {
  label: string;
  icon: string;
  description: string;
};

export function getSOPTypeConfig(type: SOPType): SOPTypeConfigEntry {
  return {
    label: SOP_TYPE_LABELS[type],
    icon: SOP_TYPE_ICONS[type],
    description: SOP_TYPE_DESCRIPTIONS[type],
  };
}

const SOP_TYPE_DESCRIPTIONS: Record<SOPType, string> = {
  process: 'Step-by-step definition of a repeatable business process.',
  checklist: 'Pre-flight or quality-assurance checklist for a task or release.',
  runbook: 'Operational guide for handling a recurring or on-call scenario.',
  escalation: 'Protocol for routing issues to the appropriate stakeholder.',
  onboarding: 'Structured guide for bringing new team members or clients up to speed.',
};
