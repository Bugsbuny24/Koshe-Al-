import Link from 'next/link';

const LESSONS: Record<string, { id: string; title: string; duration: string }[]> = {
  nextjs: [
    { id: '1', title: 'Next.js Nedir?', duration: '10 dk' },
    { id: '2', title: 'App Router', duration: '15 dk' },
    { id: '3', title: 'Server Components', duration: '20 dk' },
    { id: '4', title: 'API Routes', duration: '15 dk' },
  ],
};

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const lessons = LESSONS[courseId] || [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/learn" className="text-sm text-[#8A8680] hover:text-[#F0A500]">
          ← Kurslara Dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold capitalize">{courseId} Kursu</h1>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/dashboard/learn/${courseId}/${lesson.id}`}
            className="flex items-center gap-4 rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4 hover:bg-[#16161E] transition-all"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(240,165,0,0.1)] text-[#F0A500] text-sm font-bold flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium">{lesson.title}</div>
              <div className="text-xs text-[#4A4845]">{lesson.duration}</div>
            </div>
          </Link>
        ))}

        {lessons.length === 0 && (
          <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-8 text-center text-[#8A8680]">
            Bu kurs için dersler yakında eklenecek.
          </div>
        )}
      </div>
    </div>
  );
}
