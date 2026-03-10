import BoardShell from "@/components/board/BoardShell";

type CorrectionBoardProps = {
  userAnswer: string;
  correction: string;
};

export default function CorrectionBoard({
  userAnswer,
  correction,
}: CorrectionBoardProps) {
  return (
    <BoardShell title="Correction Board">
      <div className="space-y-5">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Your sentence
          </p>
          <p className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-slate-200">
            {userAnswer || "Your answer will appear here."}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/80">
            Correct version
          </p>
          <p className="mt-2 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-3 text-sm leading-6 text-cyan-50">
            {correction || "Koshei's correction will appear here."}
          </p>
        </div>
      </div>
    </BoardShell>
  );
}
