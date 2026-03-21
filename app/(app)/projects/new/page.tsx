import { NewProjectForm } from '@/components/projects/NewProjectForm';

export default function NewProjectPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white">Yeni Proje Oluştur</h1>
        <p className="text-slate-400 mt-1 text-sm">Müşteri brief&apos;ini gir, Koschei gerisini halleder.</p>
      </div>
      <NewProjectForm />
    </div>
  );
}
