import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, accessToken } = body;

    if (!user?.uid || !accessToken) {
      return NextResponse.json({ error: "Veri eksik." }, { status: 400 });
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const email = `${user.uid}@pi.local`;
    const password = `PiAuth-${user.uid}-2026`; // Güvenli bir desen

    // Kullanıcıyı bul veya oluştur
    const { data: userData } = await admin.auth.admin.getUserById(user.uid).catch(() => ({ data: { user: null } }));
    
    let authUser;
    if (!userData?.user) {
      const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username: user.username, pi_uid: user.uid }
      });
      if (createError) throw createError;
      authUser = newUser.user;
    } else {
      authUser = userData.user;
    }

    [span_4](start_span)// Profil ve Kota işlemlerini güncelle (upsert)[span_4](end_span)
    await admin.from("profiles").upsert({ id: authUser.id, username: user.username });

    return NextResponse.json({ ok: true, email, password });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
