import BoardShell from "@/components/board/BoardShell";

type NextActionBoardProps = {
  action: string;
  question: string;
};

export default function NextActionBoard({
  action,
  question,
}: NextActionBoardProps) {
  return (
    <BoardShell
      title="Sonraki Adım"
      subtitle="Koshei AI seni bir sonraki aşamaya hazırlıyor"
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-2 text-sm text-slate-400">Next Action</div>
          <p className="text-sm leading-7 text-slate-100">
            {action || "Henüz önerilen adım yok."}
          </p>
        </div>

        <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/10 p-4">
          <div className="mb-2 text-sm text-fuchsia-300">Next Question</div>
          <p className="text-sm leading-7 text-white">
            {question || "Henüz yeni soru yok."}
          </p>
        </div>
      </div>
    </BoardShell>
  );
}
