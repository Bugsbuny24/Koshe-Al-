import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message:
      "V1 currently uses browser speech synthesis on the client side. Server-side TTS is not enabled yet.",
  });
}
