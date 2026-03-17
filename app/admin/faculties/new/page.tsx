import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { createFacultyAction } from "../../actions";
import type { UniversityRow } from "@/types/academic";

export default async function NewFacultyPage() {
  const supabase = await createClient();
  let universities: UniversityRow[] = [];

  try {
    const { data } = await supabase
      .from("universities")
      .select("id, name, code")
      .eq("active", true)
      .order("name");
    universities = (data ?? []) as UniversityRow[];
  } catch {
    // table may not exist yet
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/faculties"
          className="text-slate-400 hover:text-white transition-colors text-sm"
        >
          ← Geri
        </Link>
        <SectionHeader eyebrow="Admin" title="Yeni Fakülte" />
      </div>

      <div className="glass-card p-6">
        <form action={createFacultyAction} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Üniversite *
            </label>
            <select
              name="university_id"
              required
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
                placeholder="Faculty of Sciences"
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
                placeholder="FOS"
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Fakülte Türü
            </label>
            <select
              name="faculty_type"
              defaultValue="generic"
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-white focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 text-sm"
            >
              <option value="generic">Generic (Standart Fakülte)</option>
              <option value="language">Language (Dil Fakültesi — mevcut sistemi sarar)</option>
            </select>
            <p className="mt-1.5 text-xs text-slate-500">
              &quot;Language&quot; seçeneği mevcut dil kurslarını bu fakülte altında gösterir.
            </p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Dekan Adı
            </label>
            <input
              name="dean_name"
              placeholder="Prof. Dr. ..."
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
              placeholder="Fakülte hakkında kısa açıklama..."
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
              Fakülte Oluştur
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
