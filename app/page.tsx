'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: '35M+', label: 'Pioneer' },
  { value: '63', label: 'Dil' },
  { value: '50+', label: 'Kurs' },
  { value: 'π', label: 'Para Birimi' },
];

const PILLARS = [
  {
    num: '01',
    icon: '🎓',
    title: 'Öğren',
    desc: 'Next.js, React, Python, C++, Blockchain, AI — AI destekli kişisel mentor eşliğinde her seviyeden kurs ve üniversite programları.',
    tag: '50+ Kurs',
  },
  {
    num: '02',
    icon: '⚡',
    title: 'Üret',
    desc: 'Kod bilmesen de sorun değil. Ne istediğini yaz, AI üretsin. Web uygulaması, Pi uygulaması, akıllı sözleşme — herkes yaratabilir.',
    tag: 'AI Builder',
  },
  {
    num: '03',
    icon: '🚀',
    title: 'Deploy Et',
    desc: 'Tek tıkla Pi Network ekosistemine yayınla. Pi Browser native desteği, 35M kullanıcıya anında erişim.',
    tag: 'Pi Native',
  },
  {
    num: '04',
    icon: '💰',
    title: 'Kazan',
    desc: 'Kurs sat, freelance iş al, AI modül yayınla. Her beceriniz bir gelir kaynağına dönüşür — hepsi Pi ile.',
    tag: 'Pi Ödemesi',
  },
];

