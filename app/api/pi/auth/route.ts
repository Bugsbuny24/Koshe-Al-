import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const uid = body?.user?.uid;
    const username = body?.user?.username;
    const accessToken = body?.accessToken;

    if (!uid || !username || !accessToken) {
      return NextResponse.json(
        { error: "Eksik Pi auth verisi." },
        { status: 400 }
      );
    }

    const email = `${username}@pi.local`;

    const { data: existing, error: existingError } = await supabase
      .from("profiles")
      .select("id, username")
      .eq("username", username)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    if (!existing) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: crypto.randomUUID(),
        username,
        full_name: username,
        email,
        role: "user",
        onboarding_completed: false,
      });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      uid,
      username,
      accessTokenPresent: true,
      note: "Profile synced. Full Supabase auth bridge may still require a custom session integration.",
    });
  } catch (error) {
    console.error("Pi auth route error:", error);
    return NextResponse.json(
      { error: "Pi auth server hatası." },
      { status: 500 }
    );
  }
}
