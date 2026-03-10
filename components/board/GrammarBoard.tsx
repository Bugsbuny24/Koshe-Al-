import BoardShell from "@/components/board/BoardShell";

type GrammarBoardProps = {
  notes: string[];
};

export default function GrammarBoard({ notes }: GrammarBoardProps) {
  return (
    <BoardShell title="Grammar Note Board">
      <p className="text-lg font-semibold text-white">Quick Notes</p>
      <div className="mt-4 space-y-3">
        {notes.length ? (
          notes.map((note, index) => (
            <div
              key={`${note}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-200"
            >
              {note}
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
            Short grammar notes will appear here.
          </div>
        )}
      </div>
    </BoardShell>
  );
}
