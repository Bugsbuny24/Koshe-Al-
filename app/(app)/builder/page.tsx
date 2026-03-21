'use client';

import { useState, lazy, Suspense, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { createSupabaseClient } from '@/lib/supabase/client';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const LANGUAGES = [
  { id: 'python', label: 'Python', ext: 'py' },
  { id: 'javascript', label: 'JavaScript', ext: 'js' },
  { id: 'typescript', label: 'TypeScript', ext: 'ts' },
  { id: 'rust', label: 'Rust', ext: 'rs' },
  { id: 'go', label: 'Go', ext: 'go' },
  { id: 'java', label: 'Java', ext: 'java' },
  { id: 'cpp', label: 'C++', ext: 'cpp' },
  { id: 'sql', label: 'SQL', ext: 'sql' },
];

export default function BuilderPage() {
  const { quota, setQuota } = useStore();
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Kod burada görünecek\n');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guardType, setGuardType] = useState<'auth' | 'credits' | 'plan' | null>(null);
  const [copied, setCopied] = useState(false);

  // Pre-fill from chat intake
  const fromChat = searchParams.get('source') === 'chat';
  useEffect(() => {
    const chatPrompt = searchParams.get('prompt');
    const chatLang = searchParams.get('lang');
    if (chatPrompt) setPrompt(decodeURIComponent(chatPrompt));
    if (chatLang) {
      const matchedLang = LANGUAGES.find((l) => l.id === chatLang);
      if (matchedLang) setLanguage(matchedLang.id);
    }
  }, [searchParams]);

  const refreshQuota = useCallback(async () => {
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (data && setQuota) setQuota(data);
    } catch {
      // ignore
    }
  }, [setQuota]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setGuardType(null);

    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        const status = res.status;
        const msg = data.error || 'Kod üretimi başarısız';
        if (status === 401) {
          setGuardType('auth');
        } else if (status === 403) {
          if (msg.includes('kredi') || msg.includes('Yetersiz')) {
            setGuardType('credits');
          } else if (msg.includes('plan') || msg.includes('Plan')) {
            setGuardType('plan');
          } else {
            setError(msg);
          }
        } else {
          setError(msg);
        }
        return;
      }

      setCode(data.code);
      // Refresh credits after successful generation
      await refreshQuota();
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const lang = LANGUAGES.find((l) => l.id === language);
    const ext = lang?.ext || language;
    const filename = `koschei-output.${ext}`;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-white">Builder</h1>
            {fromChat && (
              <span className="text-xs font-semibold bg-accent-blue/15 text-accent-blue border border-accent-blue/20 px-2 py-0.5 rounded-lg">
                Chat&apos;ten yönlendirildi
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Doğal dil ile kod üret — Chat ve Execution tarafından beslenebilir</p>
        </div>
        {quota && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-white/5 text-xs text-slate-400">
            <svg className="w-3 h-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="font-semibold text-white">{Math.floor(quota.credits_remaining)}</span>
            <span>kredi kaldı</span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left: Prompt */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
          {/* Language selector */}
          <Card className="p-4">
            <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
              Programlama Dili
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    language === lang.id
                      ? 'bg-accent-blue text-white'
                      : 'bg-bg-deep text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Prompt input */}
          <Card className="p-4 flex-1 flex flex-col">
            <label className="block text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">
              Ne üretmek istiyorsunuz?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`Örnek: "${language === 'python' ? 'Fibonacci dizisi hesaplayan fonksiyon' : 'REST API endpoint oluştur'}" gibi bir şey yazın...`}
              className="flex-1 bg-bg-deep border border-white/8 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-accent-blue/40 transition-colors font-mono"
            />

            {error && (
              <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            {guardType === 'auth' && (
              <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-3 text-sm">
                <p className="text-orange-300 font-semibold mb-2">🔒 Kimlik doğrulaması gerekli</p>
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline">
                  Giriş yap →
                </Link>
              </div>
            )}

            {(guardType === 'credits' || guardType === 'plan') && (
              <div className="mt-3 bg-pi-gold/10 border border-pi-gold/20 rounded-lg px-3 py-3 text-sm">
                <p className="text-pi-gold font-semibold mb-1">
                  {guardType === 'credits' ? '⚡ Yetersiz kredi' : '📦 Aktif plan yok'}
                </p>
                <p className="text-slate-400 text-xs mb-2">
                  {guardType === 'credits'
                    ? 'Kod üretmek için yeterli krediniz yok.'
                    : 'Aktif planınız yok veya süresi dolmuş.'}
                </p>
                <div className="flex gap-2">
                  <Link href="/plans" className="inline-flex items-center gap-1 text-xs bg-accent-blue text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity">
                    Planını yükselt →
                  </Link>
                  <Link href="/plans" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                    Kredini kontrol et
                  </Link>
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              loading={loading}
              disabled={!prompt.trim()}
              className="mt-4 w-full"
              size="lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Kod Üret
              <span className="ml-1 text-xs opacity-70">5 kredi</span>
            </Button>

            {/* Suggestions */}
            <div className="mt-4">
              <p className="text-xs text-slate-600 mb-2">Hızlı başlangıç:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Fibonacci dizisi',
                  'REST API endpoint',
                  'Binary search algoritması',
                  'Sorting algoritması',
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setPrompt(s)}
                    className="text-xs text-slate-500 hover:text-slate-300 bg-bg-deep hover:bg-bg-card border border-white/5 rounded-lg px-2.5 py-1 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Right: Editor */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <Card className="flex-1 overflow-hidden flex flex-col">
            {/* Editor toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-pi-gold/50" />
                <div className="w-3 h-3 rounded-full bg-accent-green/50" />
                <span className="ml-2 text-xs text-slate-500 font-mono">
                  output.{LANGUAGES.find((l) => l.id === language)?.ext || language}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
                  title="Dosya olarak indir"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  İndir
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Kopyalandı!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Kopyala
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500 text-sm">Editör yükleniyor...</div>}>
                <MonacoEditor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(v) => setCode(v || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: 'DM Mono, monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderLineHighlight: 'line',
                    padding: { top: 12 },
                    smoothScrolling: true,
                  }}
                />
              </Suspense>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
