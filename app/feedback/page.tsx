import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<{
  success?: string;
  error?: string;
}>;

async function submitFeedback(formData: FormData) {
  "use server";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const category = String(formData.get("category") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const pagePath = String(formData.get("page_path") || "").trim();
  const severity = String(formData.get("severity") || "medium").trim();

  if (!category || !title || !message) {
    redirect(
      "/feedback?error=Eksik%20alan%20var.%20L%C3%BCtfen%20t%C3%BCm%20zorunlu%20alanlar%C4%B1%20doldur."
    );
  }

  const { error } = await supabase.from("feedback_messages").insert({
    user_id: user.id,
    category,
    title,
    message,
    page_path: pagePath || null,
    severity,
    status: "new",
  });

  if (error) {
    console.error("feedback insert error", error);
    redirect("/feedback?error=Mesaj%20g%C3%B6nderilemedi.");
  }

  revalidatePath("/feedback");
  redirect("/feedback?success=Geri%20bildirimin%20g%C3%B6nderildi.");
}

export default async function FeedbackPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const success = searchParams?.success;
  const error = searchParams?.error;

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-cyan-300">
            Koshei AI
          </p>
          <h1 className="text-3xl font-semibold">Geri Bildirim Gönder</h1>
          <p className="mt-3 text-sm text-slate-300">
            Eksik yönleri, hataları, geliştirme önerilerini veya istediğin yeni
            özellikleri bize buradan yazabilirsin.
          </p>
        </div>

        {success ? (
          <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {success}
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <form
          action={submitFeedback}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
        >
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Geri bildirim türü
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full rounded-2xl border border-white/10 bg-[#0b1225] px-4 py-3 text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400"
              defaultValue=""
            >
              <option value="" disabled>
                Seç
              </option>
              <option value="bug">Hata bildirimi</option>
              <option value="feature">Yeni özellik önerisi</option>
              <option value="improvement">İyileştirme önerisi</option>
              <option value="ui">Tasarım / kullanım problemi</option>
              <option value="performance">Performans problemi</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="severity"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Öncelik
            </label>
            <select
              id="severity"
              name="severity"
              className="w-full rounded-2xl border border-white/10 bg-[#0b1225] px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              defaultValue="medium"
            >
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="critical">Kritik</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Başlık
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={120}
              placeholder="Kısa başlık yaz..."
              className="w-full rounded-2xl border border-white/10 bg-[#0b1225] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="page_path"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Hangi sayfada oldu? (opsiyonel)
            </label>
            <input
              id="page_path"
              name="page_path"
              type="text"
              placeholder="/live, /pricing, /dashboard gibi..."
              className="w-full rounded-2xl border border-white/10 bg-[#0b1225] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-2 block text-sm font-medium text-slate-200"
            >
              Mesaj
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={8}
              placeholder="Eksik yönü, hatayı veya geliştirme önerini detaylı yaz..."
              className="w-full rounded-2xl border border-white/10 bg-[#0b1225] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Geri Bildirimi Gönder
            </button>

            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-slate-200 transition hover:bg-white/10"
            >
              Dashboard&apos;a Dön
            </a>
          </div>
        </form>
      </div>
    </main>
  );
              }
