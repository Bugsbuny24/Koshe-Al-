import BoardShell from "@/components/board/BoardShell";

type VocabBoardProps = {
  items: string[];
};

export default function VocabBoard({ items }: VocabBoardProps) {
  return (
    <BoardShell
      title="Kelime Hazinesi"
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
        <div className="rounded-2xl border border-white/8 bg-black/20 p-5 text-center">
          <p className="text-sm text-slate-500">Yeni kelimeler burada görünecek</p>
          <p className="mt-1 text-xs text-slate-600">Konuşmanda öne çıkan kelimeler otomatik kaydedilir</p>
        </div>
      )}
    </BoardShell>
  );
}
