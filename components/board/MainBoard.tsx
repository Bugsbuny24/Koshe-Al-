import BoardShell from "@/components/board/BoardShell";

type MainBoardProps = {
  title?: string;
  content: string;
};

export default function MainBoard({
  title = "Görev",
  content,
}: MainBoardProps) {
  return (
    <BoardShell
      title={title}
      subtitle="Koshei AI'nin senden istediği ana konuşma görevi"
    >
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="text-base leading-8 text-slate-100">
          {content || "Henüz görev bulunmuyor."}
        </p>
      </div>
    </BoardShell>
  );
}
