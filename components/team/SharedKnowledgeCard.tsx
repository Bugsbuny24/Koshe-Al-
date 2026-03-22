import type { SharedKnowledgeEntry } from '@/types/team';

interface SharedKnowledgeCardProps {
  entry: SharedKnowledgeEntry;
}

export default function SharedKnowledgeCard({ entry }: SharedKnowledgeCardProps) {
  return (
    <div className="rounded-xl border border-white/5 bg-bg-card px-4 py-3">
      <p className="text-sm font-medium text-white">{entry.title}</p>
      <p className="mt-1 text-xs text-slate-400">{entry.content_summary}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {entry.tags.map((tag) => (
          <span key={tag} className="rounded bg-bg-deep px-1.5 py-0.5 text-xs text-slate-500">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
