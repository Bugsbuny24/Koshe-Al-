import { WalletCard } from '@/components/earn/WalletCard';
import { FreelanceBoard } from '@/components/earn/FreelanceBoard';

export default function EarnPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kazan</h1>
        <p className="text-[#8A8680]">Pi kazan, freelance iş al, kurs sat</p>
      </div>

      <WalletCard />
      <FreelanceBoard />
    </div>
  );
}
