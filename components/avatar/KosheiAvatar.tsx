"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface AvatarProps {
  isSpeaking: boolean;
  audioRef?: React.RefObject<HTMLAudioElement | null>;
}

// Avatar circle dimensions
const AVATAR_SIZE = 260;
// Approximate mouth centre relative to the 260×260 circle.
// Typical AI portrait: eyes ~40%, mouth ~72% from top.
const MOUTH_CX = AVATAR_SIZE * 0.50;
const MOUTH_CY = AVATAR_SIZE * 0.72;

function drawMouth(
  ctx: CanvasRenderingContext2D,
  open: number,
  round: number,
  wide: number,
) {
  ctx.clearRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
  if (open < 0.01) return; // fully closed — nothing to draw

  const baseW = AVATAR_SIZE * 0.135;
  const maxW  = AVATAR_SIZE * 0.23;
  // round vowels pull the mouth slightly narrower; wide consonants widen it
  const mw = baseW + wide * (maxW - baseW) * 0.6 + open * AVATAR_SIZE * 0.018;
  const mh = open * AVATAR_SIZE * 0.095;

  const rx = mw * 0.5 * (round > 0.45 ? 0.72 : 1.0); // round vowels = pursed
  const ry = mh;
  const cx = MOUTH_CX;
  const cy = MOUTH_CY;

  // Dark mouth interior
  ctx.save();
  ctx.fillStyle = "rgba(18, 6, 28, 0.90)";
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry * 0.12, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Upper lip (cupid's bow shape)
  ctx.save();
  ctx.fillStyle = "rgba(205, 135, 150, 0.90)";
  ctx.beginPath();
  ctx.moveTo(cx - rx - 2, cy - ry * 0.08);
  ctx.bezierCurveTo(cx - rx * 0.5, cy - ry * 0.55, cx - rx * 0.12, cy - ry * 0.72, cx, cy - ry * 0.52);
  ctx.bezierCurveTo(cx + rx * 0.12, cy - ry * 0.72, cx + rx * 0.5, cy - ry * 0.55, cx + rx + 2, cy - ry * 0.08);
  ctx.bezierCurveTo(cx + rx * 0.40, cy - ry * 0.22, cx - rx * 0.40, cy - ry * 0.22, cx - rx - 2, cy - ry * 0.08);
  ctx.fill();
  ctx.restore();

  // Lower lip (fuller curve)
  ctx.save();
  ctx.fillStyle = "rgba(222, 158, 165, 0.93)";
  ctx.beginPath();
  ctx.moveTo(cx - rx - 2, cy + ry * 0.08);
  ctx.bezierCurveTo(cx - rx * 0.4, cy + ry * 0.75, cx + rx * 0.4, cy + ry * 0.75, cx + rx + 2, cy + ry * 0.08);
  ctx.bezierCurveTo(cx + rx * 0.4, cy + ry * 0.38, cx - rx * 0.4, cy + ry * 0.38, cx - rx - 2, cy + ry * 0.08);
  ctx.fill();
  ctx.restore();

  // Lip-line crease
  ctx.save();
  ctx.strokeStyle = "rgba(145, 75, 90, 0.45)";
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - rx - 2, cy);
  ctx.bezierCurveTo(cx - rx * 0.3, cy, cx + rx * 0.3, cy, cx + rx + 2, cy);
  ctx.stroke();
  ctx.restore();
}

