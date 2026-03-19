import Link from 'next/link';

const PROGRAMS = [
  { id: 'cs', title: 'Bilgisayar Mühendisliği', faculty: 'Mühendislik', duration: '4 yıl' },
  { id: 'ai', title: 'Yapay Zeka', faculty: 'Teknoloji', duration: '2 yıl' },
  { id: 'blockchain', title: 'Blockchain Teknolojileri', faculty: 'Teknoloji', duration: '2 yıl' },
];

export default function UniversityPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Üniversite</h1>
        <p className="text-[#8A8680]">Akademik programlar ve sertifikalar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROGRAMS.map((program) => (
          <Link
            key={program.id}
            href={`/dashboard/university/${program.id}`}
            className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5 hover:bg-[#16161E] hover:border-[rgba(240,165,0,0.35)] transition-all"
          >
            <div className="text-xs text-[#F0A500] mb-2">{program.faculty}</div>
            <h3 className="font-semibold mb-2">{program.title}</h3>
            <div className="text-sm text-[#4A4845]">{program.duration}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
