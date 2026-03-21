import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const TEMPLATES = [
  {
    id: 'hotel-landing',
    icon: '🏨',
    title: 'Hotel Landing Page Pack',
    desc: 'Rezervasyon odaklı landing page için hazır kopya yapısı, CTA haritası ve başlık seti.',
    tags: ['Landing Page', 'CTA', 'Headlines'],
    color: 'blue' as const,
  },
  {
    id: 'hotel-whatsapp',
    icon: '💬',
    title: 'Hotel WhatsApp Booking Pack',
    desc: 'WhatsApp üzerinden rezervasyon dönüşümü için script ve takip mesajları.',
    tags: ['WhatsApp', 'Booking', 'Script'],
    color: 'green' as const,
  },
  {
    id: 'hotel-offer',
    icon: '🎯',
    title: 'Hotel Offer Pack',
    desc: 'Özel teklif ve kampanya sayfaları için metin şablonları ve aciliyet kopyaları.',
    tags: ['Offer', 'Campaign', 'Urgency'],
    color: 'gold' as const,
  },
];

const GLOW_COLORS = {
  blue: 'border-accent-blue/20',
  green: 'border-accent-green/20',
  gold: 'border-pi-gold/20',
};

const BADGE_COLORS = {
  blue: 'bg-accent-blue/10 text-accent-blue',
  green: 'bg-accent-green/10 text-accent-green',
  gold: 'bg-pi-gold/10 text-pi-gold',
};

export default function TemplatesPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Templates</h1>
          <p className="text-slate-400 mt-1 text-sm">Hotel odaklı hazır proje şablonları.</p>
        </div>
        <Link href="/projects/new">
          <Button size="sm">⚡ Boş Proje Oluştur</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TEMPLATES.map((t) => (
          <div key={t.id} className={`bg-bg-card border rounded-xl p-6 flex flex-col gap-4 ${GLOW_COLORS[t.color]}`}>
            <div className="text-3xl">{t.icon}</div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-2">{t.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{t.desc}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.tags.map((tag) => (
                <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE_COLORS[t.color]}`}>
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/projects/new?template=${t.id}`}>
              <Button variant="outline" size="sm" className="w-full">
                Bu Şablonu Kullan
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-bg-card border border-white/5 rounded-xl p-6 text-center">
        <p className="text-slate-500 text-sm">Daha fazla şablon yakında eklenecek. Şimdilik boş proje ile başla.</p>
      </div>
    </div>
  );
}
