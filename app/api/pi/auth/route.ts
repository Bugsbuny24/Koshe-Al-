import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {

  const body = await req.json();

  const email = `${piUid}@pi.local`;
const password = `pi_${piUid}`;

const { data } = await supabase.auth.admin.listUsers();
let user = data.users.find((u) => u.email === email);

if (!user) {
  const created = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      provider: "pi",
      pi_uid: piUid,
      username,
    },
  });
  user = created.data.user;
} else {
  await supabase.auth.admin.updateUserById(user.id, {
    password,
    user_metadata: {
      provider: "pi",
      pi_uid: piUid,
      username,
    },
  });
}
