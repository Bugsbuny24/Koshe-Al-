import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { createCourseAction } from "../../actions";
import type { UniversityRow, FacultyRow, ProgramRow } from "@/types/academic";

export default async function NewCoursePage() {
  const supabase = await createClient();
  let universities: UniversityRow[] = [];
  let faculties: FacultyRow[] = [];
  let programs: ProgramRow[] = [];

  try {
    const [{ data: uniData }, { data: facData }, { data: progData }] =
      await Promise.all([
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
        supabase
          .from("programs")
          .select("id, title, code, university_id, faculty_id")
          .eq("active", true)
          .order("title"),
      ]);
    universities = (uniData ?? []) as UniversityRow[];
    faculties = (facData ?? []) as FacultyRow[];
    programs = (progData ?? []) as ProgramRow[];
  } catch {
    // tables may not exist yet
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/courses"
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Geri
        </Link>
        <SectionHeader eyebrow="Admin" title="Yeni Ders" />
      </div>

      <div className="glass-card p-6">
        <form action={createCourseAction} className="space-y-5">
          {/* Relations */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Üniversite *
              </label>
              <select
                name="university_id"
                required
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

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Program (Opsiyonel)
            </label>
            <select
              name="program_id"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
            >
              <option value="">Program seçmeyin (genel ders)</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* Title & Code */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Ders Adı *
              </label>
              <input
                name="title"
                required
                placeholder="Introduction to Computer Science"
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
                placeholder="CS101"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          {/* Credits, Level, Semester */}
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Kredi *
              </label>
              <input
                name="credits"
                type="number"
                min={1}
                max={12}
                defaultValue={3}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Seviye
              </label>
              <input
                name="level"
                placeholder="100, 200, 300..."
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Dönem
              </label>
              <input
                name="semester"
                placeholder="Fall, Spring, Both..."
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          {/* Type & Language */}
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Zorunlu Ders
              </label>
              <select
                name="is_core"
                defaultValue="true"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              >
                <option value="true">Evet</option>
                <option value="false">Hayır</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Seçmeli Ders
              </label>
              <select
                name="is_elective"
                defaultValue="false"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              >
                <option value="false">Hayır</option>
                <option value="true">Evet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Eğitim Dili
              </label>
              <input
                name="language_of_instruction"
                defaultValue="English"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Ders hakkında kısa açıklama..."
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Durum
            </label>
            <select
              name="active"
              defaultValue="true"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="primary-button">
              Ders Oluştur
            </button>
            <Link href="/admin/courses" className="soft-button">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
