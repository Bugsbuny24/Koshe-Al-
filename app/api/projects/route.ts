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
    // Support both simplified fields (title/description/tech_stack) and legacy form fields
    const {
      title: rawTitle,
      description: rawDescription,
      tech_stack: rawTechStack,
      prompt: rawPrompt,
      // Legacy form fields
      clientName,
      brandName,
      niche,
      serviceType,
      rawBrief,
    } = body;

    // Build title from available fields
    const trimmedTitle = rawTitle?.trim();
    const trimmedBrand = brandName?.trim();
    const trimmedClient = clientName?.trim();
    const title = trimmedTitle ||
      (trimmedBrand || trimmedClient
        ? `${trimmedBrand || trimmedClient}${serviceType ? ' – ' + serviceType : ''}`
        : null);

    if (!title) {
      return NextResponse.json({ error: 'Başlık gerekli' }, { status: 400 });
    }

    const description = rawDescription?.trim() || rawBrief?.trim() || null;
    const prompt = rawPrompt?.trim() || rawBrief?.trim() || rawDescription?.trim() || null;
    const tech_stack = rawTechStack?.trim() ||
      (serviceType && niche ? `${serviceType} | ${niche}` : serviceType || niche || null);

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        title,
        description,
        prompt,
        tech_stack,
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
