import Link from 'next/link';

export default function ProgramDetailPage({ params }: { params: { programId: string } }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/university" className="text-sm text-[#8A8680] hover:text-[#F0A500]">
          ← Programlara Dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold capitalize">{params.programId} Programı</h1>
      </div>

      <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
        <h2 className="font-semibold mb-4">Program Detayları</h2>
        <p className="text-[#8A8680]">Program içerikleri ve müfredat yakında eklenecek.</p>
      </div>
    </div>
  );
}
