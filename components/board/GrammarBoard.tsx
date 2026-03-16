import BoardShell from "@/components/board/BoardShell";

type GrammarBoardProps = {
  notes: string[];
};

export default function GrammarBoard({ notes }: GrammarBoardProps) {
  return (
    <BoardShell
      title="Grammar Notes"
      subtitle="Kısa ve net dilbilgisi açıklamaları"
    >
      {notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note, index) => (
            <div
              key={`${note}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <p className="text-sm leading-7 text-slate-200">{note}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
          Henüz grammar notu yok.
        </div>
      )}
    </BoardShell>
  );
}
