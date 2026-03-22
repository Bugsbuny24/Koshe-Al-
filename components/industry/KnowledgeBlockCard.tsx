import type { KnowledgeBlock } from '@/types/industry';
import { KNOWLEDGE_BLOCK_TYPE_LABELS } from '@/lib/industry/knowledgeSchemas';

interface KnowledgeBlockCardProps {
  block: KnowledgeBlock;
}

export default function KnowledgeBlockCard({ block }: KnowledgeBlockCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-white">{block.title}</p>
        <span className="shrink-0 rounded-md bg-bg-deep border border-white/5 px-2 py-0.5 text-xs text-slate-400">
          {KNOWLEDGE_BLOCK_TYPE_LABELS[block.type]}
        </span>
      </div>
      <p className="text-xs text-slate-400">{block.description}</p>
      {block.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {block.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-bg-deep px-1.5 py-0.5 text-xs text-slate-500"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
