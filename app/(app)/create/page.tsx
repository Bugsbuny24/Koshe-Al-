'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { createSupabaseClient } from '@/lib/supabase/client';

type Tab = 'image' | 'tts' | 'video';

const IMAGE_STYLES = [
  { id: 'realistic', label: 'Gerçekçi' },
  { id: 'anime', label: 'Anime' },
  { id: 'digital-art', label: 'Dijital Sanat' },
  { id: 'oil-painting', label: 'Yağlı Boya' },
  { id: 'minimalist', label: 'Minimalist' },
];

const VOICE_OPTIONS = [
  { id: 'male', label: 'Erkek', voiceName: 'Charon' },
  { id: 'female', label: 'Kadın', voiceName: 'Aoede' },
  { id: 'neutral', label: 'Nötr', voiceName: 'Fenrir' },
];

const SPEED_OPTIONS = [
  { id: 'slow', label: 'Yavaş' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Hızlı' },
];

export default function CreatePage() {
  const { quota, setQuota, addGeneratedImage } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('image');

  // Image state
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState('realistic');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState('image/png');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  // TTS state
  const [ttsText, setTtsText] = useState('');
  const [ttsVoice, setTtsVoice] = useState('female');
  const [ttsSpeed, setTtsSpeed] = useState('normal');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Video state
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState('');

  const refreshQuota = useCallback(async () => {
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('user_quotas').select('*').eq('user_id', user.id).single();
      if (data) setQuota(data);
    } catch {
      // ignore
    }
  }, [setQuota]);

  const getAuthHeader = async (): Promise<string | null> => {
    const supabase = createSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ? `Bearer ${session.access_token}` : null;
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setImageLoading(true);
    setImageError('');
    setGeneratedImage(null);
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ prompt: imagePrompt, style: imageStyle }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImageError(data.error || 'Görsel üretilemedi');
        return;
      }
      const dataUrl = `data:${data.mimeType || 'image/png'};base64,${data.image}`;
      setGeneratedImage(dataUrl);
      setImageMime(data.mimeType || 'image/png');
      addGeneratedImage({ id: crypto.randomUUID(), url: dataUrl, prompt: imagePrompt, created_at: new Date().toISOString() });
      await refreshQuota();
    } catch {
      setImageError('Bir hata oluştu');
    } finally {
      setImageLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    const ext = imageMime.includes('png') ? 'png' : 'jpg';
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `koschei-image-${Date.now()}.${ext}`;
    a.click();
  };

  const handleGenerateTTS = async () => {
    if (!ttsText.trim()) return;
    setTtsLoading(true);
    setTtsError('');
    setAudioUrl(null);
    try {
      const authHeader = await getAuthHeader();
      const voiceObj = VOICE_OPTIONS.find((v) => v.id === ttsVoice);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ text: ttsText, voice: voiceObj?.voiceName || 'Aoede', speed: ttsSpeed }),
      });
      if (!res.ok) {
        const data = await res.json();
        setTtsError(data.error || 'Ses üretilemedi');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      await refreshQuota();
    } catch {
      setTtsError('Bir hata oluştu');
    } finally {
      setTtsLoading(false);
    }
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `koschei-audio-${Date.now()}.mp3`;
    a.click();
  };

  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) return;
    setVideoLoading(true);
    setVideoError('');
    setVideoUrl(null);
    try {
      const authHeader = await getAuthHeader();
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify({ prompt: videoPrompt, duration: 15 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVideoError(data.error || 'Video üretilemedi');
        return;
      }
      setVideoUrl(data.videoUrl);
      await refreshQuota();
    } catch {
      setVideoError('Bir hata oluştu');
    } finally {
      setVideoLoading(false);
    }
  };

  const plan = quota?.plan_id || 'starter';
  const canImage = ['pro', 'prestige'].includes(plan);
  const canVideo = plan === 'prestige';

  const tabs: { id: Tab; label: string; cost: string }[] = [
    { id: 'image', label: 'Görsel Üret', cost: '10 kredi' },
    { id: 'tts', label: 'Ses Üret', cost: '0.5 kredi' },
    { id: 'video', label: 'Video Üret', cost: '50 kredi' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">✨ Oluştur</h1>
        <p className="text-slate-400 mt-1">Yapay zeka ile görsel, ses ve video üret</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-bg-deep rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="block text-xs font-normal opacity-70">{tab.cost}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Görsel Üret */}
        {activeTab === 'image' && (
          <motion.div key="image" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {!canImage ? (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-lg font-bold text-white mb-2">Pro Plan Gerekli</h3>
                <p className="text-slate-400 text-sm mb-4">Görsel üretici Pro veya Prestige planı gerektirir.</p>
                <Button onClick={() => window.location.href = '/plans'} variant="primary">Planı Yükselt</Button>
              </Card>
            ) : (
              <Card className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Üretmek istediğiniz görseli Türkçe olarak tanımlayın..."
                    rows={4}
                    className="w-full bg-bg-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/40 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Stil</label>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_STYLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setImageStyle(s.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          imageStyle === s.id
                            ? 'bg-accent-blue text-white'
                            : 'bg-bg-deep text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {imageError && <p className="text-red-400 text-sm">{imageError}</p>}
                <Button
                  onClick={handleGenerateImage}
                  loading={imageLoading}
                  disabled={!imagePrompt.trim() || imageLoading}
                  variant="primary"
                  className="w-full"
                >
                  {imageLoading ? 'Üretiliyor...' : '🎨 Görsel Üret (10 kredi)'}
                </Button>
                {generatedImage && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                    <img
                      src={generatedImage}
                      alt="Üretilen görsel"
                      className="w-full rounded-xl border border-white/10"
                    />
                    <div className="flex gap-2">
                      <Button onClick={handleDownloadImage} variant="secondary" className="flex-1">
                        ⬇ İndir
                      </Button>
                      <Button
                        onClick={() => {
                          const supabase = createSupabaseClient();
                          supabase.auth.getUser().then(({ data: { user } }) => {
                            if (!user) return;
                            supabase.from('user_generated_images').insert({
                              user_id: user.id,
                              url: generatedImage,
                              prompt: imagePrompt,
                              style: imageStyle,
                            }).then(() => alert('Galeriye kaydedildi!'));
                          });
                        }}
                        variant="secondary"
                        className="flex-1"
                      >
                        💾 Galeriye Kaydet
                      </Button>
                    </div>
                  </motion.div>
                )}
              </Card>
            )}
          </motion.div>
        )}

        {/* Ses Üret */}
        {activeTab === 'tts' && (
          <motion.div key="tts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Metin <span className="text-slate-500">({ttsText.length}/500)</span>
                </label>
                <textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value.slice(0, 500))}
                  placeholder="Sese dönüştürmek istediğiniz metni girin..."
                  rows={4}
                  maxLength={500}
                  className="w-full bg-bg-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/40 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ses</label>
                  <div className="flex flex-col gap-2">
                    {VOICE_OPTIONS.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setTtsVoice(v.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                          ttsVoice === v.id
                            ? 'bg-accent-blue text-white'
                            : 'bg-bg-deep text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hız</label>
                  <div className="flex flex-col gap-2">
                    {SPEED_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setTtsSpeed(s.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                          ttsSpeed === s.id
                            ? 'bg-accent-blue text-white'
                            : 'bg-bg-deep text-slate-400 hover:text-white border border-white/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {ttsError && <p className="text-red-400 text-sm">{ttsError}</p>}
              <Button
                onClick={handleGenerateTTS}
                loading={ttsLoading}
                disabled={!ttsText.trim() || ttsLoading}
                variant="primary"
                className="w-full"
              >
                {ttsLoading ? 'Üretiliyor...' : '🎙 Ses Üret (0.5 kredi)'}
              </Button>
              {audioUrl && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-3">
                  <div className="bg-bg-deep rounded-xl p-4">
                    <audio ref={audioRef} controls src={audioUrl} className="w-full" />
                  </div>
                  <Button onClick={handleDownloadAudio} variant="secondary" className="w-full">
                    ⬇ MP3 Olarak İndir
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Video Üret */}
        {activeTab === 'video' && (
          <motion.div key="video" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {!canVideo ? (
              <Card className="p-8 text-center">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-lg font-bold text-white mb-2">Prestige Plan Gerekli</h3>
                <p className="text-slate-400 text-sm mb-4">Video üretici yalnızca Prestige planı ile kullanılabilir.</p>
                <Button onClick={() => window.location.href = '/plans'} variant="primary">Prestige&apos;e Geç</Button>
              </Card>
            ) : (
              <Card className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Üretmek istediğiniz videoyu tanımlayın..."
                    rows={4}
                    className="w-full bg-bg-deep border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-accent-blue/40 text-sm resize-none"
                  />
                </div>
                <div className="flex items-center gap-3 bg-bg-deep rounded-xl p-4">
                  <span className="text-slate-400 text-sm">Süre:</span>
                  <span className="text-white font-medium">15 saniye</span>
                </div>
                {videoError && <p className="text-red-400 text-sm">{videoError}</p>}
                <Button
                  onClick={handleGenerateVideo}
                  loading={videoLoading}
                  disabled={!videoPrompt.trim() || videoLoading}
                  variant="primary"
                  className="w-full"
                >
                  {videoLoading ? 'Video oluşturuluyor...' : '🎬 Video Üret (50 kredi)'}
                </Button>
                {videoUrl && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <video controls src={videoUrl} className="w-full rounded-xl border border-white/10" />
                  </motion.div>
                )}
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
