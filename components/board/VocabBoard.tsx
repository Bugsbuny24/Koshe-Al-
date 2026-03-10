import BoardShell from "@/components/board/BoardShell";

type VocabBoardProps = {
  items: string[];
};

export default function VocabBoard({ items }: VocabBoardProps) {
  return (
    <BoardShell title="Vocab Board">
      <p className="text-lg font-semibold text-white">Useful Words</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-cyan-300/15 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-50"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-400">
            Vocabulary will appear here.
          </span>
        )}
      </div>
    </BoardShell>
  );
}
