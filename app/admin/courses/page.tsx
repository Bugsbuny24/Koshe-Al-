import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";
import { deleteCourseAction } from "../actions";
import DeleteButton from "../components/DeleteButton";
import type { AcademicCourseRow } from "@/types/academic";

type CourseWithRelations = AcademicCourseRow & {
  universities: { name: string; code: string } | null;
  faculties: { name: string } | null;
};

export default async function CoursesPage() {
  const supabase = await createClient();
  let courses: CourseWithRelations[] = [];

  try {
    const { data } = await supabase
      .from("academic_courses")
      .select("*, universities(name, code), faculties(name)")
      .order("title");
    courses = (data ?? []) as CourseWithRelations[];
  } catch {
    // table may not exist yet
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Admin"
          title="Dersler"
          description={`${courses.length} ders kayıtlı`}
        />
        <Link href="/admin/courses/new" className="primary-button shrink-0">
          + Yeni Ders
        </Link>
      </div>

      <div className="glass-card p-6">
        {courses.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-4xl mb-3">📖</p>
            <p className="text-slate-400">Henüz ders eklenmemiş.</p>
            <Link
              href="/admin/courses/new"
              className="mt-4 inline-block primary-button"
            >
              İlk Dersi Ekle
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Ders
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Kredi
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Tür
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Üniversite
                  </th>
                  <th className="pb-3 text-left text-xs uppercase tracking-[0.2em] text-slate-400 font-normal">
                    Fakülte
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
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <td className="py-3">
                      <p className="text-slate-300 font-medium">
                        {course.title}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">
                        {course.code}
                      </p>
                    </td>
                    <td className="py-3 text-slate-400">{course.credits}</td>
                    <td className="py-3 text-xs">
                      {course.is_core && (
                        <span className="inline-flex items-center rounded-full bg-cyan-400/10 px-2 py-0.5 text-xs text-cyan-400 mr-1">
                          Zorunlu
                        </span>
                      )}
                      {course.is_elective && (
                        <span className="inline-flex items-center rounded-full bg-purple-400/10 px-2 py-0.5 text-xs text-purple-400">
                          Seçmeli
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {course.universities?.name ?? "—"}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {course.faculties?.name ?? "—"}
                    </td>
                    <td className="py-3">
                      {course.active ? (
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
                          href={`/admin/courses/${course.id}/edit`}
                          className="soft-button text-xs py-1 px-3"
                        >
                          Düzenle
                        </Link>
                        <DeleteButton
                          action={deleteCourseAction.bind(null, course.id)}
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
