import { AIMentor } from '@/components/learn/AIMentor';
import Link from 'next/link';

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href={`/dashboard/learn/${courseId}`} className="text-sm text-[#8A8680] hover:text-[#F0A500]">
          ← Kursa Dön
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Ders {lessonId}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lesson content */}
        <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
          <h2 className="text-lg font-semibold mb-4">Ders İçeriği</h2>
          <div className="prose prose-invert max-w-none text-[#8A8680]">
            <p>Bu derste ilgili konuyu öğreneceksiniz. AI mentor&apos;unuz size yardım etmeye hazır!</p>
          </div>
        </div>

        {/* AI Mentor */}
        <AIMentor courseId={courseId} lessonId={lessonId} />
      </div>
    </div>
  );
}
