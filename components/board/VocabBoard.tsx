import BoardShell from "@/components/board/BoardShell";

type VocabBoardProps = {
  items: string[];
};

export default function VocabBoard({ items }: VocabBoardProps) {
  return (
    <BoardShell
      title="Vocabulary"
      subtitle="Bu konuşmada öne çıkan kelimeler"
    >
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-slate-100"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-400">
          Henüz kelime önerisi yok.
        </div>
      )}
    </BoardShell>
  );
}
