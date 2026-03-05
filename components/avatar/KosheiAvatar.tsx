"use client";

import { useEffect, useState } from "react";

interface AvatarProps {
  isSpeaking: boolean;
}

export default function KosheiAvatar({ isSpeaking }: AvatarProps) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Arka plan glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: isSpeaking
          ? "radial-gradient(ellipse at center, rgba(100,60,200,0.3) 0%, transparent 70%)"
          : "radial-gradient(ellipse at center, rgba(40,20,80,0.15) 0%, transparent 70%)",
        transition: "all 0.5s ease",
      }} />

      {/* Avatar */}
      <div style={{
        position: "relative",
        width: "260px",
        height: "260px",
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
        {isSpeaking && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "linear-gradient(to top, rgba(120,60,255,0.45), transparent)",
          }} />
        )}
      </div>

      {/* Durum göstergesi */}
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
