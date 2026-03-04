import Shell from "@/components/Shell";
import LessonClient from "@/components/lesson/LessonClient";

export default function LessonPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold">Ders</h2>
          <p className="mt-1 text-white/60 text-sm">
            Seviye + hedef dil seç, Koshei günlük mini ders üretir.
          </p>
          <div className="mt-6">
            <LessonClient />
          </div>
        </div>
      </div>
    </Shell>
  );
}
