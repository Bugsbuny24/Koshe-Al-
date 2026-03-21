import { Suspense } from 'react';
import { NewProjectForm } from '@/components/projects/NewProjectForm';

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Yeni Proje Oluştur</h1>
        <p className="text-slate-400 mt-1 text-sm">Müşteri brief&apos;ini gir, Koschei gerisini halleder.</p>
      </div>
      <Suspense fallback={<div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" /></div>}>
        <NewProjectForm />
      </Suspense>
    </div>
  );
}

