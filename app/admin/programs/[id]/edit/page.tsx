import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { updateProgramAction } from "../../../actions";
import type { ProgramRow, UniversityRow, FacultyRow } from "@/types/academic";

const DEGREE_TYPES = ["BA", "BS", "MA", "MSc", "PhD", "Certificate", "Diploma", "Prep"];

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: programData }, { data: uniData }, { data: facData }] =
    await Promise.all([
      supabase.from("programs").select("*").eq("id", id).single(),
      supabase
        .from("universities")
        .select("id, name, code")
        .eq("active", true)
        .order("name"),
      supabase
        .from("faculties")
        .select("id, name, code, university_id")
        .eq("active", true)
        .order("name"),
    ]);

  const program = programData as ProgramRow | null;
  if (!program) notFound();

  const universities = (uniData ?? []) as UniversityRow[];
  const faculties = (facData ?? []) as FacultyRow[];
  const action = updateProgramAction.bind(null, id);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/programs"
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Geri
        </Link>
        <SectionHeader eyebrow="Admin" title="Program Düzenle" />
      </div>

      <div className="glass-card p-6">
        <form action={action} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Üniversite *
              </label>
              <select
                name="university_id"
                required
                defaultValue={program.university_id}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              >
                <option value="">Seçin...</option>
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name} ({uni.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Fakülte *
              </label>
              <select
                name="faculty_id"
                required
                defaultValue={program.faculty_id ?? ""}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              >
                <option value="">Seçin...</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Program Adı *
              </label>
              <input
                name="title"
                required
                defaultValue={program.title}
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
                defaultValue={program.code}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Derece Türü *
              </label>
              <select
                name="degree_type"
                required
                defaultValue={program.degree_type}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              >
                {DEGREE_TYPES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Süre (Yıl)
              </label>
              <input
                name="duration_years"
                type="number"
                min={1}
                max={10}
                defaultValue={program.duration_years}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Min. GPA
              </label>
              <input
                name="min_gpa"
                type="number"
                step="0.1"
                min={0}
                max={4}
                defaultValue={program.min_gpa ?? ""}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Toplam Kredi
              </label>
              <input
                name="total_credits"
                type="number"
                defaultValue={program.total_credits ?? ""}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Toplam Ders
              </label>
              <input
                name="total_courses"
                type="number"
                defaultValue={program.total_courses ?? ""}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Eğitim Dili
              </label>
              <input
                name="language_of_instruction"
                defaultValue={program.language_of_instruction ?? "English"}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
              Program Seçenekleri
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                {
                  name: "has_prep_year",
                  label: "Hazırlık Yılı",
                  value: program.has_prep_year,
                },
                {
                  name: "has_thesis",
                  label: "Tez",
                  value: program.has_thesis,
                },
                {
                  name: "has_minor_option",
                  label: "Minör Seçeneği",
                  value: program.has_minor_option,
                },
                {
                  name: "has_honors_option",
                  label: "Onur Seçeneği",
                  value: program.has_honors_option,
                },
                {
                  name: "study_abroad_optional",
                  label: "Yurt Dışı",
                  value: program.study_abroad_optional,
                },
              ].map((opt) => (
                <div key={opt.name}>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                    {opt.label}
                  </label>
                  <select
                    name={opt.name}
                    defaultValue={opt.value ? "true" : "false"}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
                  >
                    <option value="false">Hayır</option>
                    <option value="true">Evet</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={program.description ?? ""}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Durum
            </label>
            <select
              name="active"
              defaultValue={program.active ? "true" : "false"}
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
            <Link href="/admin/programs" className="soft-button">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
