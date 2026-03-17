import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CreateCollectiblePayload } from "@/types/university";

// GET /api/collectibles — list the authenticated user's collectibles
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("collectible_rewards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ collectibles: data ?? [] });
}

// POST /api/collectibles — create a new NFT-ready collectible reward
export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = (await req.json()) as CreateCollectiblePayload;

  const {
    source_type,
    source_id,
    token_name,
    token_symbol,
    metadata_json,
    image_url,
    rarity,
    downloadable_file_url,
  } = body;

  if (!source_type || !source_id || !token_name || !token_symbol || !image_url) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Upsert: same source cannot produce two collectibles
  const { data, error } = await supabase
    .from("collectible_rewards")
    .upsert(
      {
        user_id: user.id,
        source_type,
        source_id,
        token_name,
        token_symbol,
        metadata_json: metadata_json ?? {},
        image_url,
        rarity: rarity ?? "common",
        mint_status: "draft",
        downloadable_file_url: downloadable_file_url ?? image_url,
        marketplace_status: "hidden",
      },
      { onConflict: "user_id,source_type,source_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ collectible: data }, { status: 201 });
}
