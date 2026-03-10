import BoardShell from "@/components/board/BoardShell";

type AnswerBoardProps = {
  input: string;
  isListening: boolean;
  isThinking: boolean;
  recognitionSupported: boolean;
  onInputChange: (value: string) => void;
  onSpeak: () => void;
  onStop: () => void;
  onSubmit: () => void;
};

export default function AnswerBoard({
  input,
  isListening,
  isThinking,
  recognitionSupported,
  onInputChange,
  onSpeak,
  onStop,
  onSubmit,
}: AnswerBoardProps) {
  return (
    <BoardShell title="Answer Board">
      <p className="text-lg font-semibold text-white">Your Answer</p>
      <p className="mt-2 text-sm text-slate-300">
        Speak or type your answer. Koshei will correct and continue.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSpeak}
          disabled={!recognitionSupported || isListening || isThinking}
          className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🎤 {isListening ? "Listening..." : "Speak"}
        </button>

        <button
          type="button"
          onClick={onStop}
          disabled={!isListening}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Stop
        </button>
      </div>

      <div className="mt-5">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={5}
          className="w-full rounded-3xl border border-cyan-300/10 bg-slate-950/40 px-4 py-4 text-white outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!input.trim() || isThinking}
          className="w-full rounded-2xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Answer
        </button>
      </div>
    </BoardShell>
  );
}
