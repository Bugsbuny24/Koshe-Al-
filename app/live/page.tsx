import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LiveClient from "@/components/live/LiveClient";
import { DEPARTMENTS } from "@/lib/data/curriculum";
import {
  getMockCreditBalance,
  buildCreditWarningState,
  estimateSessionCost,
} from "@/lib/credits/credit-helpers";

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

  const targetLanguage = profile.target_language || "English";

  // Derive language code for mentor + academic context
  const langCode =
    DEPARTMENTS.find(
      (d) => d.name.toLowerCase() === targetLanguage.toLowerCase()
    )?.code ?? targetLanguage.slice(0, 2).toLowerCase();

  // TODO: Replace with real Supabase query when credit_balances table exists
  const creditBalance = getMockCreditBalance(user.id);
  const estimatedMinutes = 10;
  const estimatedCost = estimateSessionCost("live", estimatedMinutes);
  const creditWarningState = buildCreditWarningState(creditBalance.balance);

  return (
    <LiveClient
      nativeLanguage={profile.native_language || "Turkish"}
      targetLanguage={targetLanguage}
      stage={profile.difficulty_level || "A1"}
      languageCode={langCode}
      creditBalance={creditBalance.balance}
      estimatedCost={estimatedCost}
      creditWarningState={creditWarningState}
    />
  );
}

