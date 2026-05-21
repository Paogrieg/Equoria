import { COLORS, FEATURES } from "../constants/data";

export default function Features() {
  return (
    <div style={{
      background: COLORS.white,
      borderTop: "1px solid rgba(107,47,160,0.08)",
      borderBottom: "1px solid rgba(107,47,160,0.08)",
      padding: "40px 48px",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24,
      }}>
        {FEATURES.map(f => (
          <div key={f.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: COLORS.plum100,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>{f.icon}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.plum800, marginBottom: 3 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}