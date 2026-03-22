'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { UserBubble, AssistantBubble, TypingIndicator } from './ChatBubble';
import { ConversationSummaryCard } from './ConversationSummaryCard';
import { NextActionCard } from './NextActionCard';
import type { ChatMessage, ChatTurnResult } from '@/types/intake';

const QUICK_STARTS = [
  'Otelim için rezervasyon alabilen WhatsApp botu istiyorum',
  'Bir landing page oluştur',
  'Python ile CSV analiz kodu yaz',
  'React hooks nasıl çalışır, anlat',
  'E-ticaret sitesi için MVP planı',
  'Zapier ile mail otomasyonu kur',
];

export function IntakeChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [lastTurn, setLastTurn] = useState<ChatTurnResult | null>(null);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Scroll to bottom after each new message or typing indicator change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, lastTurn]);

  const sendMessage = useCallback(async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || typing) return;

    // Append user bubble immediately
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setTyping(true);
    setError('');
    setLastTurn(null);

    // Small artificial delay for typing feel
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? 'Bir hata oluştu, lütfen tekrar deneyin.');
        setTyping(false);
        return;
      }

      const turn = data.data as ChatTurnResult;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: turn.assistant_visible_reply },
      ]);
      setLastTurn(turn);
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setTyping(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [input, typing]);

  const handleReset = () => {
    setMessages([]);
    setLastTurn(null);
    setError('');
    setInput('');
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const isIdle = messages.length === 0 && !typing;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      {/* Greeting — shown only before any message */}
      <AnimatePresence>
        {isIdle && (
          <motion.div
            key="greeting"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-8"
          >
            <div className="text-5xl mb-4">👋</div>
            <h2 className="text-xl font-bold text-white mb-2">Ne üretmek istiyorsun?</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              İhtiyacını doğal dille yaz. Koschei seni doğru akışa yönlendirecek.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conversation messages */}
      {messages.length > 0 && (
        <div className="space-y-4 px-1">
          {messages.map((msg, i) => {
            const isLastAssistant =
              msg.role === 'assistant' && i === messages.length - 1 && !typing;

            if (msg.role === 'user') {
              return <UserBubble key={i} content={msg.content} />;
            }

            return (
              <div key={i} className="space-y-3">
                <AssistantBubble content={msg.content} />

                {/* Summary + recommendation only for the latest assistant turn */}
                {isLastAssistant && lastTurn && (
                  <>
                    {lastTurn.visible_summary && (
                      <ConversationSummaryCard summary={lastTurn.visible_summary} />
                    )}

                    {lastTurn.visible_recommendation_title &&
                      lastTurn.visible_recommendation_body &&
                      lastTurn.cta && (
                        <NextActionCard
                          title={lastTurn.visible_recommendation_title}
                          body={lastTurn.visible_recommendation_body}
                          ctaLabel={lastTurn.cta.label}
                          ctaHref={lastTurn.cta.href}
                          onReset={handleReset}
                        />
                      )}
                  </>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {typing && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </div>
      )}

      {/* Single turn typing state (no messages yet) */}
      {messages.length === 0 && typing && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <TypingIndicator />
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-xs text-center">{error}</p>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-bg-card border border-white/8 rounded-2xl p-4 space-y-3 sticky bottom-4"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bir şeyler yaz..."
          rows={2}
          className="w-full bg-transparent text-slate-200 placeholder-slate-600 text-sm resize-none focus:outline-none leading-relaxed"
          disabled={typing}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">Enter ile gönder</span>
          <Button
            onClick={() => void sendMessage()}
            loading={typing}
            disabled={!input.trim() || typing}
            size="sm"
          >
            {typing ? 'Düşünüyor...' : 'Gönder →'}
          </Button>
        </div>
      </motion.div>

      {/* Quick starts — only before first message */}
      <AnimatePresence>
        {isIdle && (
          <motion.div
            key="quick-starts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-slate-600 mb-3 text-center">Hızlı başlangıç örnekleri:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {QUICK_STARTS.map((qs) => (
                <button
                  key={qs}
                  onClick={() => void sendMessage(qs)}
                  className="text-left text-xs text-slate-400 hover:text-white bg-bg-card hover:bg-bg-card-hover border border-white/5 rounded-xl px-3 py-2.5 transition-all"
                >
                  {qs}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

