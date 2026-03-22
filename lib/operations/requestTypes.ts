import type { RequestFlowType } from '@/types/operations';

export const REQUEST_FLOW_TYPE_LABELS: Record<RequestFlowType, string> = {
  approval: 'Approval',
  fulfillment: 'Fulfillment',
  escalation: 'Escalation',
  information: 'Information Request',
  change_request: 'Change Request',
};

export const REQUEST_FLOW_SLA_DEFAULTS: Record<RequestFlowType, number> = {
  approval: 24,
  fulfillment: 48,
  escalation: 4,
  information: 8,
  change_request: 72,
};

type RequestFlowConfigEntry = {
  label: string;
  defaultSlaHours: number;
  description: string;
};

export function getRequestFlowConfig(type: RequestFlowType): RequestFlowConfigEntry {
  return {
    label: REQUEST_FLOW_TYPE_LABELS[type],
    defaultSlaHours: REQUEST_FLOW_SLA_DEFAULTS[type],
    description: REQUEST_FLOW_DESCRIPTIONS[type],
  };
}

const REQUEST_FLOW_DESCRIPTIONS: Record<RequestFlowType, string> = {
  approval: 'A request that requires sign-off from a designated authority.',
  fulfillment: 'A request to deliver a specific output, asset, or service.',
  escalation: 'An urgent issue routed to a senior stakeholder for resolution.',
  information: 'A request for data, documentation, or context.',
  change_request: 'A formal request to modify a process, system, or policy.',
};
