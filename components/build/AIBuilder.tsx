'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function AIBuilder() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuild = async () => {
  if (!prompt.trim() || loading) return;
  setLoading(true);

  try {
    const res = await fetch('/api/ai/builder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        userId: user?.id,  // ← ekle
      }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error === 'pro_required'
        ? 'AI Builder Pro plan gerektirir.'
        : data.error);
      return;
    }
    setGeneratedCode(JSON.stringify(data, null, 2));
  } catch {
    alert('Hata oluştu');
  } finally {
    setLoading(false);
  }
};
