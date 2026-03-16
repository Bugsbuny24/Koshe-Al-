import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold">
        Hoş geldin
      </h1>

      <p>{user.email}</p>

    </div>
  );
}
