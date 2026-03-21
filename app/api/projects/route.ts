import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

async function getUserId(req: NextRequest, supabase: ReturnType<typeof createSupabaseServer>): Promise<string | undefined> {
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (user?.id) return user.id;
  }

  const cookieHeader = req.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/sb-[^-]+-auth-token=([^;]+)/);
  if (tokenMatch) {
    try {
      const decoded = JSON.parse(decodeURIComponent(tokenMatch[1]));
      const { data: { user: u } } = await supabase.auth.getUser(decoded?.access_token);
      if (u?.id) return u.id;
    } catch {
      // ignore
    }
  }

  return undefined;
}

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const userId = await getUserId(req, supabase);
    if (!userId) {
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ projects: projects || [] });
  } catch (err) {
    console.error('Projects GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const userId = await getUserId(req, supabase);
    if (!userId) {
      return NextResponse.json({ error: 'Kimlik doğrulaması gerekli' }, { status: 401 });
    }

    const body = await req.json();
    const { clientName, brandName, niche, serviceType, rawBrief, budget, deadline } = body;

    if (!clientName?.trim()) {
      return NextResponse.json({ error: 'Müşteri adı gerekli' }, { status: 400 });
    }
    if (!rawBrief?.trim()) {
      return NextResponse.json({ error: 'Ham brief gerekli' }, { status: 400 });
    }

    // Try to find or create client
    let clientId: string | null = null;
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .ilike('name', clientName.trim())
      .maybeSingle();

    if (existingClient?.id) {
      clientId = existingClient.id;
    } else {
      const { data: newClient } = await supabase
        .from('clients')
        .insert({
          user_id: userId,
          name: clientName.trim(),
          brand_name: brandName?.trim() || clientName.trim(),
          niche: niche || 'hotel',
        })
        .select('id')
        .single();
      if (newClient?.id) clientId = newClient.id;
    }

    // Create project
    const title = `${brandName?.trim() || clientName.trim()} – ${serviceType || 'Proje'}`;
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        client_id: clientId,
        client_name: clientName.trim(),
        brand_name: brandName?.trim() || null,
        title,
        niche: niche || 'hotel',
        service_type: serviceType || 'landing-page',
        raw_brief: rawBrief.trim(),
        status: 'new',
        budget: budget?.trim() || null,
        deadline: deadline || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error('Projects POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
