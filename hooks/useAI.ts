'use client';
import { useState, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SendMessageOptions {
  teacherId?: string;
  lessonContext?: string;
  userId?: string;
}

export function useAI() {
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async (
    messages: Message[],
    options: SendMessageOptions = {}
  ): Promise<string | null> => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          teacherId: options.teacherId,
          lessonContext: options.lessonContext,
          userId: options.userId,
        }),
      });

      if (!res.ok) throw new Error(`AI error: ${res.status}`);

      const reader = res.body?.getReader();
      if (!reader) return null;

      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      return result;
    } catch (err) {
      console.error('AI error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading };
}
