import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';

const STATIC_COURSE_DETAILS: Record<string, {
  id: string; title: string; category: string; level: string;
  duration: string; lessons_count: number; image: string;
  description: string; created_at: string;
  lessons: Array<{ id: string; title: string; duration: string; order_index: number }>;
}> = {
  '1': {
    id: '1', title: 'Modern Web Geliştirme', category: 'Web Geliştirme',
    level: 'Başlangıç', duration: '12 saat', lessons_count: 24,
    image: '🌐', created_at: new Date().toISOString(),
    description: 'HTML, CSS, JavaScript ve React ile modern web uygulamaları geliştirin.',
    lessons: [
      { id: 'l1', title: 'HTML Temelleri', duration: '30 dk', order_index: 1 },
      { id: 'l2', title: 'CSS ile Stillendirme', duration: '45 dk', order_index: 2 },
      { id: 'l3', title: 'JavaScript Giriş', duration: '60 dk', order_index: 3 },
      { id: 'l4', title: 'React ile Bileşenler', duration: '50 dk', order_index: 4 },
    ],
  },
  '2': {
    id: '2', title: 'Makine Öğrenmesi Temelleri', category: 'Yapay Zeka / ML',
    level: 'Orta', duration: '18 saat', lessons_count: 36,
    image: '🤖', created_at: new Date().toISOString(),
    description: 'Python ile makine öğrenmesi algoritmalarını öğrenin.',
    lessons: [
      { id: 'l1', title: 'Python Veri Bilimine Giriş', duration: '45 dk', order_index: 1 },
      { id: 'l2', title: 'NumPy ve Pandas', duration: '60 dk', order_index: 2 },
      { id: 'l3', title: 'Scikit-learn ile ML', duration: '75 dk', order_index: 3 },
    ],
  },
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseServer();

    const { data: course } = await supabase
      .from('courses')
      .select('*, lessons(*)')
      .eq('id', id)
      .single();

    if (!course) {
      const staticCourse = STATIC_COURSE_DETAILS[id];
      if (!staticCourse) {
        return NextResponse.json({ error: 'Kurs bulunamadı' }, { status: 404 });
      }
      return NextResponse.json(staticCourse);
    }

    return NextResponse.json(course);
  } catch (err) {
    console.error('Course detail error:', err);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
