"use client";

import { useEffect, useState, useRef } from "react";

interface AvatarProps {
  isSpeaking: boolean;
}

export default function KosheiAvatar({ isSpeaking }: AvatarProps) {
  const [blink, setBlink] = useState(false);
  const [tick, setTick] = useState(0);
  const [particles, setParticles] = useState<Array<{id:number,x:number,y:number,size:number,color:string,dx:number,dy:number,life:number}>>([]);
  const tickRef = useRef(0);

  // Göz kırpma
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // Parçacık animasyonu
  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 1;
      setTick(tickRef.current);

      if (isSpeaking) {
        setParticles(prev => {
          const colors = ["rgba(150,80,255,0.8)","rgba(0,200,255,0.8)","rgba(255,100,200,0.7)","rgba(100,255,200,0.7)"];
          const newP = Array.from({length: 3}, (_, i) => ({
            id: tickRef.current * 10 + i,
            x: 30 + Math.random() * 40,
            y: 20 + Math.random() * 60,
            size: 2 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 0.8,
            dy: -0.3 - Math.random() * 0.5,
            life: 1,
          }));
          return [...prev.map(p => ({...p, x: p.x + p.dx, y: p.y + p.dy, life: p.life - 0.03}))
            .filter(p => p.life > 0), ...newP].slice(-40);
        });
      } else {
        setParticles(prev =>
          prev.map(p => ({...p, life: p.life - 0.05})).filter(p => p.life > 0)
        );
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const waveAmplitude = isSpeaking ? 1 : 0.3;

  return (
    <div style={{
      width: "100%",
      height: "420px",
      borderRadius: "1.5rem",
      background: "linear-gradient(180deg, #02020f 0%, #0a0520 60%, #020210 100%)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{`
        @keyframes floatPanel {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        @keyframes floatPanel2 {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50% { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400px); }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.04); }
        }
        @keyframes ringPulse2 {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.08); }
        }
        @keyframes glitch {
          0%, 95%, 100% { clip-path: none; transform: none; }
          96% { clip-path: polygon(0 20%, 100% 20%, 100% 25%, 0 25%); transform: translateX(3px); }
          97% { clip-path: polygon(0 60%, 100% 60%, 100% 65%, 0 65%); transform: translateX(-3px); }
          98% { clip-path: polygon(0 40%, 100% 40%, 100% 43%, 0 43%); transform: translateX(2px); }
        }
        @keyframes textBlink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        @keyframes waveAnim {
          0% { d: path("M0,10 Q25,${5} 50,10 Q75,${15} 100,10"); }
          50% { d: path("M0,10 Q25,${15} 50,10 Q75,${5} 100,10"); }
          100% { d: path("M0,10 Q25,${5} 50,10 Q75,${15} 100,10"); }
        }
        @keyframes cornerBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      {/* Arka plan grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,200,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Scan line efekti */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "2px",
        background: "linear-gradient(90deg, transparent, rgba(0,200,255,0.15), transparent)",
        animation: "scanline 4s linear infinite",
        pointerEvents: "none",
      }} />

      {/* Dış halkalar */}
      <div style={{
        position: "absolute",
        width: "340px", height: "340px",
        borderRadius: "50%",
        border: "1px solid rgba(0,200,255,0.15)",
        animation: "ringPulse2 4s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: "300px", height: "300px",
        borderRadius: "50%",
        border: `1px solid ${isSpeaking ? "rgba(150,80,255,0.4)" : "rgba(100,60,200,0.2)"}`,
        animation: "ringPulse 3s ease-in-out infinite",
        transition: "border-color 0.5s",
      }} />

      {/* SOL ÜST PANEL */}
      <div style={{
        position: "absolute", left: "8px", top: "20px",
        width: "130px",
        background: "rgba(0,10,30,0.75)",
        border: "1px solid rgba(0,200,255,0.25)",
        borderRadius: "8px",
        padding: "8px 10px",
        backdropFilter: "blur(8px)",
        animation: "floatPanel 5s ease-in-out infinite",
        zIndex: 10,
      }}>
        {/* Köşe süslemeleri */}
        <div style={{position:"absolute",top:"3px",left:"3px",width:"6px",height:"6px",borderTop:"1px solid rgba(0,200,255,0.7)",borderLeft:"1px solid rgba(0,200,255,0.7)"}} />
        <div style={{position:"absolute",top:"3px",right:"3px",width:"6px",height:"6px",borderTop:"1px solid rgba(0,200,255,0.7)",borderRight:"1px solid rgba(0,200,255,0.7)"}} />
        <div style={{fontSize:"8px",color:"rgba(0,200,255,0.5)",letterSpacing:"1px",marginBottom:"4px"}}>KOSHEI // SYS</div>
        <div style={{fontSize:"9px",color:"rgba(0,200,255,0.8)",marginBottom:"3px"}}>
          STATUS: <span style={{color: isSpeaking ? "rgba(100,255,150,1)" : "rgba(150,150,255,0.9)"}}>{isSpeaking ? "ACTIVE" : "STANDBY"}</span>
        </div>
        <div style={{fontSize:"9px",color:"rgba(0,200,255,0.6)",marginBottom:"6px"}}>LANG CORE v2.1</div>
        {/* Mini progress barlar */}
        {["VOCAB","GRAMMAR","PHONICS"].map((label, i) => (
          <div key={label} style={{marginBottom:"3px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"1px"}}>
              <span style={{fontSize:"7px",color:"rgba(0,200,255,0.5)"}}>{label}</span>
              <span style={{fontSize:"7px",color:"rgba(0,200,255,0.7)"}}>{[92,87,95][i]}%</span>
            </div>
            <div style={{height:"2px",background:"rgba(0,200,255,0.1)",borderRadius:"1px"}}>
              <div style={{width:`${[92,87,95][i]}%`,height:"100%",background:"rgba(0,200,255,0.6)",borderRadius:"1px"}} />
            </div>
          </div>
        ))}
      </div>

      {/* SAĞ ÜST PANEL */}
      <div style={{
        position: "absolute", right: "8px", top: "15px",
        width: "120px",
        background: "rgba(10,0,30,0.75)",
        border: "1px solid rgba(150,80,255,0.3)",
        borderRadius: "8px",
        padding: "8px 10px",
        backdropFilter: "blur(8px)",
        animation: "floatPanel2 6s ease-in-out infinite",
        zIndex: 10,
      }}>
        <div style={{position:"absolute",top:"3px",left:"3px",width:"6px",height:"6px",borderTop:"1px solid rgba(150,80,255,0.7)",borderLeft:"1px solid rgba(150,80,255,0.7)"}} />
        <div style={{position:"absolute",top:"3px",right:"3px",width:"6px",height:"6px",borderTop:"1px solid rgba(150,80,255,0.7)",borderRight:"1px solid rgba(150,80,255,0.7)"}} />
        <div style={{fontSize:"8px",color:"rgba(150,80,255,0.5)",letterSpacing:"1px",marginBottom:"4px"}}>NEURAL NET</div>
        {/* Fake neural activity bars */}
        <div style={{display:"flex",gap:"2px",alignItems:"flex-end",height:"30px",marginBottom:"5px"}}>
          {Array.from({length:10},(_,i)=>i).map(i => (
            <div key={i} style={{
              flex:1,
              background: isSpeaking ? "rgba(150,80,255,0.7)" : "rgba(150,80,255,0.25)",
              borderRadius:"1px",
              height: `${isSpeaking ? 30 + Math.sin((tick+i)*0.5)*50 : 10 + i*3}%`,
              transition: "height 0.1s, background 0.3s",
            }} />
          ))}
        </div>
        <div style={{fontSize:"8px",color:"rgba(150,80,255,0.6)",animation:"textBlink 3s infinite"}}>
          {isSpeaking ? "▶ PROCESSING" : "◼ IDLE"}
        </div>
      </div>

      {/* SOL ALT PANEL */}
      <div style={{
        position: "absolute", left: "8px", bottom: "55px",
        width: "120px",
        background: "rgba(0,15,10,0.75)",
        border: "1px solid rgba(0,255,150,0.2)",
        borderRadius: "8px",
        padding: "8px 10px",
        backdropFilter: "blur(8px)",
        animation: "floatPanel2 7s ease-in-out infinite",
        zIndex: 10,
      }}>
        <div style={{fontSize:"8px",color:"rgba(0,255,150,0.5)",letterSpacing:"1px",marginBottom:"4px"}}>SPEECH ANALYSIS</div>
        {/* Ses dalgası SVG */}
        <svg width="100" height="20" viewBox="0 0 100 20" style={{display:"block",marginBottom:"4px"}}>
          {Array.from({length:20},(_,i)=>i).map(i => {
            const h = isSpeaking
              ? 4 + Math.abs(Math.sin((tick * 0.3 + i * 0.8))) * 12
              : 2 + Math.abs(Math.sin(i * 0.5)) * 3;
            return (
              <rect
                key={i}
                x={i * 5} y={(20 - h) / 2}
                width="3" height={h}
                fill={`rgba(0,255,150,${isSpeaking ? 0.7 : 0.3})`}
                rx="1"
              />
            );
          })}
        </svg>
        <div style={{fontSize:"8px",color:"rgba(0,255,150,0.6)"}}>
          {isSpeaking ? `FREQ: ${(400 + (tick % 200))}Hz` : "FREQ: --"}
        </div>
      </div>

      {/* SAĞ ALT PANEL */}
      <div style={{
        position: "absolute", right: "8px", bottom: "50px",
        width: "115px",
        background: "rgba(15,0,20,0.75)",
        border: "1px solid rgba(255,80,180,0.2)",
        borderRadius: "8px",
        padding: "8px 10px",
        backdropFilter: "blur(8px)",
        animation: "floatPanel 8s ease-in-out infinite",
        zIndex: 10,
      }}>
        <div style={{fontSize:"8px",color:"rgba(255,80,180,0.5)",letterSpacing:"1px",marginBottom:"4px"}}>EMOTION CORE</div>
        {[["WARMTH","rgba(255,150,80,0.7)",88],["PATIENCE","rgba(80,200,255,0.7)",95],["FOCUS","rgba(150,80,255,0.7)",91]].map(([label, color, val]) => (
          <div key={String(label)} style={{marginBottom:"4px"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <span style={{fontSize:"7px",color:"rgba(255,255,255,0.4)"}}>{String(label)}</span>
              <span style={{fontSize:"7px",color:String(color)}}>{val}%</span>
            </div>
            <div style={{height:"2px",background:"rgba(255,255,255,0.05)",borderRadius:"1px"}}>
              <div style={{width:`${val}%`,height:"100%",background:String(color),borderRadius:"1px"}} />
            </div>
          </div>
        ))}
      </div>

      {/* Parçacıklar */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: `${p.size}px`, height: `${p.size}px`,
          borderRadius: "50%",
          background: p.color,
          opacity: p.life,
          pointerEvents: "none",
          transform: "translate(-50%,-50%)",
        }} />
      ))}

      {/* Avatar */}
      <div style={{
        position: "relative",
        width: "240px",
        height: "240px",
        borderRadius: "50%",
        overflow: "hidden",
        border: isSpeaking
          ? "2px solid rgba(150,80,255,0.9)"
          : "2px solid rgba(0,200,255,0.3)",
        boxShadow: isSpeaking
          ? "0 0 40px rgba(150,80,255,0.6), 0 0 80px rgba(100,60,200,0.3)"
          : "0 0 20px rgba(0,200,255,0.15)",
        transition: "all 0.4s ease",
        zIndex: 5,
        animation: "glitch 8s infinite",
      }}>
        <img
          src="/koshei-avatar.png"
          alt="Koshei"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center top",
            filter: blink
              ? "brightness(0.9)"
              : isSpeaking
              ? "brightness(1.1) saturate(1.2)"
              : "brightness(1)",
            transition: "filter 0.1s",
          }}
        />
        {/* Speaking overlay */}
        {isSpeaking && (
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 80%, rgba(150,80,255,0.25) 0%, transparent 70%)",
          }} />
        )}
      </div>

      {/* Alt durum çubuğu */}
      <div style={{
        position: "absolute", bottom: "12px", left: "50%",
        transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: "8px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "20px",
        padding: "5px 14px",
        border: "1px solid rgba(255,255,255,0.08)",
        whiteSpace: "nowrap",
        zIndex: 10,
      }}>
        {isSpeaking ? (
          <>
            <div style={{display:"flex",gap:"2px",alignItems:"center",height:"16px"}}>
              {[1,2,3,4,5,4,3,2,1].map((h,i) => (
                <div key={i} style={{
                  width:"2px", borderRadius:"1px",
                  background:"rgba(150,80,255,0.9)",
                  height:`${4 + Math.abs(Math.sin((tick*0.4)+i))*10}px`,
                  transition:"height 0.05s",
                }} />
              ))}
            </div>
            <span style={{fontSize:"11px",color:"rgba(200,150,255,0.9)"}}>Koshei konuşuyor</span>
          </>
        ) : (
          <>
            <div style={{
              width:"7px",height:"7px",borderRadius:"50%",
              background:"rgba(0,255,150,0.9)",
              boxShadow:"0 0 6px rgba(0,255,150,0.6)",
              animation:"cornerBlink 2s infinite",
            }} />
            <span style={{fontSize:"11px",color:"rgba(150,255,200,0.8)"}}>Hazır</span>
          </>
        )}
      </div>
    </div>
  );
}
