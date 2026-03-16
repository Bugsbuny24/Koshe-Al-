import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LiveClient from "@/components/live/LiveClient";

export default async function LivePage() {
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
      "native_language,target_language,difficulty_level,learning_stage,onboarding_completed"
    )
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  if (!profile.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <LiveClient
      nativeLanguage={profile.native_language || "Turkish"}
      targetLanguage={profile.target_language || "English"}
      stage={profile.difficulty_level || "A1"}
    />
  );
}
