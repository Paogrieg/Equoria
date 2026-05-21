import { useState, useEffect, useRef, useCallback } from "react";
import { COLORS, SLIDES } from "../constants/data";

function CardCta({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        background: hov ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 8, padding: "8px 16px",
        color: COLORS.white, fontSize: 13, fontWeight: 600,
        cursor: "pointer", transition: "background 0.2s",
      }}
    >{children}</div>
  );
}

function CarouselCard({ slide }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: "0 0 calc(33.333% - 14px)",
        borderRadius: 16, overflow: "hidden",
        position: "relative", minHeight: 280,
        background: slide.bg,
        boxShadow: hov ? "0 16px 40px rgba(26,10,46,0.22)" : "0 8px 28px rgba(26,10,46,0.12)",
        transform: hov ? "translateY(-5px)" : "none",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)",
      }} />
      <div style={{ position: "absolute", top: 20, right: 20, fontSize: 28, opacity: 0.25 }}>
        {slide.icon}
      </div>
      <div style={{
        position: "relative", zIndex: 1, padding: 24, height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 280,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20, padding: "4px 12px",
          fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)", width: "fit-content",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: slide.chipColor, display: "inline-block" }} />
          {slide.chip}
        </div>
        <div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 700, color: COLORS.white,
            lineHeight: 1.25, marginBottom: 8,
          }}>{slide.title}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.55, marginBottom: 16 }}>
            {slide.desc}
          </div>
          <CardCta>{slide.cta} →</CardCta>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ children, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 40, height: 40, borderRadius: "50%",
        border: `1.5px solid ${hov ? COLORS.plum700 : "rgba(107,47,160,0.2)"}`,
        background: hov ? COLORS.plum700 : COLORS.white,
        color: hov ? COLORS.white : COLORS.plum600,
        cursor: "pointer", fontSize: 18, fontWeight: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
      }}
    >{children}</button>
  );
}

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const maxIndex = SLIDES.length - 3;
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, maxIndex)));
  }, [maxIndex]);

  const startAuto = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => prev < maxIndex ? prev + 1 : 0);
    }, 4000);
  }, [maxIndex]);

  const stopAuto = useCallback(() => clearInterval(timerRef.current), []);

  useEffect(() => { startAuto(); return () => stopAuto(); }, [startAuto, stopAuto]);

  const cardWidth = `calc(33.333% - 14px)`;

  return (
    <section style={{ padding: "64px 48px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: COLORS.rose, fontWeight: 600, marginBottom: 8 }}>
            Anuncios y campañas
          </div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: COLORS.plum900, lineHeight: 1.2 }}>
            Recursos y<br />novedades
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <CtrlBtn onClick={() => goTo(current - 1)}>‹</CtrlBtn>
          <CtrlBtn onClick={() => goTo(current + 1)}>›</CtrlBtn>
        </div>
      </div>

      <div
        style={{ overflow: "hidden", borderRadius: 16 }}
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div style={{
          display: "flex", gap: 20,
          transform: `translateX(calc(-${current} * (${cardWidth} + 20px)))`,
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
        }}>
          {SLIDES.map(slide => <CarouselCard key={slide.id} slide={slide} />)}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 24 }}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <div
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: 6, borderRadius: 3, cursor: "pointer",
              width: i === current ? 20 : 6,
              background: i === current ? COLORS.plum500 : "rgba(107,47,160,0.2)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </section>
  );
}