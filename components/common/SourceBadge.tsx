import { cn } from '@/lib/utils';
import type { FlowSource } from '@/lib/flow/queryState';

interface SourceBadgeProps {
  source: FlowSource | string | null | undefined;
  className?: string;
}

const SOURCE_CONFIG: Record<
  FlowSource,
  { label: string; icon: string; color: string }
> = {
  chat: {
    label: "Chat'ten yönlendirildi",
    icon: '💬',
    color: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue',
  },
  execution: {
    label: "Execution'dan yüklendi",
    icon: '⚡',
    color: 'bg-accent-green/10 border-accent-green/20 text-accent-green',
  },
  workspace: {
    label: "Workspace'e aktarıldı",
    icon: '🗂️',
    color: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  },
  revision: {
    label: "Revision'dan güncellendi",
    icon: '🔄',
    color: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  },
  template: {
    label: 'Şablondan yüklendi',
    icon: '📋',
    color: 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue',
  },
  direct: {
    label: 'Doğrudan oluşturuldu',
    icon: '✏️',
    color: 'bg-white/5 border-white/10 text-slate-400',
  },
};

export function SourceBadge({ source, className }: SourceBadgeProps) {
  if (!source) return null;
  const config = SOURCE_CONFIG[source as FlowSource] ?? SOURCE_CONFIG.direct;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 border rounded-xl px-4 py-2.5',
        config.color,
        className,
      )}
    >
      <span className="text-base shrink-0">{config.icon}</span>
      <p className="text-sm font-semibold">{config.label}</p>
    </div>
  );
}