const FEATURES = [
  {
    label: 'AI Mentor',
    title: '7/24 kişisel öğretmen.',
    desc: 'Her soruyu sor. Kodu debug et. Kariyerin için yol haritası al. AI mentorun senin dilinde konuşur, senin hızında ilerler.',
  },
  {
    label: 'Blockchain Sertifika',
    title: 'Gerçekten değerli belgeler.',
    desc: 'Kursu tamamla, Pi blockchain sertifikası kazan. Değiştirilemez, doğrulanabilir, küresel geçerlilikte.',
  },
  {
    label: 'Modül Marketi',
    title: 'Yap. Sat. Kazan.',
    desc: 'AI modülünü yayınla, başkaları kullansın. Her kullanımda Pi kazan. Gerçek pasif gelir.',
  },
];

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,165,0,${p.opacity})`;
        ctx.fill();
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(240,165,0,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#060608',
        color: '#F0EDE6',
        fontFamily: "'Cabinet Grotesk', 'Syne', sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(240,165,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,165,0,0.03) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* NAV */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 40px',
          borderBottom: '1px solid rgba(240,165,0,0.1)',
          background: 'rgba(6,6,8,0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22, letterSpacing: -0.5 }}>
          KO<span style={{ color: '#F0A500' }}>Ш</span>EI
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Öğren', 'Üret', 'Kazan'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontSize: 13,
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#8A8680',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#F0EDE6')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#8A8680')}
            >
              {item}
            </a>
          ))}
          <Link
            href="/login"
            style={{
              background: '#F0A500',
              color: '#000',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '10px 24px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#fff';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#F0A500';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Giriş Yap →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '120px 24px 80px',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(240,165,0,0.07) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid rgba(240,165,0,0.35)',
            padding: '6px 18px',
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#F0A500',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 40,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(-16px)',
            transition: 'all 0.7s ease',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#F0A500',
              animation: 'pulse 1.5s ease infinite',
            }}
          />
          Pi Network Native · AI Powered
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(56px, 10vw, 120px)',
            lineHeight: 0.92,
            letterSpacing: '-0.03em',
            marginBottom: 24,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s ease 0.1s',
          }}
        >
          Learn.
          <br />
          <span style={{ color: '#F0A500' }}>Build.</span>
          <br />
          <span style={{ color: '#8A8680', fontWeight: 400, fontSize: '0.5em', letterSpacing: '0.02em' }}>
            Pi Network&apos;in AI İşletim Sistemi
          </span>
        </h1>

        {/* Sub */}
        <p
          style={{
            fontSize: 17,
            color: '#8A8680',
            maxWidth: 520,
            lineHeight: 1.65,
            marginBottom: 48,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s ease 0.2s',
          }}
        >
          Yazılım öğren, AI ile uygulama üret, Pi Network&apos;e deploy et, Pi kazan.
          Hiç kod bilmesen bile.
        </p>

        {/* CTA */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.7s ease 0.3s',
          }}
        >
          <Link
            href="/login"
            style={{
              background: '#F0A500',
              color: '#000',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '16px 40px',
              textDecoration: 'none',
              transition: 'all 0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(240,165,0,0.35)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            Pi ile Başla →
          </Link>
          <a
            href="#features"
            style={{
              background: 'transparent',
              color: '#8A8680',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '0.04em',
              padding: '16px 32px',
              border: '1px solid rgba(240,165,0,0.2)',
              textDecoration: 'none',
              transition: 'all 0.3s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,0.5)';
              (e.currentTarget as HTMLElement).style.color = '#F0EDE6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,0.2)';
              (e.currentTarget as HTMLElement).style.color = '#8A8680';
            }}
          >
            Keşfet ↓
          </a>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            marginTop: 80,
            paddingTop: 48,
            borderTop: '1px solid rgba(240,165,0,0.1)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            opacity: mounted ? 1 : 0,
            transition: 'all 0.7s ease 0.4s',
          }}
        >
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 38,
                  color: '#F0A500',
                  letterSpacing: '-0.02em',
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: '#4A4845',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section
        id="features"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '120px 40px',
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#F0A500',
            marginBottom: 16,
          }}
        >
          // Temel Katmanlar
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 64,
            maxWidth: 560,
          }}
        >
          Her şey tek platformda.
        </h2>

        <div
          id="Öğren"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 1,
            background: 'rgba(240,165,0,0.1)',
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.num}
              style={{
                background: '#111116',
                padding: '48px 36px',
                transition: 'background 0.3s',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#16161E')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#111116')}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 11,
                  color: '#4A4845',
                  letterSpacing: '0.1em',
                  marginBottom: 32,
                }}
              >
                {p.num}
              </div>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{p.icon}</div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: '-0.02em',
                  marginBottom: 12,
                }}
              >
                {p.title}
              </div>
              <p style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.65 }}>{p.desc}</p>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: 24,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F0A500',
                  border: '1px solid rgba(240,165,0,0.3)',
                  padding: '4px 10px',
                }}
              >
                {p.tag}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '120px 40px',
          background: '#0C0C10',
          borderTop: '1px solid rgba(240,165,0,0.08)',
          borderBottom: '1px solid rgba(240,165,0,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#F0A500',
            marginBottom: 16,
          }}
        >
          // Özellikler
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 64,
          }}
        >
          Farklı üretildi.
        </h2>

        {/* AI Builder Terminal Feature */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            background: 'rgba(240,165,0,0.08)',
            marginBottom: 2,
          }}
        >
          <div style={{ background: '#111116', padding: '48px' }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#F0A500',
                marginBottom: 20,
              }}
            >
              AI Builder
            </div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 700,
                fontSize: 28,
                letterSpacing: '-0.02em',
                marginBottom: 16,
                lineHeight: 1.15,
              }}
            >
              Tanımla.<br />Koshei üretsin.
            </h3>
            <p style={{ fontSize: 15, color: '#8A8680', lineHeight: 1.65 }}>
              Ne istediğini düz dille yaz. AI baştan sona, production-ready uygulama üretir —
              web sitesi, Pi uygulaması, akıllı sözleşme — kod bilgisi gerekmez.
            </p>
          </div>

          {/* Terminal */}
          <div
            style={{
              background: '#000',
              padding: '32px',
              border: 'none',
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              lineHeight: 1.8,
            }}
          >
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(240,165,0,0.1)' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }} />
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#28CA42', display: 'inline-block' }} />
            </div>
            <div style={{ color: '#4A4845' }}>koshei <span style={{ color: '#F0A500' }}>~</span> ai-builder</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#F0A500' }}>›</span>{' '}
              <span style={{ color: '#F0EDE6' }}>&quot;Pi için el sanatları marketi yap&quot;</span>
            </div>
            <div style={{ marginTop: 12, color: '#00D16C' }}>✓ İhtiyaçlar analiz ediliyor...</div>
            <div style={{ color: '#00D16C' }}>✓ Next.js projesi oluşturuluyor...</div>
            <div style={{ color: '#00D16C' }}>✓ Pi SDK entegre ediliyor...</div>
            <div style={{ color: '#00D16C' }}>✓ Supabase şeması kuruluyor...</div>
            <div style={{ color: '#00D16C' }}>✓ Pi Browser&apos;a deploy hazır</div>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#F0A500' }}>›</span>{' '}
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 14,
                  background: '#F0A500',
                  animation: 'blink 1s step-end infinite',
                  verticalAlign: 'middle',
                }}
              />
            </div>
          </div>
        </div>

        {/* Other features */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 2,
            background: 'rgba(240,165,0,0.08)',
          }}
        >
          {FEATURES.map((f) => (
            <div
              key={f.label}
              style={{ background: '#0C0C10', padding: '48px', transition: 'background 0.3s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#111116')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#0C0C10')}
            >
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#F0A500',
                  marginBottom: 20,
                }}
              >
                {f.label}
              </div>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  letterSpacing: '-0.02em',
                  marginBottom: 12,
                  lineHeight: 1.2,
                }}
              >
                {f.title}
              </h3>
              <p style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EARN */}
      <section
        id="Kazan"
        style={{ position: 'relative', zIndex: 1, padding: '120px 40px' }}
      >
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#F0A500',
            marginBottom: 16,
          }}
        >
          // Ekonomi
        </div>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 64,
          }}
        >
          Her beceri kazanır.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {[
            { amount: 'π', sub: 'satılan kurs başına', title: 'Öğret', desc: 'İstediğin konuda kurs oluştur, sat. Her satışın %80\'i senin.' },
            { amount: 'π', sub: 'proje başına', title: 'Başkaları için üret', desc: 'Koshei freelance board\'unda iş al, Pi ile ödeme al.' },
            { amount: 'π', sub: 'API çağrısı başına', title: 'Modül yayınla', desc: 'AI modülünü markete koy. Kullanıldıkça kazan. Pasif Pi geliri.' },
          ].map((e) => (
            <div
              key={e.title}
              style={{
                border: '1px solid rgba(240,165,0,0.12)',
                padding: '36px',
                background: '#111116',
                transition: 'all 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={(e2) => {
                (e2.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,0.35)';
                (e2.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e2) => {
                (e2.currentTarget as HTMLElement).style.borderColor = 'rgba(240,165,0,0.12)';
                (e2.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 48,
                    letterSpacing: '-0.03em',
                    color: '#F0A500',
                  }}
                >
                  {e.amount}
                </span>
                <span style={{ fontSize: 14, color: '#4A4845', marginLeft: 8 }}>{e.sub}</span>
              </div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  margin: '12px 0 8px',
                }}
              >
                {e.title}
              </div>
              <p style={{ fontSize: 14, color: '#8A8680', lineHeight: 1.6 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '120px 40px',
          textAlign: 'center',
          borderTop: '1px solid rgba(240,165,0,0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(100px, 20vw, 280px)',
            color: 'rgba(240,165,0,0.025)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.05em',
          }}
        >
          KOSHEI
        </div>

        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(40px, 6vw, 80px)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: 24,
          }}
        >
          Pi&apos;nin geleceği<br />
          <span style={{ color: '#F0A500' }}>buradan inşa edilir.</span>
        </h2>

        <p style={{ fontSize: 17, color: '#8A8680', maxWidth: 480, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Öğrenen, üreten ve kazanan ilk Pioneer dalgasına katıl.
        </p>

        <Link
          href="/login"
          style={{
            background: '#F0A500',
            color: '#000',
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '18px 48px',
            textDecoration: 'none',
            display: 'inline-block',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 60px rgba(240,165,0,0.4)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Pi ile Bağlan →
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '32px 40px',
          borderTop: '1px solid rgba(240,165,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18 }}>
          KO<span style={{ color: '#F0A500' }}>Ш</span>EI
        </div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#4A4845', letterSpacing: '0.06em' }}>
          © 2026 Koshei. Pi Network için üretildi.
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            color: '#4A4845',
            border: '1px solid rgba(240,165,0,0.1)',
            padding: '8px 16px',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F0A500', display: 'inline-block' }} />
          Pi Network Native
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @media (max-width: 768px) {
          nav > div:last-child > a:not(:last-child) { display: none; }
        }
      `}</style>
    </main>
  );
}
