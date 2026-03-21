'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { useStore } from '@/store/useStore';
import { createSupabaseClient } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setProfile, setQuota, sidebarOpen } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createSupabaseClient();

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const [profileRes, quotaRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_quotas').select('*').eq('user_id', user.id).single(),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (quotaRes.data) setQuota(quotaRes.data);
    };

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [router, setProfile, setQuota]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-void flex items-center justify-center">
        <div
          role="status"
          aria-label="Yükleniyor"
          className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-void">
      <Sidebar />
      <main
        className="transition-all duration-250 ease-in-out"
        style={{ marginLeft: sidebarOpen ? '256px' : '0' }}
      >
        {/* Mobile header */}
        <div className="lg:hidden h-14 flex items-center px-4 border-b border-white/5 bg-bg-deep">
          <button
            onClick={() => useStore.getState().toggleSidebar()}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
