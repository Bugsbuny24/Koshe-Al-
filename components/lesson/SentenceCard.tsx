import { clsx } from "clsx";

interface SentenceCardProps {
  sentence: string;
  translation?: string;
  note?: string;
  className?: string;
}

export function SentenceCard({ sentence, translation, note, className }: SentenceCardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-white/10 bg-white/5 p-4 space-y-1.5",
        className
      )}
    >
      <p className="text-sm font-medium">{sentence}</p>
      {translation && (
        <p className="text-xs text-white/60">{translation}</p>
      )}
      {note && (
        <p className="text-xs italic text-white/40">{note}</p>
      )}
    </div>
  );
}
