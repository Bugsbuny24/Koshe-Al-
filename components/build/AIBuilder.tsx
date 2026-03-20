'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/store/userStore';

export function AIBuilder() {
  const user = useUserStore((s) => s.user);

  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBuild = async () => {
    if (!prompt.trim() || loading) return;
    if (!user?.id) {
      alert('Önce giriş yapmalısın.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ai/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        alert(
          data?.error === 'pro_required' || data?.error === 'upgrade_required'
            ? 'AI Builder Pro plan gerektirir.'
            : data?.error || 'Bir hata oluştu.'
        );
        return;
      }

      setGeneratedCode(JSON.stringify(data, null, 2));
    } catch {
      alert('Hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-[rgba(240,165,0,0.15)] bg-[#111116] p-5">
      <div>
        <h2 className="text-xl font-bold text-[#F0EDE6]">AI Builder</h2>
        <p className="text-sm text-[#8A8680]">
          Fikrini yaz, Koschei sana proje çıktısı üretsin.
        </p>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Örn: Pi ödemeli veteriner randevu uygulaması oluştur"
        className="min-h-[140px] w-full rounded-xl border border-[rgba(240,165,0,0.15)] bg-[#060608] p-4 text-[#F0EDE6] outline-none placeholder:text-[#666]"
      />

      <Button onClick={handleBuild} loading={loading} disabled={!prompt.trim()}>
        {loading ? 'Üretiliyor...' : 'AI ile Üret'}
      </Button>

      {generatedCode && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[#F0EDE6]">Çıktı</h3>
          <pre className="overflow-x-auto rounded-xl bg-[#060608] p-4 text-xs text-[#D6D2CB]">
            {generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
