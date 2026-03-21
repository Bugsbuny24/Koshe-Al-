import { Suspense } from 'react';
import { NewDealForm } from '@/components/deals/NewDealForm';

export default function NewDealPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-white mb-8 text-center">Yeni Deal Oluştur</h1>
      <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>}>
        <NewDealForm />
      </Suspense>
    </div>
  );
}
