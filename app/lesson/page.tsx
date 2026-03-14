import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonClient from "./lesson-client";

export default async function LessonPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
if (!user) {
  redirect("/");
}
  const { data: profile } = await supabase
    .from("profiles")
    .select("native_language,target_language,learning_stage,difficulty_level,onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <LessonClient
      nativeLanguage={profile.native_language || "Turkish"}
      targetLanguage={profile.target_language || "English"}
      stage={profile.learning_stage || "A1"}
      difficulty={profile.difficulty_level || 3}
    />
  );
}
