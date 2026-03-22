import type { AutonomousRunStatus } from '@/types/autonomy';

type RunStatusConfig = {
  label: string;
  color: string;
  description: string;
  terminal: boolean;
};

export const AUTONOMOUS_RUN_STATUS_CONFIG: Record<AutonomousRunStatus, RunStatusConfig> = {
  idle: {
    label: 'Idle',
    color: 'text-slate-400',
    description: 'No run is active.',
    terminal: false,
  },
  waiting_approval: {
    label: 'Waiting Approval',
    color: 'text-yellow-400',
    description: 'Paused at an approval gate, awaiting human or automated sign-off.',
    terminal: false,
  },
  running: {
    label: 'Running',
    color: 'text-accent-blue',
    description: 'Run is actively in progress.',
    terminal: false,
  },
  paused: {
    label: 'Paused',
    color: 'text-orange-400',
    description: 'Run is temporarily paused.',
    terminal: false,
  },
  completed: {
    label: 'Completed',
    color: 'text-accent-green',
    description: 'Run finished successfully.',
    terminal: true,
  },
  failed: {
    label: 'Failed',
    color: 'text-red-400',
    description: 'Run encountered an unrecoverable error.',
    terminal: true,
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-500',
    description: 'Run was rejected at an approval gate.',
    terminal: true,
  },
};

export function getRunStatusConfig(status: AutonomousRunStatus): RunStatusConfig {
  return AUTONOMOUS_RUN_STATUS_CONFIG[status];
}

export function isTerminalStatus(status: AutonomousRunStatus): boolean {
  return AUTONOMOUS_RUN_STATUS_CONFIG[status].terminal;
}
