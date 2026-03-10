import BoardShell from "@/components/board/BoardShell";

type NextActionBoardProps = {
  action: string;
  onNext: () => void;
};

export default function NextActionBoard({
  action,
  onNext,
}: NextActionBoardProps) {
  return (
    <BoardShell title="Next Action Board">
      <p className="text-lg font-semibold text-white">Next Action</p>
      <p className="mt-3 text-sm leading-6 text-slate-200">
        {action || "Koshei will guide your next step here."}
      </p>

      <button
        type="button"
        onClick={onNext}
        className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
      >
        Next Question →
      </button>
    </BoardShell>
  );
}
