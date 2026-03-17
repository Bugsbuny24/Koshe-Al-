import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { deleteProgramAction } from "../actions";
import DeleteButton from "../components/DeleteButton";
import type { ProgramRow } from "@/types/academic";

type ProgramWithRelations = ProgramRow & {
  universities: { name: string; code: string } | null;
  faculties: { name: string } | null;
};

export default async function ProgramsPage() {
  const supabase = await createClient();
  let programs: ProgramWithRelations[] = [];

  try {
    const { data } = await supabase
      .from("programs")
      .select("*, universities(name, code), faculties(name)")
      .order("title");
    programs = (data ?? []) as ProgramWithRelations[];
  } catch {
    // table may not exist yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Admin"
          title="Programlar"
          description={`${programs.length} program kayıtlı`}
        />
        <Link href="/admin/programs/new" className="primary-button shrink-0">
          + Yeni Program
        </Link>
      </div>

      <div className="glass-card p-6">
        {programs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">📚</p>
            <p className="text-slate-400">Henüz program eklenmemiş.</p>
            <Link
              href="/admin/programs/new"
              className="mt-4 inline-block primary-button"
            >
              İlk Programı Ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Program
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Derece
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Üniversite
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Fakülte
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Süre
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Durum
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {programs.map((program) => (
                  <tr
                    key={program.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3">
                      <p className="text-slate-300 font-medium">
                        {program.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {program.code}
                      </p>
                    </td>
                    <td className="py-3 text-slate-400">{program.degree_type}</td>
                    <td className="py-3 text-slate-400 text-xs">
                      {program.universities?.name ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {program.faculties?.name ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400">
                      {program.duration_years} yıl
                    </td>
                    <td className="py-3">
                      {program.active ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-xs text-emerald-400">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-400/10 px-2.5 py-0.5 text-xs text-slate-400">
                          Pasif
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/programs/${program.id}/edit`}
                          className="soft-button text-xs py-1 px-3"
                        >
                          Düzenle
                        </Link>
                        <DeleteButton
                          action={deleteProgramAction.bind(null, program.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
