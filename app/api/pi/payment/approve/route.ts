import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body?.paymentId) {
    return NextResponse.json({ error: "paymentId gerekli." }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
