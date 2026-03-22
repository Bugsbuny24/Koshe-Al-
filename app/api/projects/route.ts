import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin, createSupabaseRouteClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabaseAuth = await createSupabaseRouteClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor. Lütfen giriş yapın.' }, { status: 401 });
    }

    const supabase = createSupabaseAdmin();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
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
    const supabaseAuth = await createSupabaseRouteClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor. Lütfen giriş yapın.' }, { status: 401 });
    }
    const userId = user.id;
    const supabase = createSupabaseAdmin();

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
        tech_stack: tech_stack ? [tech_stack] : null,
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
