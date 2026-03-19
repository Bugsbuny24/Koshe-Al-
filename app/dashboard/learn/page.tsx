import Link from 'next/link';

const COURSES = [
  { id: 'nextjs', title: 'Next.js Fundamentals', level: 'Beginner', lang: 'TypeScript', progress: 0 },
  { id: 'react', title: 'React Deep Dive', level: 'Intermediate', lang: 'JavaScript', progress: 0 },
  { id: 'python', title: 'Python for AI', level: 'Beginner', lang: 'Python', progress: 0 },
  { id: 'blockchain', title: 'Blockchain & Pi Network', level: 'Intermediate', lang: 'Solidity', progress: 0 },
  { id: 'ai', title: 'AI Engineering', level: 'Advanced', lang: 'Python', progress: 0 },
];

export default function LearnPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Öğren</h1>
        <p className="text-[#8A8680]">Yazılım teknolojilerini öğren, Pi kazan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COURSES.map((course) => (
          <Link
            key={course.id}
            href={`/dashboard/learn/${course.id}`}
            className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-5 hover:bg-[#16161E] hover:border-[rgba(240,165,0,0.35)] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="inline-flex items-center rounded-full bg-[rgba(240,165,0,0.1)] px-2.5 py-0.5 text-xs text-[#F0A500]">
                {course.level}
              </span>
              <span className="text-xs text-[#4A4845]">{course.lang}</span>
            </div>
            <h3 className="font-semibold mb-2">{course.title}</h3>
            <div className="w-full h-1.5 rounded-full bg-[rgba(240,165,0,0.1)]">
              <div
                className="h-full rounded-full bg-[#F0A500]"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-[#4A4845]">{course.progress}% tamamlandı</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
