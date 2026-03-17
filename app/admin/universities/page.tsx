import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { deleteUniversityAction } from "../actions";
import DeleteButton from "../components/DeleteButton";
import type { UniversityRow } from "@/types/academic";

export default async function UniversitiesPage() {
  const supabase = await createClient();
  let universities: UniversityRow[] = [];

  try {
    const { data } = await supabase
      .from("universities")
      .select("*")
      .order("name");
    universities = data ?? [];
  } catch {
    // table may not exist yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Admin"
          title="Üniversiteler"
          description={`${universities.length} üniversite kayıtlı`}
        />
        <Link href="/admin/universities/new" className="primary-button shrink-0">
          + Yeni Üniversite
        </Link>
      </div>

      <div className="glass-card p-6">
        {universities.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-slate-400">Henüz üniversite eklenmemiş.</p>
            <Link
              href="/admin/universities/new"
              className="mt-4 inline-block primary-button"
            >
              İlk Üniversiteyi Ekle
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
                    Ülke
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
                {universities.map((uni) => (
                  <tr
                    key={uni.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3 text-slate-300 font-medium">
                      {uni.name}
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-xs">
                      {uni.code}
                    </td>
                    <td className="py-3 text-slate-400">
                      {uni.country ?? "—"}
                    </td>
                    <td className="py-3">
                      {uni.active ? (
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
                          href={`/admin/universities/${uni.id}/edit`}
                          className="soft-button text-xs py-1 px-3"
                        >
                          Düzenle
                        </Link>
                        <DeleteButton
                          action={deleteUniversityAction.bind(null, uni.id)}
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
