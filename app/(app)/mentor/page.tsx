'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, ChatMessage } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { createSupabaseClient } from '@/lib/supabase/client';

type Feature = 'mentor_lite' | 'mentor_flash';

const featureOptions = [
  { id: 'mentor_lite' as Feature, label: 'Mentor Lite', desc: '0.5 kredi', model: 'Gemini Flash Lite' },
  { id: 'mentor_flash' as Feature, label: 'Mentor Flash', desc: '1.0 kredi', model: 'Gemini Flash' },
];

export default function MentorPage() {
  const { messages, addMessage, updateLastMessage, setMessages, quota, setQuota } = useStore();
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [feature, setFeature] = useState<Feature>('mentor_lite');
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pre-fill from chat intake
  const fromChat = searchParams.get('source') === 'chat';
  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic) setInput(decodeURIComponent(topic));
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Refresh quota after sending a message
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

  const sendMessage = useCallback(async () => {
    if (!input.trim() || streaming) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      feature,
    };

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'model',
      content: '',
      feature,
    };

    addMessage(userMsg);
    addMessage(aiMsg);
    setInput('');
    setStreaming(true);

    try {
      const allMessages = [...messages, userMsg];
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
          feature,
          sessionId,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        const status = response.status;
        let guardMsg = `❌ Hata: ${err.error || 'Bilinmeyen hata'}`;
        if (status === 401) {
          guardMsg = '🔒 **Kimlik doğrulaması gerekli.** Lütfen [giriş yapın](/login).';
        } else if (status === 403) {
          const reason = err.error || '';
          if (reason.includes('kredi') || reason.includes('Yetersiz')) {
            guardMsg = '⚡ **Yetersiz kredi.** [Planını yükselt](/plans) veya mevcut kredinizi kontrol edin.';
          } else if (reason.includes('plan') || reason.includes('Plan')) {
            guardMsg = '📦 **Aktif planınız yok veya süresi dolmuş.** [Planları incele](/plans) ve planını yükselt.';
          } else {
            guardMsg = `🚫 **Erişim reddedildi:** ${reason} — [Planını yükselt](/plans)`;
          }
        }
        updateLastMessage(guardMsg);
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        updateLastMessage(accumulated);
      }
      // Refresh credits after successful response
      await refreshQuota();
    } catch {
      updateLastMessage('❌ Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setStreaming(false);
    }
  }, [input, streaming, feature, messages, sessionId, addMessage, updateLastMessage, refreshQuota]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-black text-white">AI Mentor</h1>
            {fromChat && (
              <span className="text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-lg">
                Chat&apos;ten yönlendirildi
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">Öğrenme, rehberlik ve skill development akışları</p>
        </div>
        <div className="flex items-center gap-2">
          {quota && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-white/5 text-xs text-slate-400">
              <svg className="w-3 h-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-semibold text-white">{Math.floor(quota.credits_remaining)}</span>
              <span>kredi</span>
            </div>
          )}
          {featureOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFeature(opt.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                feature === opt.id
                  ? 'bg-accent-blue text-white'
                  : 'bg-bg-card text-slate-400 hover:text-white border border-white/5'
              )}
            >
              {opt.label}
              <span className="ml-1 opacity-60">{opt.desc}</span>
            </button>
          ))}
          <button
            onClick={() => setMessages([])}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <div className="text-5xl mb-4">🧠</div>
              <h3 className="text-lg font-bold text-white mb-2">Koschei AI Mentor</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Öğrenmek, anlamak veya derinleştirmek istediğin konuyu anlat. Programlama, iş süreçleri, teknik konular ve daha fazlası...
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  'Python&apos;da döngüler nasıl çalışır?',
                  'Makine öğrenmesi nedir?',
                  'React hooks açıkla',
                  'SQL JOIN türleri neler?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion.replace(/&apos;/g, "'"))}
                    className="text-xs text-slate-400 hover:text-white bg-bg-card hover:bg-bg-card-hover border border-white/5 rounded-lg px-3 py-2 transition-all text-left"
                  >
                    {suggestion.replace(/&apos;/g, "'")}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={cn('flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-lg bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-sm shrink-0 mt-0.5">
                🤖
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm',
                msg.role === 'user'
                  ? 'bg-accent-blue text-white rounded-tr-sm'
                  : 'bg-bg-card border border-white/5 text-slate-200 rounded-tl-sm'
              )}
            >
              {msg.role === 'model' ? (
                <div className="markdown-body">
                  {msg.content === '' && streaming && i === messages.length - 1 ? (
                    <div className="flex gap-1 py-1">
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{msg.content}</ReactMarkdown>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm shrink-0 mt-0.5">
                👤
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 bg-bg-card border border-white/8 rounded-2xl p-3 flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bir şey sorun... (Enter ile gönder, Shift+Enter satır ekler)"
          rows={1}
          className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none max-h-32 min-h-[24px] leading-6"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || streaming}
          loading={streaming}
          size="sm"
          className="shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Gönder
        </Button>
      </div>
    </div>
  );
}
