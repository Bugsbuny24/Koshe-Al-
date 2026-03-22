import type { ProductionStatus } from '@/types/production';

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  idle: 'Idle',
  queued: 'Queued',
  running: 'Running',
  paused: 'Paused',
  completed: 'Completed',
  failed: 'Failed',
};

export const PRODUCTION_STATUS_COLORS: Record<ProductionStatus, string> = {
  idle: 'text-slate-400',
  queued: 'text-pi-gold',
  running: 'text-accent-blue',
  paused: 'text-slate-500',
  completed: 'text-accent-green',
  failed: 'text-red-400',
};

export type ProductionStatusConfig = {
  label: string;
  color: string;
  bgColor: string;
};

export function getProductionStatusConfig(status: ProductionStatus): ProductionStatusConfig {
  const colorMap: Record<ProductionStatus, string> = {
    idle: 'bg-slate-500/10',
    queued: 'bg-yellow-500/10',
    running: 'bg-blue-500/10',
    paused: 'bg-slate-500/10',
    completed: 'bg-green-500/10',
    failed: 'bg-red-500/10',
  };

  return {
    label: PRODUCTION_STATUS_LABELS[status],
    color: PRODUCTION_STATUS_COLORS[status],
    bgColor: colorMap[status],
  };
}
