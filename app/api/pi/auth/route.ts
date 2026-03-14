import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function buildPiEmail(piUid: string) {
  return `${piUid}@pi.local`;
}

function buildPiPassword(piUid: string) {
  return `PiAuth-${piUid}-Secure!2026`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const piUid = body?.user?.uid;
    const username = body?.user?.username;
    const accessToken = body?.accessToken;

    if (!piUid || !username || !accessToken) {
      return NextResponse.json(
        { error: "Eksik Pi auth verisi." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase ayarları eksik." },
        { status: 500 }
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const email = buildPiEmail(piUid);
    const password = buildPiPassword(piUid);

    const { data: usersData, error: listError } =
      await admin.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json(
        { error: listError.message },
        { status: 500 }
      );
    }

    let authUser = usersData.users.find((u) => u.email === email);

    if (!authUser) {
      const { data: createdUser, error: createError } =
        await admin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            provider: "pi",
            pi_uid: piUid,
            username,
          },
        });

      if (createError || !createdUser.user) {
        return NextResponse.json(
          { error: createError?.message || "Auth user oluşturulamadı." },
          { status: 500 }
        );
      }

      authUser = createdUser.user;
    } else {
      await admin.auth.admin.updateUserById(authUser.id, {
        password,
        user_metadata: {
          provider: "pi",
          pi_uid: piUid,
          username,
        },
      });
    }

    const { error: profileError } = await admin.from("profiles").upsert(
      {
        id: authUser.id,
        email,
        username,
        full_name: username,
        role: "user",
        onboarding_completed: false,
      },
      { onConflict: "id" }
    );

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    await admin.from("user_quotas").upsert(
      {
        user_id: authUser.id,
        plan: "free",
        tier: "free",
        is_active: true,
        credits_remaining: 20,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    return NextResponse.json({
      ok: true,
      email,
      password,
      userId: authUser.id,
      username,
    });
  } catch (error) {
    console.error("Pi auth route error:", error);
    return NextResponse.json(
      { error: "Pi auth server hatası." },
      { status: 500 }
    );
  }
}
