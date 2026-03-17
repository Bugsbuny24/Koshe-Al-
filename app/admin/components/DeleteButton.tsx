"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
}

export default function DeleteButton({
  action,
  label = "Sil",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await action();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-400/10 transition-colors disabled:opacity-50"
    >
      {isPending ? "Siliniyor…" : label}
    </button>
  );
}
