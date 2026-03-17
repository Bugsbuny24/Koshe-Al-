import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { updateFacultyAction } from "../../../actions";
import type { FacultyRow, UniversityRow } from "@/types/academic";

export default async function EditFacultyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: facultyData }, { data: universitiesData }] = await Promise.all(
    [
      supabase.from("faculties").select("*").eq("id", id).single(),
      supabase
        .from("universities")
        .select("id, name, code")
        .eq("active", true)
        .order("name"),
    ]
  );

  const faculty = facultyData as FacultyRow | null;
  if (!faculty) notFound();

  const universities = (universitiesData ?? []) as UniversityRow[];
  const action = updateFacultyAction.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/faculties"
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Geri
        </Link>
        <SectionHeader eyebrow="Admin" title="Fakülte Düzenle" />
      </div>

      <div className="glass-card p-6">
        <form action={action} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Üniversite *
            </label>
            <select
              name="university_id"
              required
              defaultValue={faculty.university_id}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
            >
              <option value="">Üniversite seçin...</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name} ({uni.code})
                </option>
              ))}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Fakülte Adı *
              </label>
              <input
                name="name"
                required
                defaultValue={faculty.name}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Kod *
              </label>
              <input
                name="code"
                required
                defaultValue={faculty.code}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Dekan Adı
            </label>
            <input
              name="dean_name"
              defaultValue={faculty.dean_name ?? ""}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={faculty.description ?? ""}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Durum
            </label>
            <select
              name="active"
              defaultValue={faculty.active ? "true" : "false"}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="primary-button">
              Değişiklikleri Kaydet
            </button>
            <Link href="/admin/faculties" className="soft-button">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
