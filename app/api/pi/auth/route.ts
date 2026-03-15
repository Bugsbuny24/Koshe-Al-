import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {

  const body = await req.json();

  const piUid = body?.user?.uid;
  const username = body?.user?.username;

  if (!piUid) {
    return NextResponse.json({ error: "Pi UID yok" }, { status: 400 });
  }

  const email = `${piUid}@pi.local`;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // kullanıcı var mı
  const { data } = await supabase.auth.admin.listUsers();

  let user = data.users.find(u => u.email === email);

  if (!user) {

    const created = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        provider: "pi",
        pi_uid: piUid,
        username
      }
    });

    if (created.error) {
      return NextResponse.json({ error: created.error.message }, { status: 500 });
    }

    user = created.data.user;
  }

  return NextResponse.json({
    userId: user.id,
    email
  });
}
