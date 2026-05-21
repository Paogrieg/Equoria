import { T } from "../constants/theme";
import { initials } from "../utils/formatters";

export function Avatar({ user, size = 80 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${T.rose}, ${T.plum400})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.3, fontWeight: 700,
      color: T.white, fontFamily: "'Playfair Display', serif",
      border: `3px solid ${T.white}`,
      boxShadow: `0 4px 16px rgba(232,121,160,0.4)`,
      flexShrink: 0,
    }}>
      {initials(user)}
    </div>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.white, borderRadius: 16,
      boxShadow: T.shadow, padding: "24px", ...style,
    }}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: T.textPrimary }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {action && (
        <button onClick={action.onClick} style={{
          background: "none", border: "none", cursor: "pointer",
          color: T.plum400, fontSize: 13, fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {action.label} →
        </button>
      )}
    </div>
  );
}

export function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${T.plum100}` }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: T.plum100, display: "flex", alignItems: "center", justifyContent: "center",
        color: T.plum600, fontSize: 14,
      }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <div style={{ paddingTop: 2 }}>
        <div style={{ fontSize: 11, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 14, color: T.textPrimary, fontWeight: 500 }}>{value || "—"}</div>
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 0" }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: `3px solid ${T.plum100}`,
        borderTopColor: T.plum500,
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function ErrorMsg({ msg, onRetry }) {
  return (
    <div style={{
      background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 12, padding: "20px 24px", textAlign: "center",
    }}>
      <i className="fa-solid fa-triangle-exclamation" style={{ color: T.red, fontSize: 24, marginBottom: 8, display: "block" }}></i>
      <div style={{ color: T.red, fontSize: 14, fontWeight: 600 }}>{msg}</div>
      {onRetry && (
        <button onClick={onRetry} style={{
          marginTop: 12, background: T.white, border: `1px solid ${T.plum200}`,
          color: T.plum600, borderRadius: 8, padding: "8px 18px",
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        }}>
          Reintentar
        </button>
      )}
    </div>
  );
}