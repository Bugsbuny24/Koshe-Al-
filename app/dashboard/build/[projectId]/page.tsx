import Link from 'next/link';

export default function ProjectWorkspacePage({ params }: { params: { projectId: string } }) {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div>
        <Link href="/dashboard/build" className="text-sm text-[#8A8680] hover:text-[#F0A500]">
          ← Projelere Dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Proje Workspace</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
        <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4">
          <h2 className="font-semibold mb-3">Kod Editörü</h2>
          <div className="text-[#8A8680] text-sm">Monaco editor yakında entegre edilecek.</div>
        </div>
        <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4">
          <h2 className="font-semibold mb-3">Önizleme</h2>
          <div className="text-[#8A8680] text-sm">Proje önizlemesi burada görünecek.</div>
        </div>
      </div>
    </div>
  );
}
