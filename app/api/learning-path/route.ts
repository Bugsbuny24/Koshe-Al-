import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { generateText } from '@/lib/gemini/client';

async function resolveUserId(req: NextRequest): Promise<string | undefined> {
  const supabase = createSupabaseServer();
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

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor', code: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const { answers } = await req.json();
    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Geçersiz veriler', code: 'INVALID_INPUT' }, { status: 400 });
    }

    const supabase = createSupabaseServer();

    // Save learning preferences to profile
    await supabase
      .from('profiles')
      .update({ learning_preferences: answers })
      .eq('id', userId);

    // Generate personalized learning path with Gemini
    const prompt = `Bir öğrencinin öğrenme tercihlerine göre kişiselleştirilmiş bir öğrenme yolu oluştur.

Tercihler:
- Alan: ${answers.field || 'Belirsiz'}
- Seviye: ${answers.level || 'Başlangıç'}
- Günlük süre: ${answers.time || '30 dk'}
- Hedef: ${answers.goal || 'Geliştirme'}
- Öğrenme stili: ${answers.style || 'Karma'}

JSON formatında yanıt ver (başka hiçbir şey ekleme):
{
  "courses": ["kurs1", "kurs2", "kurs3", "kurs4", "kurs5"],
  "tips": ["öneri1", "öneri2", "öneri3"],
  "estimatedWeeks": 12
}

courses: Sıralı 5 kurs önerisi (Türkçe)
tips: 3 kişisel öğrenme önerisi (Türkçe)
estimatedWeeks: Tahmini tamamlama süresi (hafta)`;

    let courses: string[] = [];
    let tips: string[] = [];
    let estimatedWeeks = 12;

    try {
      const result = await generateText({
        prompt,
        feature: 'mentor_lite',
        userId,
        useCache: false,
      });
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        courses = parsed.courses || [];
        tips = parsed.tips || [];
        estimatedWeeks = parsed.estimatedWeeks || 12;
      }
    } catch {
      // Fallback courses based on field
      const fieldCourses: Record<string, string[]> = {
        'Web Geliştirme': ['HTML & CSS Temelleri', 'JavaScript', 'React', 'Node.js', 'Veritabanı'],
        'Yapay Zeka': ['Python Temelleri', 'Makine Öğrenmesi', 'Derin Öğrenme', 'NLP', 'AI Projeleri'],
        'Blockchain': ['Blockchain Temelleri', 'Solidity', 'Smart Contracts', 'DeFi', 'Web3'],
        'Mobil': ['React Native', 'UI/UX', 'API Entegrasyonu', 'Push Notifications', 'Yayınlama'],
        'Veri Bilimi': ['Python & Pandas', 'İstatistik', 'Veri Görselleştirme', 'SQL', 'ML'],
      };
      courses = fieldCourses[answers.field] || ['Programlama Temelleri', 'Algoritma', 'Proje Geliştirme', 'API', 'Deployment'];
      tips = ['Düzenli pratik yapın', 'Proje tabanlı öğrenin', 'Toplulukta paylaşım yapın'];
    }

    // Save learning path to profile
    try {
      await supabase
        .from('profiles')
        .update({ learning_path: { courses, tips, estimatedWeeks, preferences: answers } })
        .eq('id', userId);
    } catch {
      // ignore
    }

    return NextResponse.json({
      courses,
      pathData: { courses, tips, estimatedWeeks },
    });
  } catch (err) {
    console.error('Learning path POST error:', err);
    return NextResponse.json({ error: 'Sunucu hatası', code: 'SERVER_ERROR' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor', code: 'UNAUTHENTICATED' }, { status: 401 });
    }

    const supabase = createSupabaseServer();
    const { data } = await supabase
      .from('profiles')
      .select('learning_preferences, learning_path')
      .eq('id', userId)
      .single();

    if (!data?.learning_path) {
      return NextResponse.json({ learningPath: null });
    }

    const lp = data.learning_path as { courses: string[]; tips: string[]; estimatedWeeks: number; preferences: Record<string, string> };

    return NextResponse.json({
      learningPath: { courses: lp.courses || [], preferences: lp.preferences || {} },
      pathData: { courses: lp.courses || [], tips: lp.tips || [], estimatedWeeks: lp.estimatedWeeks || 12 },
    });
  } catch (err) {
    console.error('Learning path GET error:', err);
    return NextResponse.json({ error: 'Sunucu hatası', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
