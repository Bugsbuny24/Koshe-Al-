import type { InternalToolCategory, InternalTool } from '@/types/operations';

export const INTERNAL_TOOL_CATEGORY_LABELS: Record<InternalToolCategory, string> = {
  automation: 'Automation',
  reporting: 'Reporting',
  integration: 'Integration',
  workflow: 'Workflow',
  communication: 'Communication',
};

type ToolStatusConfigEntry = {
  label: string;
  color: string;
  description: string;
};

export const TOOL_STATUS_CONFIG: Record<InternalTool['status'], ToolStatusConfigEntry> = {
  planned: {
    label: 'Planned',
    color: 'yellow',
    description: 'Scoped and queued for development.',
  },
  building: {
    label: 'Building',
    color: 'blue',
    description: 'Actively under development.',
  },
  active: {
    label: 'Active',
    color: 'green',
    description: 'Live and in use.',
  },
  deprecated: {
    label: 'Deprecated',
    color: 'red',
    description: 'No longer maintained — use an alternative.',
  },
};

export function getToolStatusConfig(status: InternalTool['status']): ToolStatusConfigEntry {
  return TOOL_STATUS_CONFIG[status];
}
