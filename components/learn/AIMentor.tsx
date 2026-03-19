'use client';
import { useState, useRef, useEffect } from 'react';
import { useAI } from '@/hooks/useAI';
import { Button } from '@/components/ui/Button';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIMentorProps {
  courseId?: string;
  lessonId?: string;
  teacherId?: string;
}

export function AIMentor({ courseId, lessonId, teacherId }: AIMentorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Merhaba! Ben senin AI mentor\'un. Ders hakkında sorularını yanıtlamaya hazırım. 🤖' },
  ]);
  const [input, setInput] = useState('');
  const { sendMessage, loading } = useAI();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    const response = await sendMessage(newMessages, {
      teacherId,
      lessonContext: `${courseId} - Ders ${lessonId}`,
    });

    if (response) {
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] h-[500px]">
      <div className="border-b border-[rgba(240,165,0,0.12)] px-4 py-3">
        <h3 className="font-semibold text-sm">🤖 AI Mentor</h3>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-[#F0A500] text-[#060608]'
                  : 'bg-[#16161E] text-[#F0EDE6]'
              }`}
            >
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#16161E] rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-[#F0A500] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#F0A500] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-2 w-2 rounded-full bg-[#F0A500] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-[rgba(240,165,0,0.12)] p-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Bir soru sor..."
          className="flex-1 rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#0C0C10] px-4 py-2.5 text-sm text-[#F0EDE6] placeholder:text-[#4A4845] focus:border-[#F0A500] focus:outline-none"
          disabled={loading}
        />
        <Button onClick={handleSend} loading={loading} size="sm">
          Gönder
        </Button>
      </div>
    </div>
  );
}
