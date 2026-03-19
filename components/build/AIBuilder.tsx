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
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setGeneratedCode(data.code);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
        <h2 className="font-semibold mb-4">Ne inşa etmek istiyorsun?</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Örnek: Pi Network için bir NFT marketplace, Türkçe öğrenim uygulaması..."
          rows={4}
          className="w-full rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#0C0C10] px-4 py-3 text-[#F0EDE6] placeholder:text-[#4A4845] focus:border-[#F0A500] focus:outline-none resize-none"
        />
        <Button onClick={handleBuild} loading={loading} className="mt-3">
          🤖 AI ile Üret
        </Button>
      </div>

      {generatedCode && (
        <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
          <h2 className="font-semibold mb-4">Üretilen Kod</h2>
          <pre className="overflow-auto rounded-lg bg-[#0C0C10] p-4 text-sm text-[#F0EDE6] font-mono max-h-96">
            {generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
