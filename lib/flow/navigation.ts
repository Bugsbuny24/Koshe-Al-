/**
 * Centralised navigation helpers for cross-flow routing.
 *
 * Use these instead of hand-building URLs in individual components so that
 * query-param keys, encoding logic, and routing decisions live in one place.
 */

import { encodeFlowQuery, FlowSource } from './queryState';
import type { IntentType, RecommendedFlow } from '@/types/intake';

// ── Execution → Destination ──────────────────────────────────────────────────

export interface ExecutionNavOptions {
  executionRunId: string;
  title?: string;
  description?: string;
  tech_stack?: string;
  milestoneMode?: string;
  scopeSeed?: string;
  acceptanceCriteria?: string[];
  checklistSeed?: string;
  source?: FlowSource;
}

/** Build the URL for /projects/new pre-filled from an execution run. */
export function buildProjectFromExecutionUrl(opts: ExecutionNavOptions): string {
  const params = encodeFlowQuery({
    executionRunId: opts.executionRunId,
    title: opts.title,
    description: opts.description,
    tech_stack: opts.tech_stack,
    milestoneMode: opts.milestoneMode,
    scopeSeed: opts.scopeSeed,
    acceptanceCriteria: opts.acceptanceCriteria
      ? JSON.stringify(opts.acceptanceCriteria)
      : undefined,
    checklistSeed: opts.checklistSeed,
    source: opts.source ?? 'execution',
  });
  return `/projects/new?${params.toString()}`;
}

/** Build the URL for /deals/new pre-filled from an execution run. */
export function buildDealFromExecutionUrl(opts: ExecutionNavOptions): string {
  const params = encodeFlowQuery({
    executionRunId: opts.executionRunId,
    title: opts.title,
    description: opts.description,
    milestoneMode: opts.milestoneMode,
    scopeSeed: opts.scopeSeed,
    acceptanceCriteria: opts.acceptanceCriteria
      ? JSON.stringify(opts.acceptanceCriteria)
      : undefined,
    source: opts.source ?? 'execution',
  });
  return `/deals/new?${params.toString()}`;
}

// ── Chat → Destination ───────────────────────────────────────────────────────

export interface ChatNavOptions {
  message: string;
  businessGoal?: string;
  autoScopeSeed?: string | null;
  intent?: IntentType;
  template?: string | null;
}

/** Build the URL for /execution/new from a chat intake result. */
export function buildExecutionFromChatUrl(opts: ChatNavOptions): string {
  const params = new URLSearchParams();
  params.set('brief', opts.autoScopeSeed ?? opts.message);
  if (opts.intent) params.set('intakeIntent', opts.intent);
  if (opts.businessGoal) params.set('suggestedTitle', opts.businessGoal.slice(0, 80));
  if (opts.template) params.set('template', opts.template);
  params.set('source', 'chat');
  return `/execution/new?${params.toString()}`;
}

/** Build the URL for /builder from a chat intake result. */
export function buildBuilderFromChatUrl(opts: ChatNavOptions): string {
  const params = new URLSearchParams({ prompt: opts.message, source: 'chat' });
  return `/builder?${params.toString()}`;
}

/** Build the URL for /mentor from a chat intake result. */
export function buildMentorFromChatUrl(opts: ChatNavOptions): string {
  const params = new URLSearchParams({ topic: opts.message, source: 'chat' });
  return `/mentor?${params.toString()}`;
}

/** Universal dispatcher — picks the right destination based on flow type. */
export function buildCtaUrlFromFlow(
  flow: RecommendedFlow,
  opts: ChatNavOptions,
): string {
  if (flow === 'builder') return buildBuilderFromChatUrl(opts);
  if (flow === 'mentor') return buildMentorFromChatUrl(opts);
  return buildExecutionFromChatUrl(opts);
}
