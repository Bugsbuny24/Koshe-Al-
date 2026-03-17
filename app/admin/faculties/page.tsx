import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { deleteFacultyAction } from "../actions";
import DeleteButton from "../components/DeleteButton";
import type { FacultyRow } from "@/types/academic";

type FacultyWithUniversity = FacultyRow & {
  universities: { name: string } | null;
};

export default async function FacultiesPage() {
  const supabase = await createClient();
  let faculties: FacultyWithUniversity[] = [];

  try {
    const { data } = await supabase
      .from("faculties")
      .select("*, universities(name)")
      .order("name");
    faculties = (data ?? []) as FacultyWithUniversity[];
  } catch {
    // table may not exist yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Admin"
          title="Fakülteler"
          description={`${faculties.length} fakülte kayıtlı`}
        />
        <Link href="/admin/faculties/new" className="primary-button shrink-0">
          + Yeni Fakülte
        </Link>
      </div>

      <div className="glass-card p-6">
        {faculties.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">🏛️</p>
            <p className="text-slate-400">Henüz fakülte eklenmemiş.</p>
            <Link
              href="/admin/faculties/new"
              className="mt-4 inline-block primary-button"
            >
              İlk Fakülteyi Ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    İsim
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Kod
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Üniversite
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Dekan
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
                {faculties.map((faculty) => (
                  <tr
                    key={faculty.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 text-slate-300 font-medium">
                      {faculty.name}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-xs">
                      {faculty.code}
                    </td>
                    <td className="py-3 text-slate-400">
                      {faculty.universities?.name ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400">
                      {faculty.dean_name ?? "—"}
                    </td>
                    <td className="py-3">
                      {faculty.active ? (
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
                          href={`/admin/faculties/${faculty.id}/edit`}
                          className="soft-button text-xs py-1 px-3"
                        >
                          Düzenle
                        </Link>
                        <DeleteButton
                          action={deleteFacultyAction.bind(null, faculty.id)}
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
