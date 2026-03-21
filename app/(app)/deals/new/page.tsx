import { NewDealForm } from '@/components/deals/NewDealForm';

export default function NewDealPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">Yeni Deal Oluştur</h1>
      <NewDealForm />
    </div>
  );
}
