import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const STATIC_COURSES = [
  {
    id: '1',
    title: 'Modern Web Geliştirme',
    category: 'Web Geliştirme',
    level: 'Başlangıç',
    duration: '12 saat',
    lessons_count: 24,
    image: '🌐',
    description: 'HTML, CSS, JavaScript ve React ile modern web uygulamaları geliştirin.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Makine Öğrenmesi Temelleri',
    category: 'Yapay Zeka / ML',
    level: 'Orta',
    duration: '18 saat',
    lessons_count: 36,
    image: '🤖',
    description: 'Python ile makine öğrenmesi algoritmalarını öğrenin ve uygulayın.',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Blockchain ve Web3',
    category: 'Blockchain',
    level: 'İleri',
    duration: '20 saat',
    lessons_count: 40,
    image: '⛓️',
    description: 'Solidity, Ethereum ve akıllı sözleşmeler ile Web3 geliştirme.',
    created_at: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const url = new URL(req.url);
    const category = url.searchParams.get('category');
    const level = url.searchParams.get('level');

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !courses?.length) {
      let filtered = STATIC_COURSES;
      if (category) filtered = filtered.filter((c) => c.category === category);
      if (level) filtered = filtered.filter((c) => c.level === level);
      return NextResponse.json({ courses: filtered });
    }

    let filtered = courses;
    if (category) filtered = filtered.filter((c: Record<string, unknown>) => c.category === category);
    if (level) filtered = filtered.filter((c: Record<string, unknown>) => c.level === level);

    return NextResponse.json({ courses: filtered });
  } catch (err) {
    console.error('Courses API error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
