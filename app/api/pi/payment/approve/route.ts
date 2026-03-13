import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const paymentId = body?.paymentId;

    if (!paymentId) {
      return NextResponse.json(
        { error: "paymentId gerekli." },
        { status: 400 }
      );
    }

    const apiKey = process.env.PI_API_KEY;
    const apiBaseUrl =
      process.env.PI_API_BASE_URL || "https://api.minepi.com";
    const sandbox = process.env.NEXT_PUBLIC_PI_SANDBOX === "true";

    if (sandbox && !apiKey) {
      return NextResponse.json({
        ok: true,
        simulated: true,
        paymentId,
      });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "PI_API_KEY eksik." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${apiBaseUrl}/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error || "Pi approve başarısız.",
          details: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      paymentId,
      data,
    });
  } catch (error) {
    console.error("Pi approve route error:", error);
    return NextResponse.json(
      { error: "Pi ödeme onay hatası." },
      { status: 500 }
    );
  }
}
