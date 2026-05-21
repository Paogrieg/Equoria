import { useState } from "react";
import { COLORS } from "../constants/data";

function FooterLink({ children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontSize: 13, textDecoration: "none",
        color: hov ? COLORS.rose : COLORS.plum300,
        transition: "color 0.2s",
      }}
    >{children}</a>
  );
}

export default function Footer() {
  return (
    <footer style={{
      background: COLORS.plum900,
      padding: "36px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
    }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: COLORS.white, fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: `linear-gradient(135deg, ${COLORS.rose}, ${COLORS.plum400})`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
        }}>🛡</div>
        Equoria
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        {["Privacidad", "Términos", "Contacto", "Emergencia"].map(l => (
          <FooterLink key={l}>{l}</FooterLink>
        ))}
      </div>
      <div style={{ fontSize: 12, color: COLORS.plum400 }}>© 2026 Equoria · Todos los derechos reservados</div>
    </footer>
  );
}