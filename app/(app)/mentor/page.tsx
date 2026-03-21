'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function MentorPage() {
  const { messages, addMessage, updateLastMessage, setMessages, quota, setQuota } = useStore();
  const [input, setInput] = useState('');
  const [feature, setFeature] = useState<Feature>('mentor_lite');
  const [streaming, setStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [learningPrefs, setLearningPrefs] = useState<Record<string, string> | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState<{ summary: string; keyPoints: string[]; nextSteps: string[] } | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load learning preferences
  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const supabase = createSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase.from('profiles').select('learning_preferences').eq('id', user.id).single();
        if (data?.learning_preferences) {
          setLearningPrefs(data.learning_preferences as Record<string, string>);
        }
      } catch {
        // ignore
      }
    };
    loadPrefs();
  }, []);

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
          learningPrefs,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        updateLastMessage(`❌ Hata: ${err.error || 'Bilinmeyen hata'}`);
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
  }, [input, streaming, feature, messages, sessionId, learningPrefs, addMessage, updateLastMessage, refreshQuota]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleGenerateQuiz = async () => {
    if (messages.length === 0) return;
    setQuizLoading(true);
    setShowQuiz(true);
    setQuizSubmitted(false);
    setQuizAnswers([]);
    try {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/mentor/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (res.ok) {
        const data = await res.json();
        setQuizQuestions(data.questions || []);
      }
    } catch {
      // ignore
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (messages.length === 0) return;
    setSummaryLoading(true);
    setSummary(null);
    try {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/mentor/summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ messages: messages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      }
    } catch {
      // ignore
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-black text-white">AI Mentor</h1>
          <p className="text-slate-500 text-sm">Yapay zeka öğretmeninizle sohbet edin</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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
          {messages.length > 0 && (
            <>
              <button
                onClick={handleSummarize}
                disabled={summaryLoading}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-accent-blue/10 border border-white/5 transition-all"
              >
                {summaryLoading ? '...' : '📋 Özet'}
              </button>
              <button
                onClick={handleGenerateQuiz}
                disabled={quizLoading}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-accent-green/10 border border-white/5 transition-all"
              >
                {quizLoading ? '...' : '🎯 Quiz'}
              </button>
            </>
          )}
          <button
            onClick={() => window.location.href = '/learning-path'}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
          >
            🗺 Öğrenme Yolum
          </button>
          <button
            onClick={() => setMessages([])}
            className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            Temizle
          </button>
        </div>
      </div>

      {/* Summary Panel */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-sm">📋 Sohbet Özeti</h3>
              <button onClick={() => setSummary(null)} className="text-slate-500 hover:text-white text-xs">✕</button>
            </div>
            <p className="text-slate-300 text-sm mb-3">{summary.summary}</p>
            {summary.keyPoints.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-slate-400 mb-1">Ana Noktalar:</p>
                <ul className="space-y-1">
                  {summary.keyPoints.map((k, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1"><span className="text-accent-blue">•</span>{k}</li>
                  ))}
                </ul>
              </div>
            )}
            {summary.nextSteps.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate-400 mb-1">Sonraki Adımlar:</p>
                <ul className="space-y-1">
                  {summary.nextSteps.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1"><span className="text-accent-green">→</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Panel */}
      <AnimatePresence>
        {showQuiz && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 bg-accent-green/5 border border-accent-green/20 rounded-xl p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-sm">🎯 Quiz</h3>
              <button onClick={() => setShowQuiz(false)} className="text-slate-500 hover:text-white text-xs">✕</button>
            </div>
            {quizLoading ? (
              <p className="text-slate-400 text-sm">Quiz oluşturuluyor...</p>
            ) : quizQuestions.length === 0 ? (
              <p className="text-slate-400 text-sm">Quiz oluşturulamadı.</p>
            ) : (
              <div className="space-y-4">
                {quizQuestions.map((q, qi) => (
                  <div key={qi}>
                    <p className="text-sm font-medium text-white mb-2">{qi + 1}. {q.question}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt, oi) => {
                        const isSelected = quizAnswers[qi] === oi;
                        const isCorrect = quizSubmitted && oi === q.correctIndex;
                        const isWrong = quizSubmitted && isSelected && oi !== q.correctIndex;
                        return (
                          <button
                            key={oi}
                            onClick={() => {
                              if (quizSubmitted) return;
                              const newAnswers = [...quizAnswers];
                              newAnswers[qi] = oi;
                              setQuizAnswers(newAnswers);
                            }}
                            className={cn(
                              'text-xs px-3 py-2 rounded-lg border text-left transition-all',
                              isCorrect ? 'bg-accent-green/20 border-accent-green/40 text-accent-green' :
                              isWrong ? 'bg-red-500/20 border-red-500/40 text-red-400' :
                              isSelected ? 'bg-accent-blue/20 border-accent-blue/40 text-accent-blue' :
                              'bg-bg-deep border-white/10 text-slate-400 hover:border-white/20'
                            )}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!quizSubmitted && quizAnswers.length === quizQuestions.length && (
                  <Button onClick={() => setQuizSubmitted(true)} variant="primary" className="w-full text-sm">
                    Cevapları Kontrol Et
                  </Button>
                )}
                {quizSubmitted && (
                  <p className="text-sm text-accent-green font-medium">
                    ✓ Puan: {quizAnswers.filter((a, i) => a === quizQuestions[i].correctIndex).length}/{quizQuestions.length}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
                Her konuyu sorabilirsiniz. Matematik, programlama, dil öğrenimi, tarih... AI mentörünüz hazır!
              </p>
              {learningPrefs && (
                <div className="mt-3 px-3 py-2 bg-accent-blue/5 border border-accent-blue/20 rounded-lg text-xs text-accent-blue">
                  🎯 {learningPrefs.field} alanında {learningPrefs.level} seviyesi için kişiselleştirildi
                </div>
              )}
              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  "Python'da döngüler nasıl çalışır?",
                  'Makine öğrenmesi nedir?',
                  'React hooks açıkla',
                  'SQL JOIN türleri neler?',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-xs text-slate-400 hover:text-white bg-bg-card hover:bg-bg-card-hover border border-white/5 rounded-lg px-3 py-2 transition-all text-left"
                  >
                    {suggestion}
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