export default function KosheiAvatar({ isSpeaking, audioRef }: AvatarProps) {
  const [blink, setBlink] = useState(false);

  const canvasRef           = useRef<HTMLCanvasElement>(null);
  const animFrameRef        = useRef<number>(0);
  const analyserRef         = useRef<AnalyserNode | null>(null);
  const audioCtxRef         = useRef<AudioContext | null>(null);
  const connectedElRef      = useRef<HTMLAudioElement | null>(null);
  const mouthRef            = useRef({ open: 0, round: 0, wide: 0 });
  const targetRef           = useRef({ open: 0, round: 0, wide: 0 });

  // Random blink
  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);

  // Connect Web Audio API when a new audio element starts playing
  useEffect(() => {
    if (!isSpeaking || !audioRef?.current) {
      analyserRef.current = null;
      return;
    }
    const audioEl = audioRef.current;
    if (connectedElRef.current === audioEl && analyserRef.current) return;

    try {
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (
          window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      const actx = audioCtxRef.current;
      if (actx.state === "suspended") void actx.resume();

      if (analyserRef.current) {
        try { analyserRef.current.disconnect(); } catch { /* ignore */ }
      }
      const analyser = actx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.82;
      analyserRef.current = analyser;

      const source = actx.createMediaElementSource(audioEl);
      source.connect(analyser);
      analyser.connect(actx.destination);
      connectedElRef.current = audioEl;
    } catch {
      // Web Audio API unavailable or element already connected — fall back to simulation
    }
  }, [isSpeaking, audioRef]);

  const animate = useCallback(() => {
    const analyser = analyserRef.current;

    if (analyser && isSpeaking) {
      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);

      const sr      = audioCtxRef.current?.sampleRate ?? 44100;
      const binHz   = sr / analyser.fftSize;
      const lowEnd  = Math.min(Math.floor(400  / binHz), data.length);
      const midEnd  = Math.min(Math.floor(2500 / binHz), data.length);
      const highEnd = Math.min(Math.floor(8000 / binHz), data.length);

      let low = 0, mid = 0, high = 0;
      for (let i = 1;       i < lowEnd;  i++) low  += data[i];
      for (let i = lowEnd;  i < midEnd;  i++) mid  += data[i];
      for (let i = midEnd;  i < highEnd; i++) high += data[i];
      low  /= Math.max(lowEnd - 1,         1);
      mid  /= Math.max(midEnd  - lowEnd,   1);
      high /= Math.max(highEnd - midEnd,   1);

      const lN = low / 255, mN = mid / 255, hN = high / 255;
      targetRef.current.open  = Math.min(1, (lN * 0.4 + mN * 1.1 + hN * 0.5) * 2.6);
      targetRef.current.round = lN > mN * 0.85 ? Math.min(1, ((lN - mN) / Math.max(mN, 0.05)) * 0.55) : 0;
      targetRef.current.wide  = hN > lN ? Math.min(1, (hN - lN) * 4.2) : 0;
    } else if (isSpeaking) {
      // Simulation fallback (no analyser) — realistic speech rhythm
      const t = Date.now() / 1000;
      targetRef.current.open  = Math.max(0, Math.min(1, Math.sin(t * 7.8) * 0.38 + 0.48 + Math.sin(t * 3.1) * 0.18));
      targetRef.current.round = Math.max(0, Math.sin(t * 5.2) * 0.28 + 0.28);
      targetRef.current.wide  = Math.max(0, Math.cos(t * 6.3) * 0.22 + 0.22);
    } else {
      targetRef.current = { open: 0, round: 0, wide: 0 };
    }

    const speed = analyser ? 0.30 : 0.14;
    const lerp  = (a: number, b: number, t: number) => a + (b - a) * t;
    mouthRef.current = {
      open:  lerp(mouthRef.current.open,  targetRef.current.open,  speed),
      round: lerp(mouthRef.current.round, targetRef.current.round, speed),
      wide:  lerp(mouthRef.current.wide,  targetRef.current.wide,  speed),
    };

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawMouth(ctx, mouthRef.current.open, mouthRef.current.round, mouthRef.current.wide);

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isSpeaking]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate]);

  return (
    <div style={{
      width: "100%",
      height: "320px",
      borderRadius: "1rem",
      overflow: "hidden",
      background: "linear-gradient(180deg, #050510 0%, #130820 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}>

      <style>{`
        @keyframes speakPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(150,80,255,0.5), 0 0 60px rgba(100,60,200,0.3); }
          50% { box-shadow: 0 0 50px rgba(150,80,255,0.9), 0 0 100px rgba(100,60,200,0.6); }
        }
        @keyframes soundBar {
          from { transform: scaleY(0.4); opacity: 0.6; }
          to { transform: scaleY(1.2); opacity: 1; }
        }
        @keyframes idlePulse {
          0%, 100% { box-shadow: 0 0 15px rgba(100,60,200,0.2); }
          50% { box-shadow: 0 0 25px rgba(100,60,200,0.4); }
        }
      `}</style>

      {/* Background glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: isSpeaking
          ? "radial-gradient(ellipse at center, rgba(100,60,200,0.3) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(40,20,80,0.15) 0%, transparent 70%)",
        transition: "all 0.5s ease",
      }} />

      {/* Avatar circle */}
      <div style={{
        position: "relative",
        width: `${AVATAR_SIZE}px`,
        height: `${AVATAR_SIZE}px`,
        borderRadius: "50%",
        overflow: "hidden",
        border: isSpeaking
          ? "2px solid rgba(150,80,255,0.9)"
          : "2px solid rgba(100,60,200,0.3)",
        animation: isSpeaking
          ? "speakPulse 1.2s ease-in-out infinite"
          : "idlePulse 3s ease-in-out infinite",
        transition: "border 0.3s ease",
      }}>
        <img
          src="/koshei-avatar.png"
          alt="Koshei"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            filter: blink ? "brightness(0.92)" : "brightness(1)",
            transition: "filter 0.08s",
          }}
        />

        {/* Lip-sync canvas overlay */}
        <canvas
          ref={canvasRef}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${AVATAR_SIZE}px`,
            height: `${AVATAR_SIZE}px`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        {isSpeaking && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "linear-gradient(to top, rgba(120,60,255,0.35), transparent)",
            pointerEvents: "none",
          }} />
        )}
      </div>

      {/* Status indicator */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "6px 16px",
        border: "1px solid rgba(255,255,255,0.08)",
        whiteSpace: "nowrap",
      }}>
        {isSpeaking ? (
          <>
            <div style={{ display: "flex", gap: "3px", alignItems: "center", height: "20px" }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{
                  width: "3px",
                  borderRadius: "2px",
                  background: "rgba(150,80,255,0.9)",
                  animation: `soundBar 0.5s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.08}s`,
                  height: `${6 + i * 3}px`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: "12px", color: "rgba(200,150,255,0.9)" }}>Koshei konuşuyor</span>
          </>
        ) : (
          <>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: "rgba(100,220,100,0.9)",
              boxShadow: "0 0 8px rgba(100,220,100,0.6)",
            }} />
            <span style={{ fontSize: "12px", color: "rgba(180,255,180,0.8)" }}>Hazır</span>
          </>
        )}
      </div>
    </div>
  );
}
