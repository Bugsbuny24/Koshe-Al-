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
      return NextResponse.json({ error: "Eksik Pi auth verisi." }, { status: 400 });
    }

    const email = `${username}@pi.local`;

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (!existing) {
      const { error } = await supabase.from("profiles").insert({
        id: crypto.randomUUID(),
        username,
        full_name: username,
        email,
        role: "user",
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true, uid, username });
  } catch {
    return NextResponse.json({ error: "Pi auth server hatası." }, { status: 500 });
  }
}
