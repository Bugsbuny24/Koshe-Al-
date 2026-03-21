import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json({ error: 'Admin paneli yapılandırılmamış' }, { status: 503 });
    }

    if (password !== adminSecret) {
      return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 });
    }

    return NextResponse.json({ token: adminSecret });
  } catch {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
