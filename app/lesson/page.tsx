import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LessonClient from "./lesson-client";
import { DEPARTMENTS } from "@/lib/data/curriculum";

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

  const targetLanguage = profile?.target_language || "English";
  const level = profile?.difficulty_level || "A1";

  // Derive language code from target language name for academic context
  const langCode =
    DEPARTMENTS.find(
      (d) => d.name.toLowerCase() === targetLanguage.toLowerCase()
    )?.code ?? targetLanguage.slice(0, 2).toLowerCase();

  return (
    <LessonClient
      targetLanguage={targetLanguage}
      level={level}
      languageCode={langCode}
    />
  );
}

