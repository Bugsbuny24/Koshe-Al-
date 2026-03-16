import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonClient from "./lesson-client";

export default async function LessonPage() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("target_language,difficulty_level")
    .eq("id", user.id)
    .single();

  return (
    <LessonClient
      targetLanguage={profile?.target_language || "English"}
      level={profile?.difficulty_level || "A1"}
    />
  );
}
