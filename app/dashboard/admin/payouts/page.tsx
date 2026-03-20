import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';
import AdminPayoutsClient from './AdminPayoutsClient';

export default async function AdminPayoutsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('koshei-user-id')?.value;

  if (!userId) {
    notFound();
  }

  const supabase = createSupabaseServer();

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profile || profile.role !== 'admin') {
    notFound();
  }

  return <AdminPayoutsClient />;
}
