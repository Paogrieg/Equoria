import { useState } from "react";
import { COLORS } from "../constants/data";

function HeroBadgeDot() {
  return (
    <span style={{
      width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block",
      animation: "pulseDot 2s infinite",
    }} />
  );
}

function HeroBtn({ children, primary }) {
  const [hov, setHov] = useState(false);
  const base = {
    padding: "14px 32px", borderRadius: 10, fontSize: 15, fontWeight: 600,
    cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
    display: "flex", alignItems: "center", gap: 8, border: "none",
    transition: "all 0.2s",
  };
  const style = primary
    ? {
        ...base,
        background: `linear-gradient(135deg, ${COLORS.plum700}, ${COLORS.plum500})`,
        color: COLORS.white,
        boxShadow: hov ? "0 10px 28px rgba(107,47,160,0.45)" : "0 6px 20px rgba(107,47,160,0.35)",
        transform: hov ? "translateY(-2px)" : "none",
      }
    : {
        ...base,
        background: hov ? COLORS.plum100 : "none",
        border: `1.5px solid rgba(107,47,160,0.2)`,
        color: COLORS.plum700,
      };
  return (
    <button style={style} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {children}
    </button>
  );
}

export default function Hero() {
  return (
    <section style={{
      padding: "64px 48px 0", display: "grid",
      gridTemplateColumns: "1fr 1fr", gap: 48,
      alignItems: "center", maxWidth: 1200, margin: "0 auto",
    }}>
      <style>{`
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes floatCard { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ animation: "fadeSlideUp 0.7s ease both" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: COLORS.roseLight, color: COLORS.rose,
          fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase",
          padding: "6px 14px", borderRadius: 20, marginBottom: 20,
        }}>
          💜 Plataforma de prevención y apoyo
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 52, lineHeight: 1.12, fontWeight: 700,
          color: COLORS.plum900, marginBottom: 8,
        }}>
          Tu red de<br />
          apoyo{" "}
          <em style={{
            fontStyle: "italic",
            background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.plum400})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>siempre</em>
          <br />contigo
        </h1>

        <p style={{
          fontSize: 16, color: COLORS.textSecondary, lineHeight: 1.65,
          maxWidth: 420, marginBottom: 32, fontWeight: 400,
        }}>
          Accede a recursos, asesoría legal y acompañamiento especializado para proteger tus derechos y tu bienestar.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <HeroBtn primary>→ Comenzar ahora</HeroBtn>
          <HeroBtn>▶ Ver cómo funciona</HeroBtn>
        </div>

        <div style={{
          display: "flex", gap: 28, marginTop: 36, paddingTop: 28,
          borderTop: `1px solid rgba(107,47,160,0.1)`,
        }}>
          {[["4,800+", "Casos atendidos"], ["120", "Asesoras activas"], ["24/7", "Línea de crisis"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: COLORS.plum700 }}>{n}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        position: "relative", height: 400, borderRadius: 20, overflow: "hidden",
        background: `linear-gradient(160deg, ${COLORS.plum900}, ${COLORS.plum700})`,
        boxShadow: "0 20px 60px rgba(26,10,46,0.25)",
        animation: "fadeSlideUp 0.7s 0.15s ease both",
      }}>
        <div style={{
          position: "absolute", bottom: -40, right: -40, width: 240, height: 240,
          borderRadius: "50%",
          background: `linear-gradient(135deg, rgba(232,121,160,0.3), rgba(168,85,212,0.2))`,
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", top: -20, left: 40, width: 150, height: 150,
          borderRadius: "50%", background: "rgba(240,192,96,0.15)", filter: "blur(30px)",
        }} />

        <div style={{
          position: "absolute", top: 20, left: 20, zIndex: 2,
          background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10,
          padding: "10px 16px", color: COLORS.white, fontSize: 12, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <HeroBadgeDot /> Línea de emergencia activa
        </div>

        <div style={{
          position: "absolute", bottom: 110, right: 20, zIndex: 2,
          background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12,
          padding: "12px 16px", animation: "floatCard 4s ease-in-out infinite",
        }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase" }}>Casos este mes</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.white, fontWeight: 600 }}>312</div>
          <div style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            ↑ +18% vs mes anterior
          </div>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(26,10,46,0.95), transparent)",
          padding: 28,
        }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: COLORS.rose, fontWeight: 600, marginBottom: 8 }}>
            Protección integral
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: COLORS.white, fontWeight: 600, lineHeight: 1.3 }}>
            Acompañamos cada paso<br />de tu proceso
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
            Legal · Psicológico · Social · Emergencia
          </div>
        </div>
      </div>
    </section>
  );
}