import { clsx } from "clsx";

interface WordCardProps {
  word: string;
  translation: string;
  phonetic?: string;
  example?: string;
  className?: string;
}

export function WordCard({ word, translation, phonetic, example, className }: WordCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-white/10 bg-white/5 p-4 space-y-1",
        className
      )}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-base font-semibold">{word}</span>
        {phonetic && (
          <span className="text-xs text-white/40 font-mono">{phonetic}</span>
        )}
      </div>
      <div className="text-sm text-white/70">{translation}</div>
      {example && (
        <div className="border-t border-white/5 pt-1 text-xs italic text-white/50">
          {example}
        </div>
      )}
    </div>
  );
}
