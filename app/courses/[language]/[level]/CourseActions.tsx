"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Department } from "@/types/university";
import { getCourseId } from "@/lib/data/curriculum";

interface EnrollButtonProps {
  dept: Department;
  courseLevel: Department["levels"][number];
  isEnrolled: boolean;
  progress: number;
}

export function EnrollButton({ dept, courseLevel, isEnrolled, progress }: EnrollButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isEnrolled);
  const [currentProgress, setCurrentProgress] = useState(progress);

  async function handleEnroll() {
    setLoading(true);
    try {
      const courseId = getCourseId(dept.code, courseLevel.level);
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          languageCode: dept.code,
          level: courseLevel.level,
          totalUnits: courseLevel.units.length,
        }),
      });

      if (res.ok) {
        setEnrolled(true);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  if (enrolled) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>İlerleme</span>
          <span className="font-semibold text-cyan-300">{currentProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        <button
          onClick={() => router.push("/live")}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90"
        >
          Devam Et →
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.35)] transition hover:opacity-90 disabled:opacity-50"
    >
      {loading ? "Kaydediliyor…" : "Kursa Başla"}
    </button>
  );
}

interface RewardCardProps {
  imageUrl: string;
  label: string;
  sublabel: string;
}

export function RewardCard({ imageUrl, label, sublabel }: RewardCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10">
        <Image src={imageUrl} alt={label} fill className="object-cover" />
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-white">{label}</div>
        <div className="mt-0.5 text-xs text-slate-500">{sublabel}</div>
      </div>
    </div>
  );
}
