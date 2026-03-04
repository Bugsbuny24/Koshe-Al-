import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  // Şimdilik stub. (ElevenLabs açınca burası gerçek mp3 döner.)
  return NextResponse.json({ error: "TTS not enabled yet" }, { status: 501 });
}
