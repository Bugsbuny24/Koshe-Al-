'use client';
import { useUserStore } from '@/store/userStore';

export function WalletCard() {
  const wallet = useUserStore((s) => s.wallet);

  return (
    <div className="rounded-2xl border border-[rgba(240,165,0,0.35)] bg-gradient-to-br from-[#111116] to-[#16161E] p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl">🟣</span>
        <h2 className="text-lg font-semibold">Pi Cüzdan</h2>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-[#F0A500]">
          {wallet?.balance ?? 0} <span className="text-2xl">Pi</span>
        </div>
        <div className="text-sm text-[#4A4845]">Mevcut bakiye</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-[rgba(240,165,0,0.05)] p-3">
          <div className="text-sm font-medium text-[#00D16C]">+ {wallet?.total_earned ?? 0} Pi</div>
          <div className="text-xs text-[#4A4845]">Toplam kazanılan</div>
        </div>
        <div className="rounded-xl bg-[rgba(240,165,0,0.05)] p-3">
          <div className="text-sm font-medium text-[#FF6B2B]">- {wallet?.total_spent ?? 0} Pi</div>
          <div className="text-xs text-[#4A4845]">Toplam harcanan</div>
        </div>
      </div>
    </div>
  );
}
