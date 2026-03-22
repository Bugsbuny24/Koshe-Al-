/**
 * Standardized query-parameter contract shared across V1/V2/V3 flows.
 *
 * Instead of ad-hoc URLSearchParams scattered across pages, all cross-flow
 * navigation goes through these helpers so the key names stay consistent.
 */

export type FlowSource = 'chat' | 'execution' | 'workspace' | 'revision' | 'template' | 'direct';

export interface FlowQueryState {
  /** The ID of the execution run that originated this flow, if any. */
  executionRunId?: string;
  /** Project or deal title pre-fill. */
  title?: string;
  /** Brief / description text pre-fill. */
  description?: string;
  /** Initial scope seed text forwarded from chat or execution. */
  scopeSeed?: string;
  /** Acceptance criteria list (JSON-encoded array). */
  acceptanceCriteria?: string;
  /** Checklist seed text (JSON-encoded). */
  checklistSeed?: string;
  /** Milestone mode, e.g. "fixed" | "milestone" | "subscription". */
  milestoneMode?: string;
  /** Recommended flow determined by intake chat. */
  recommendedFlow?: string;
  /** Tech stack / service type shortcode. */
  tech_stack?: string;
  /** Originating surface so the destination can show a source badge. */
  source?: FlowSource;
}

/** Serialise a FlowQueryState into a URLSearchParams string. */
export function encodeFlowQuery(state: FlowQueryState): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  }
  return params;
}

/** Parse a URLSearchParams (or search string) back into a FlowQueryState. */
export function decodeFlowQuery(search: URLSearchParams | string): FlowQueryState {
  const params =
    typeof search === 'string' ? new URLSearchParams(search) : search;

  return {
    executionRunId: params.get('executionRunId') ?? undefined,
    title: params.get('title') ?? undefined,
    description: params.get('description') ?? undefined,
    scopeSeed: params.get('scopeSeed') ?? undefined,
    acceptanceCriteria: params.get('acceptanceCriteria') ?? undefined,
    checklistSeed: params.get('checklistSeed') ?? undefined,
    milestoneMode: params.get('milestoneMode') ?? undefined,
    recommendedFlow: params.get('recommendedFlow') ?? undefined,
    tech_stack: params.get('tech_stack') ?? undefined,
    source: (params.get('source') as FlowSource | null) ?? undefined,
  };
}
