import BoardShell from "@/components/board/BoardShell";

type CorrectionBoardProps = {
  correction: string;
};

export default function CorrectionBoard({
  correction,
}: CorrectionBoardProps) {
  return (
    <BoardShell
      title="Düzeltme"
      subtitle="Koshei AI'nin önerdiği daha doğru ifade"
    >
      {correction ? (
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
          <p className="text-base leading-8 text-slate-100">{correction}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 bg-black/20 p-5 text-center">
          <p className="text-sm text-slate-500">Konuşma başladığında düzeltmeler burada görünür</p>
          <p className="mt-1 text-xs text-slate-600">Koshei her cevabından sonra öneri verir</p>
        </div>
      )}
    </BoardShell>
  );
}
