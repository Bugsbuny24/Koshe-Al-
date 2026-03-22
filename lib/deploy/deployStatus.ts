import type { DeployStatus } from '@/types/deploy';

export const DEPLOY_STATUS_LABELS: Record<DeployStatus, string> = {
  idle: 'Idle',
  pending: 'Pending',
  deploying: 'Deploying',
  success: 'Success',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export const DEPLOY_STATUS_COLORS: Record<DeployStatus, string> = {
  idle: 'text-slate-400',
  pending: 'text-pi-gold',
  deploying: 'text-accent-blue',
  success: 'text-accent-green',
  failed: 'text-red-400',
  cancelled: 'text-slate-500',
};

export type DeployStatusConfig = {
  label: string;
  color: string;
  bgColor: string;
};

export function getDeployStatusConfig(status: DeployStatus): DeployStatusConfig {
  const bgColorMap: Record<DeployStatus, string> = {
    idle: 'bg-slate-500/10',
    pending: 'bg-yellow-500/10',
    deploying: 'bg-blue-500/10',
    success: 'bg-green-500/10',
    failed: 'bg-red-500/10',
    cancelled: 'bg-slate-500/10',
  };

  return {
    label: DEPLOY_STATUS_LABELS[status],
    color: DEPLOY_STATUS_COLORS[status],
    bgColor: bgColorMap[status],
  };
}
