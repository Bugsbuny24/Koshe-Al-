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

  return <LiveClient />;
}
