'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createSupabaseClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch {
      setError('Beklenmeyen bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-accent-green/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-accent-blue/6 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent-blue flex items-center justify-center text-white font-bold">K</div>
            <span className="font-display font-bold text-2xl text-white">Koschei</span>
          </Link>
          <h1 className="text-2xl font-black text-white">Hesap oluştur</h1>
          <p className="text-slate-400 text-sm mt-2">100 ücretsiz krediyle başla</p>
        </div>

        <div className="bg-bg-card border border-white/8 rounded-2xl p-7">
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-accent-green/15 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Hesabın oluşturuldu!</h2>
              <p className="text-slate-400 text-sm">Dashboard&apos;a yönlendiriliyorsun...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Ad Soyad"
                type="text"
                placeholder="Adın Soyadın"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <Input
                label="E-posta"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <Input
                label="Şifre"
                type="password"
                placeholder="Min. 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" loading={loading} className="w-full" size="lg">
                Ücretsiz Kaydol
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Kaydolarak{' '}
                <a href="#" className="text-accent-blue hover:underline">Kullanım Şartları</a>
                &apos;nı kabul ediyorsun.
              </p>
            </form>
          )}

          {!success && (
            <div className="mt-5 text-center text-sm text-slate-500">
              Zaten hesabın var mı?{' '}
              <Link href="/login" className="text-accent-blue hover:underline font-medium">
                Giriş yap
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
