import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/ui/Surface";

type FeedbackRow = {
  id: string;
  user_id: string;
  content: string;
  rating: number | null;
  created_at: string;
};

export default async function AdminFeedbackPage() {
  const supabase = await createClient();

  const { data: feedbacks } = await supabase
    .from("feedback_messages")
    .select("id,user_id,content,rating,created_at")
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<FeedbackRow[]>();

  // user_id → profile bilgisi için ayrı sorgu
  const userIds = [...new Set((feedbacks ?? []).map((f) => f.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id,full_name,email")
        .in("id", userIds)
    : { data: [] };

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.id, p])
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Admin"
        title="Feedback"
        description={`${feedbacks?.length ?? 0} geri bildirim`}
      />

      {!feedbacks || feedbacks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="text-slate-400">Henüz feedback yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((fb) => {
            const profile = profileMap.get(fb.user_id);
            return (
              <div key={fb.id} className="glass-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="text-sm font-medium text-white">
                        {profile?.full_name || "Anonim"}
                      </span>
                      {profile?.email && (
                        <span className="text-xs text-slate-500">
                          {profile.email}
                        </span>
                      )}
                      {fb.rating != null && (
                        <span className="text-yellow-400 text-sm">
                          {"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-6">{fb.content}</p>
                  </div>
                  <div className="text-xs text-slate-600 shrink-0">
                    {new Date(fb.created_at).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
