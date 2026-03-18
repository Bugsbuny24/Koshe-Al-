import BoardShell from "@/components/board/BoardShell";

type GrammarBoardProps = {
  notes: string[];
};

export default function GrammarBoard({ notes }: GrammarBoardProps) {
  return (
    <BoardShell
      title="Grammar Notları"
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
        <div className="rounded-2xl border border-white/8 bg-black/20 p-5 text-center">
          <p className="text-sm text-slate-500">Grammar notları burada görünecek</p>
          <p className="mt-1 text-xs text-slate-600">Konuştuktan sonra Koshei gramer analizini paylaşır</p>
        </div>
      )}
    </BoardShell>
  );
}
