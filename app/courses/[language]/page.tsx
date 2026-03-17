import Link from "next/link";
import { notFound } from "next/navigation";
import { getDepartment } from "@/lib/data/curriculum";

interface Props {
  params: Promise<{ language: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { language } = await params;
  const dept = getDepartment(language);
  return {
    title: dept ? `${dept.name} Kursları — Koshei AI` : "Kurs Bulunamadı",
    description: dept?.description,
  };
}

const levelColors: Record<string, string> = {
  A1: "from-slate-500/20 to-slate-400/20 border-slate-400/20",
  A2: "from-cyan-500/20 to-blue-500/20 border-cyan-400/20",
  B1: "from-blue-500/20 to-indigo-500/20 border-blue-400/20",
  B2: "from-violet-500/20 to-purple-500/20 border-violet-400/20",
  C1: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-400/20",
  C2: "from-amber-500/20 to-orange-500/20 border-amber-400/30",
};

const levelBadge: Record<string, string> = {
  A1: "text-slate-300",
  A2: "text-cyan-300",
  B1: "text-blue-300",
  B2: "text-violet-300",
  C1: "text-fuchsia-300",
  C2: "text-amber-300",
};

export default async function LanguagePage({ params }: Props) {
  const { language } = await params;
  const dept = getDepartment(language);

  if (!dept) notFound();

  return (
    <main className="min-h-screen px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/courses" className="hover:text-white transition-colors">
            Kurslar
          </Link>
          <span>/</span>
          <span className="text-white">{dept.name}</span>
        </nav>

        {/* Header */}
        <section className="mb-10">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{dept.icon}</span>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">{dept.name}</h1>
              <p className="mt-1 text-slate-400">{dept.nativeName} • {dept.levels.length} seviye</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-slate-300">{dept.description}</p>
        </section>

        {/* Levels grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dept.levels.map((courseLevel, idx) => {
            const colorClass = levelColors[courseLevel.level] ?? "from-white/5 to-white/5 border-white/10";
            const badgeClass = levelBadge[courseLevel.level] ?? "text-slate-300";

            return (
              <Link
                key={courseLevel.level}
                href={`/courses/${language}/${courseLevel.level}`}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] ${colorClass}`}
              >
                {/* Level number badge */}
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-[0.3em] ${badgeClass}`}
                  >
                    {courseLevel.level}
                  </span>
                  <span className="text-xs text-slate-500">
                    {courseLevel.units.length} unit
                  </span>
                </div>

                <h2 className="text-xl font-semibold">{courseLevel.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {courseLevel.description}
                </p>

                {/* Reward indicators */}
                <div className="mt-5 flex gap-2">
                  <span className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-xs text-slate-400">
                    🏅 Rozet
                  </span>
                  {courseLevel.certificateImageUrl && (
                    <span className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-xs text-slate-400">
                      🎓 Sertifika
                    </span>
                  )}
                  <span className="flex items-center gap-1 rounded-lg bg-black/20 px-2 py-1 text-xs text-slate-400">
                    💎 NFT
                  </span>
                </div>

                {/* Progress placeholder */}
                <div className="mt-5 text-xs font-medium text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">
                  Kursa başla →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info card */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-semibold text-white">Bu departman hakkında</h3>
          <p className="mt-3 text-sm text-slate-400">
            {dept.name} departmanı, A1 (başlangıç) seviyesinden C2 (usta) seviyesine kadar
            kapsamlı bir müfredat sunar. Her seviyeyi tamamladığında ücretsiz rozet, sertifika
            ve NFT-ready dijital koleksiyonel ödül kazanırsın.
          </p>
        </div>
      </div>
    </main>
  );
}
