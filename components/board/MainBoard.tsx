import BoardShell from "@/components/board/BoardShell";

type MainBoardProps = {
  topic: string;
  level: string;
  question: string;
  helper?: string;
  onListen?: () => void;
};

export default function MainBoard({
  topic,
  level,
  question,
  helper,
  onListen,
}: MainBoardProps) {
  return (
    <BoardShell title="Main Board" className="min-h-[220px]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-100">
          Topic: {topic}
        </span>
        <span className="rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-100">
          Level: {level}
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Speaking Task
        </p>
        <h1 className="mt-3 max-w-3xl text-2xl font-semibold leading-tight text-white md:text-4xl">
          {question}
        </h1>

        {helper ? (
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
            {helper}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onListen}
          className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
        >
          🔊 Listen Again
        </button>
      </div>
    </BoardShell>
  );
}
