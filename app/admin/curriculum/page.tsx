import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import type { ProgramRow } from "@/types/academic";

type ProgramWithRelations = ProgramRow & {
  universities: { name: string; code: string } | null;
  faculties: { name: string; code: string } | null;
};

export default async function CurriculumPage() {
  const supabase = await createClient();
  let programs: ProgramWithRelations[] = [];

  try {
    const { data } = await supabase
      .from("programs")
      .select("*, universities(name, code), faculties(name, code)")
      .eq("active", true)
      .order("university_id")
      .order("title");
    programs = (data ?? []) as ProgramWithRelations[];
  } catch {
    // table may not exist yet
  }

  // Group by university
  const byUniversity = programs.reduce<
    Record<string, { uniName: string; uniCode: string; programs: ProgramWithRelations[] }>
  >((acc, prog) => {
    const uniId = prog.university_id;
    if (!acc[uniId]) {
      acc[uniId] = {
        uniName: prog.universities?.name ?? "Bilinmeyen",
        uniCode: prog.universities?.code ?? "",
        programs: [],
      };
    }
    acc[uniId].programs.push(prog);
    return acc;
  }, {});

  const universityGroups = Object.values(byUniversity);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Müfredat"
        description={`${programs.length} aktif program · ${universityGroups.length} üniversite`}
      />

      {universityGroups.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-400">Henüz program eklenmemiş.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {universityGroups.map((group) => (
            <div key={group.uniCode} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                <span className="text-2xl">🎓</span>
                <div>
                  <h2 className="text-white font-semibold">{group.uniName}</h2>
                  <p className="text-xs text-slate-500 font-mono">
                    {group.uniCode} · {group.programs.length} program
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.programs.map((prog) => (
                  <div key={prog.id} className="panel-dark rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="inline-flex items-center rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-400">
                        {prog.degree_type}
                      </span>
                      <span className="text-xs text-slate-500">
                        {prog.duration_years} yıl
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium mt-2 mb-1">
                      {prog.title}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mb-2">
                      {prog.code}
                    </p>
                    {prog.faculties && (
                      <p className="text-xs text-slate-400">
                        {prog.faculties.name}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {prog.has_thesis && (
                        <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                          Tez
                        </span>
                      )}
                      {prog.has_honors_option && (
                        <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                          Onur
                        </span>
                      )}
                      {prog.has_minor_option && (
                        <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                          Minör
                        </span>
                      )}
                      {prog.has_prep_year && (
                        <span className="text-xs text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                          Hazırlık
                        </span>
                      )}
                    </div>
                    {(prog.total_credits || prog.total_courses) && (
                      <div className="flex gap-3 mt-2 text-xs text-slate-500">
                        {prog.total_credits && (
                          <span>{prog.total_credits} kredi</span>
                        )}
                        {prog.total_courses && (
                          <span>{prog.total_courses} ders</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
