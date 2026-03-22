/**
 * Pipeline runner — executes a Pipeline DAG node by node.
 * Inspired by Dify's workflow execution engine where each node in the
 * flow is run sequentially (or in parallel for independent branches)
 * and its output is fed into the next node's context.
 */

import { randomUUID } from 'crypto';
import { generateJson, generateText } from '@/lib/ai/gemini';
import type {
  Pipeline,
  PipelineRun,
  NodeRunLog,
  LLMNodeConfig,
} from '@/types/pipeline';

// ── Template variable interpolation ──────────────────────────────────────────

/**
 * Replace {{varName}} placeholders in a template string with values from ctx.
 */
function interpolate(template: string, ctx: Record<string, unknown>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (_, key: string) => {
    const trimmed = key.trim();
    const val = ctx[trimmed];
    if (val === undefined || val === null) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  });
}

// ── Node executor ─────────────────────────────────────────────────────────────

async function executeNode(
  nodeId: string,
  config: Pipeline['nodes'][number]['config'],
  ctx: Record<string, unknown>,
): Promise<{ outputKey: string; output: unknown } | null> {
  switch (config.type) {
    case 'llm': {
      const llmConfig = config as LLMNodeConfig & { type: 'llm' };
      const prompt = interpolate(llmConfig.promptTemplate, ctx);
      if (llmConfig.jsonMode) {
        const result = await generateJson(prompt);
        return { outputKey: llmConfig.outputKey, output: result };
      }
      const text = await generateText(prompt);
      return { outputKey: llmConfig.outputKey, output: text };
    }

    case 'transform': {
      // Safe expression: only allow simple property access and string ops
      // In production this would use a sandboxed evaluator (vm2 / isolated-vm)
      const expression = interpolate(config.expression, ctx);
      // Simple passthrough: just store the interpolated string
      return { outputKey: config.outputKey, output: expression };
    }

    case 'output': {
      // Collect specified keys from context
      const collected: Record<string, unknown> = {};
      for (const key of config.collectKeys) {
        if (key in ctx) collected[key] = ctx[key];
      }
      return { outputKey: '__output__', output: collected };
    }

    case 'condition':
    case 'retrieval':
      // Scaffolded — not yet fully implemented
      return null;

    default:
      return null;
  }
}

// ── Pipeline run ──────────────────────────────────────────────────────────────

export async function runPipeline(
  pipeline: Pipeline,
  input: Record<string, unknown>,
): Promise<PipelineRun> {
  const runId = randomUUID();
  const startedAt = new Date().toISOString();

  const run: PipelineRun = {
    id: runId,
    pipelineId: pipeline.id,
    pipelineName: pipeline.name,
    input,
    status: 'running',
    nodeLogs: [],
    output: null,
    startedAt,
  };

  // Execution context — accumulates outputs as nodes complete
  const ctx: Record<string, unknown> = { ...input };

  // Execute nodes in definition order (simple linear execution)
  for (const node of pipeline.nodes) {
    const nodeLog: NodeRunLog = {
      nodeId: node.id,
      nodeLabel: node.label,
      status: 'running',
      startedAt: new Date().toISOString(),
    };
    run.nodeLogs.push(nodeLog);

    try {
      const result = await executeNode(node.id, node.config, ctx);

      if (result) {
        ctx[result.outputKey] = result.output;
        const preview =
          typeof result.output === 'string'
            ? result.output.slice(0, 200)
            : JSON.stringify(result.output).slice(0, 200);
        nodeLog.outputPreview = preview;
      }

      nodeLog.status = 'completed';
    } catch (err) {
      nodeLog.status = 'failed';
      nodeLog.error = err instanceof Error ? err.message : 'Node hatası';
      run.status = 'failed';
      run.error = nodeLog.error;
      break;
    } finally {
      nodeLog.completedAt = new Date().toISOString();
      nodeLog.durationMs =
        Date.now() - new Date(nodeLog.startedAt).getTime();
    }
  }

  if (run.status !== 'failed') {
    run.status = 'completed';
    // The __output__ key is set by the output node; fall back to full ctx
    run.output = (ctx['__output__'] as Record<string, unknown>) ?? ctx;
  }

  run.completedAt = new Date().toISOString();
  run.durationMs = Date.now() - new Date(startedAt).getTime();

  return run;
}
