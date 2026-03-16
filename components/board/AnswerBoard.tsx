"use client";

import BoardShell from "@/components/board/BoardShell";

type AnswerBoardProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isLoading?: boolean;
  isRecording?: boolean;
  targetLanguage?: string;
};

export default function AnswerBoard({
  value,
  onChange,
  onSubmit,
  onStartRecording,
  onStopRecording,
  isLoading = false,
  isRecording = false,
  targetLanguage = "English",
}: AnswerBoardProps) {
  return (
    <BoardShell
      title="Cevabın"
      subtitle={`${targetLanguage} dilinde yaz veya mikrofonla konuş`}
    >
      <div className="space-y-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder={`${targetLanguage} dilinde cevabını yaz...`}
          className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-slate-500"
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          {!isRecording ? (
            <button
              type="button"
              onClick={onStartRecording}
              disabled={!onStartRecording}
              className="inline-flex items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              🎤 Konuşmayı Başlat
            </button>
          ) : (
            <button
              type="button"
              onClick={onStopRecording}
              className="inline-flex items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/15"
            >
              ⏹ Kaydı Durdur
            </button>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Analiz ediliyor..." : "Cevabı Gönder"}
          </button>
        </div>
      </div>
    </BoardShell>
  );
}
