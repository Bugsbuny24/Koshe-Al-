'use client';

import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const LANGUAGES = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'sql', label: 'SQL' },
];

export default function BuilderPage() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Kod burada görünecek\n');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Kod üretimi başarısız');
        return;
      }

      setCode(data.code);
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

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-black text-white">Kod Üretici</h1>
        <p className="text-slate-500 text-sm">Gemini Pro ile kod üretin — 5 kredi/istek</p>
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
                <span className="ml-2 text-xs text-slate-500 font-mono">output.{language === 'python' ? 'py' : language === 'typescript' ? 'ts' : language === 'javascript' ? 'js' : language}</span>
              </div>
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
