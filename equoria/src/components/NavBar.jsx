import { useState, useEffect } from "react";
import { COLORS, NAV_LINKS, outlineBtn, primaryBtn } from "../constants/data";

function NavLink({ label }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 14, fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap",
        color: hov ? COLORS.plum600 : COLORS.textSecondary,
        transition: "color 0.2s",
      }}
    >{label}</a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: COLORS.white,
      borderBottom: `1px solid rgba(107,47,160,${scrolled ? 0.15 : 0.08})`,
      boxShadow: scrolled ? "0 4px 20px rgba(26,10,46,0.1)" : "0 2px 12px rgba(26,10,46,0.04)",
      padding: "0 48px", height: 68,
      display: "flex", alignItems: "center", gap: 32,
      transition: "box-shadow 0.3s, border-color 0.3s",
    }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", marginRight: "auto" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.plum400})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 12px rgba(232,121,160,0.35)", fontSize: 18,
        }}>🛡</div>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: COLORS.plum800, letterSpacing: 0.5 }}>
          Equoria
        </span>
      </a>

      {NAV_LINKS.map(l => (
        <NavLink key={l} label={l} />
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
        <button style={outlineBtn}>Iniciar sesión</button>
        <button style={primaryBtn}>Registrarse</button>
      </div>
    </nav>
  );
}