'use client';

import { cn } from '@/lib/utils';

interface UserBubbleProps {
  content: string;
  className?: string;
}

export function UserBubble({ content, className }: UserBubbleProps) {
  return (
    <div className={cn('flex justify-end', className)}>
      <div className="max-w-[80%] bg-accent-blue/20 border border-accent-blue/25 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-slate-200 leading-relaxed">
        {content}
      </div>
    </div>
  );
}

interface AssistantBubbleProps {
  content: string;
  className?: string;
}

export function AssistantBubble({ content, className }: AssistantBubbleProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-sm font-bold text-accent-blue">
        K
      </div>
      <div className="max-w-[80%] bg-bg-card border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-200 leading-relaxed">
        {content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-sm font-bold text-accent-blue">
        K
      </div>
      <div className="bg-bg-card border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
