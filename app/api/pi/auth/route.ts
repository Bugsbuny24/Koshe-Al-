import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const piUid = body?.user?.uid;
    const username = body?.user?.username;
    const accessToken = body?.accessToken;

    if (!piUid || !accessToken) {
      return NextResponse.json({ error: "Veri eksik." }, { status: 400 });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const email = `${piUid}@pi.local`;
    const password = `PiAuth-${piUid}-2026!`;

    // Kullanıcı kontrolü
    const { data: usersData } = await admin.auth.admin.listUsers();
    let authUser = usersData.users.find((u) => u.email === email);

    if (!authUser) {
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { pi_uid: piUid, username }
      });
      if (createError) throw createError;
      authUser = newUser.user;
    }

    // HATA BURADAYDI: upsert kullanımı düzeltildi
    await admin.from("profiles").upsert({ 
      id: authUser.id, 
      username: username,
      updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    return NextResponse.json({ ok: true, email, password });
  } catch (error: any) {
    console.error("Server Auth Hatası:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
