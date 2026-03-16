import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "full_name,native_language,target_language,difficulty_level,learning_stage"
    )
    .eq("id", user.id)
    .single();

  const { data: sessions } = await supabase
    .from("speaking_sessions")
    .select(
      "fluency_score,grammar_score,vocabulary_score,created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const latestScore = sessions?.[0];

  const avgFluency =
    sessions?.reduce((sum, s) => sum + (s.fluency_score || 0), 0) /
      (sessions?.length || 1) || 0;

  const avgGrammar =
    sessions?.reduce((sum, s) => sum + (s.grammar_score || 0), 0) /
      (sessions?.length || 1) || 0;

  const avgVocab =
    sessions?.reduce((sum, s) => sum + (s.vocabulary_score || 0), 0) /
      (sessions?.length || 1) || 0;

  return (
    <main className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-semibold mb-6">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg mb-3">Profil</h2>

            <p>Ad: {profile?.full_name}</p>
            <p>Ana dil: {profile?.native_language}</p>
            <p>Öğrenilen dil: {profile?.target_language}</p>
            <p>Seviye: {profile?.difficulty_level}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg mb-3">Son Skor</h2>

            {latestScore ? (
              <div className="space-y-2">
                <p>Fluency: {latestScore.fluency_score}</p>
                <p>Grammar: {latestScore.grammar_score}</p>
                <p>Vocabulary: {latestScore.vocabulary_score}</p>
              </div>
            ) : (
              <p>Henüz konuşma yapılmadı.</p>
            )}
          </div>

        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg mb-4">Ortalama Skorlar</h2>

          <div className="grid md:grid-cols-3 gap-4">

            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm text-gray-400">Fluency</div>
              <div className="text-2xl font-semibold">
                {Math.round(avgFluency)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm text-gray-400">Grammar</div>
              <div className="text-2xl font-semibold">
                {Math.round(avgGrammar)}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-sm text-gray-400">Vocabulary</div>
              <div className="text-2xl font-semibold">
                {Math.round(avgVocab)}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
