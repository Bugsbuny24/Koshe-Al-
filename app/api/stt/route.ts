import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    ok: true,
    message:
      "V1 currently uses browser speech recognition on the client side. Server-side STT is not enabled yet.",
  });
}
