import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { createProgramAction } from "../../actions";
import type { UniversityRow, FacultyRow } from "@/types/academic";

const DEGREE_TYPES = ["BA", "BS", "MA", "MSc", "PhD", "Certificate", "Diploma", "Prep"];

export default async function NewProgramPage() {
  const supabase = await createClient();
  let universities: UniversityRow[] = [];
  let faculties: FacultyRow[] = [];

  try {
    const [{ data: uniData }, { data: facData }] = await Promise.all([
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
    universities = (uniData ?? []) as UniversityRow[];
    faculties = (facData ?? []) as FacultyRow[];
  } catch {
    // tables may not exist yet
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/programs"
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Geri
        </Link>
        <SectionHeader eyebrow="Admin" title="Yeni Program" />
      </div>

      <div className="glass-card p-6">
        <form action={createProgramAction} className="space-y-5">
          {/* University & Faculty */}
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

          {/* Title & Code */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Program Adı *
              </label>
              <input
                name="title"
                required
                placeholder="Bachelor of Science in Computer Science"
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
                placeholder="HWU-CS-BS"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          {/* Degree & Duration */}
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Derece Türü *
              </label>
              <select
                name="degree_type"
                required
                defaultValue="BS"
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
                defaultValue={4}
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
                placeholder="2.0"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          {/* Credits & Courses */}
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Toplam Kredi
              </label>
              <input
                name="total_credits"
                type="number"
                placeholder="128"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Toplam Ders
              </label>
              <input
                name="total_courses"
                type="number"
                placeholder="32"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                Eğitim Dili
              </label>
              <input
                name="language_of_instruction"
                defaultValue="English"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-3">
              Program Seçenekleri
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "has_prep_year", label: "Hazırlık Yılı" },
                { name: "has_thesis", label: "Tez" },
                { name: "has_minor_option", label: "Minör Seçeneği" },
                { name: "has_honors_option", label: "Onur Seçeneği" },
                { name: "study_abroad_optional", label: "Yurt Dışı" },
              ].map((opt) => (
                <div key={opt.name}>
                  <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
                    {opt.label}
                  </label>
                  <select
                    name={opt.name}
                    defaultValue="false"
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
              placeholder="Program hakkında kısa açıklama..."
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
              Program Oluştur
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
