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
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
        <p className="text-base leading-8 text-slate-100">
          {correction || "Henüz düzeltme yok."}
        </p>
      </div>
    </BoardShell>
  );
}
