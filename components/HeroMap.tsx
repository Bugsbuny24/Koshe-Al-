"use client";

import { useEffect, useRef } from "react";

// Dil noktaları: [x%, y%, bayrak, dil adı]
const LANG_DOTS: [number, number, string, string][] = [
  [22, 38, "🇺🇸", "English"],
  [28, 55, "🇧🇷", "Português"],
  [26, 32, "🇨🇦", "French"],
  [45, 28, "🇩🇪", "Deutsch"],
  [44, 26, "🇬🇧", "English"],
  [47, 32, "🇫🇷", "Français"],
  [50, 30, "🇮🇹", "Italiano"],
  [48, 27, "🇪🇸", "Español"],
  [55, 35, "🇹🇷", "Türkçe"],
  [60, 38, "🇸🇦", "العربية"],
  [68, 35, "🇮🇳", "Hindi"],
  [78, 32, "🇨🇳", "中文"],
  [80, 30, "🇯🇵", "日本語"],
  [79, 38, "🇰🇷", "한국어"],
  [52, 52, "🇪🇬", "Arabic"],
  [48, 60, "🇿🇦", "Zulu"],
  [72, 55, "🇹🇭", "Thai"],
  [74, 50, "🇻🇳", "Vietnamese"],
];

export default function HeroMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let animId: number;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W * window.devicePixelRatio;
    canvas.height = H * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Convert % to px
    const dots = LANG_DOTS.map(([x, y, flag, name]) => ({
      x: (x / 100) * W,
      y: (y / 100) * H,
      flag,
      name,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.4,
    }));

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);

      const t = frame * 0.012;

      // Draw connection lines between some dots
      const pairs = [[0,2],[2,4],[4,5],[5,7],[7,8],[8,9],[9,10],[10,11],[11,12],[0,3]];
      for (const [a, b] of pairs) {
        const da = dots[a], db = dots[b];
        const alpha = 0.06 + 0.04 * Math.sin(t + da.phase);
        ctx.beginPath();
        ctx.moveTo(da.x, da.y);
        ctx.lineTo(db.x, db.y);
        ctx.strokeStyle = `rgba(79, 126, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Draw dots + pulse
      for (const dot of dots) {
        const pulse = 0.5 + 0.5 * Math.sin(t * dot.speed + dot.phase);

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 6 + pulse * 8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 126, 255, ${0.06 * pulse})`;
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 146, 255, ${0.7 + 0.3 * pulse})`;
        ctx.fill();
      }

      frame++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="relative w-full h-full select-none">
      {/* World map SVG paths - simplified continents */}
      <svg
        viewBox="0 0 800 420"
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        fill="none"
      >
        {/* North America */}
        <path d="M60 80 L180 70 L220 100 L240 160 L200 220 L160 240 L120 210 L80 180 L60 130 Z" fill="#4f7eff" />
        {/* South America */}
        <path d="M160 250 L220 240 L240 280 L230 350 L200 390 L170 380 L150 330 L140 280 Z" fill="#4f7eff" />
        {/* Europe */}
        <path d="M330 60 L400 55 L420 80 L410 120 L380 130 L350 120 L330 100 Z" fill="#4f7eff" />
        {/* Africa */}
        <path d="M340 140 L420 130 L440 180 L430 280 L400 330 L360 320 L330 260 L320 190 Z" fill="#4f7eff" />
        {/* Asia */}
        <path d="M420 50 L620 40 L660 80 L650 150 L580 180 L500 160 L440 130 L420 90 Z" fill="#4f7eff" />
        {/* Australia */}
        <path d="M600 250 L680 240 L700 280 L680 320 L630 320 L600 290 Z" fill="#4f7eff" />
      </svg>

      {/* Animated canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating flag labels */}
      {LANG_DOTS.slice(0, 10).map(([x, y, flag, name], i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -200%)",
            animation: `floatLabel ${3 + i * 0.3}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900/80 px-2 py-0.5 backdrop-blur-sm whitespace-nowrap">
            <span className="text-xs">{flag}</span>
            <span className="text-[10px] text-slate-300 font-medium">{name}</span>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatLabel {
          from { transform: translate(-50%, -200%) translateY(0px); opacity: 0.6; }
          to   { transform: translate(-50%, -200%) translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
