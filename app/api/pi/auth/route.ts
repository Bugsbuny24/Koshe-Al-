import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type PiAuthBody = {
  user?: {
    uid?: string;
    username?: string;
  };
  accessToken?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PiAuthBody;

    const piUid = body?.user?.uid;
    const username = body?.user?.username ?? "Pi User";

    if (!piUid) {
      return NextResponse.json({ error: "Pi UID yok." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://tradepigloball.co";

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase ayarları eksik." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const email = `${piUid}@pi.local`;
    const password = `pi_${piUid}`;

    const { data: usersData, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    let user = usersData.users.find((u) => u.email === email);

    if (!user) {
      const { data: createdData, error: createError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            provider: "pi",
            pi_uid: piUid,
            username,
          },
        });

      if (createError || !createdData.user) {
        return NextResponse.json(
          { error: createError?.message || "Pi kullanıcısı oluşturulamadı." },
          { status: 500 }
        );
      }

      user = createdData.user;
    } else {
      const { data: updatedData, error: updateError } =
        await supabase.auth.admin.updateUserById(user.id, {
          password,
          email_confirm: true,
          user_metadata: {
            ...(user.user_metadata || {}),
            provider: "pi",
            pi_uid: piUid,
            username,
          },
        });

      if (updateError || !updatedData.user) {
        return NextResponse.json(
          { error: updateError?.message || "Pi kullanıcısı güncellenemedi." },
          { status: 500 }
        );
      }

      user = updatedData.user;
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
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

    const { error: quotaError } = await supabase.from("user_quotas").upsert(
      {
        user_id: user.id,
        plan: "free",
        tier: "free",
        is_active: true,
        credits_remaining: 20,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (quotaError) {
      return NextResponse.json({ error: quotaError.message }, { status: 500 });
    }

    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${siteUrl}/dashboard`,
        },
      });

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json(
        { error: linkError?.message || "Magic link üretilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      actionLink: linkData.properties.action_link,
      userId: user.id,
      email,
      username,
    });
  } catch (error: unknown) {
    const err = error as Error;

    return NextResponse.json(
      { error: err?.message || "Bilinmeyen Pi auth hatası." },
      { status: 500 }
    );
  }
}
