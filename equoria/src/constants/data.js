export const COLORS = {
  plum900: "#1a0a2e", plum800: "#2d1254", plum700: "#4a1e87",
  plum600: "#6b2fa0", plum500: "#8b3fbf", plum400: "#a855d4",
  plum300: "#c084e8", plum200: "#ddb5f5", plum100: "#f3e8ff",
  rose: "#e879a0", roseLight: "#fce4ef", gold: "#f0c060",
  surface: "#faf7ff", textPrimary: "#1a0a2e", textSecondary: "#6b5380", white: "#ffffff",
};

export const SLIDES = [
  { id: 1, theme: "plum", bg: `linear-gradient(160deg, ${COLORS.plum900} 0%, ${COLORS.plum700} 100%)`, chip: "Nuevo recurso", chipColor: "#10b981", icon: "⚖️", title: "Guía de derechos legales 2026", desc: "Conoce las leyes que te protegen y cómo activarlas en caso de necesitarlo.", cta: "Descargar guía" },
  { id: 2, theme: "rose", bg: "linear-gradient(160deg, #7b1f4a 0%, #e879a0 100%)", chip: "Campaña activa", chipColor: COLORS.gold, icon: "🤝", title: "Red de apoyo comunitario", desc: "Únete a nuestra red de voluntarias y multiplicadoras en tu comunidad.", cta: "Unirme ahora" },
  { id: 3, theme: "teal", bg: "linear-gradient(160deg, #083444 0%, #0f6e56 100%)", chip: "Taller gratuito", chipColor: COLORS.plum300, icon: "🧠", title: "Salud mental y resiliencia", desc: "Taller virtual con especialistas. Sábado 7 junio, 11:00 AM. Cupos limitados.", cta: "Reservar lugar" },
  { id: 4, theme: "gold", bg: "linear-gradient(160deg, #3d2800 0%, #a0640a 100%)", chip: "Noticia", chipColor: COLORS.rose, icon: "📰", title: "Nuevas reformas en ley de protección", desc: "El congreso aprobó cambios importantes en materia de violencia familiar y acceso a la justicia.", cta: "Leer más" },
  { id: 5, theme: "violet", bg: `linear-gradient(160deg, #1e0a4a 0%, ${COLORS.plum500} 100%)`, chip: "Emergencia", chipColor: "#10b981", icon: "📞", title: "Línea de crisis 800-900-1000", desc: "Atención gratuita, confidencial y disponible las 24 horas del día, todos los días del año.", cta: "Llamar ahora" },
  { id: 6, theme: "midnight", bg: "linear-gradient(160deg, #0a0a1a 0%, #1a0a2e 100%)", chip: "Comunidad", chipColor: COLORS.gold, icon: "👥", title: "Testimonios de fortaleza", desc: "Historias reales de mujeres que encontraron apoyo y reconstruyeron su vida.", cta: "Ver historias" },
];

export const FEATURES = [
  { icon: "🛡️", title: "Protección 24/7", desc: "Línea de emergencia activa todo el año, sin costo." },
  { icon: "👔", title: "Asesoría legal", desc: "Asesoras certificadas que conocen la ley a fondo." },
  { icon: "🔒", title: "Confidencialidad total", desc: "Tu información está protegida y nunca se compartirá." },
  { icon: "📖", title: "Recursos gratuitos", desc: "Guías, leyes y talleres sin costo para todas." },
];

export const NAV_LINKS = ["Servicios", "Recursos", "Noticias", "Leyes", "Testimonios"];

export const outlineBtn = {
  padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: "1.5px solid rgba(107,47,160,0.25)", color: COLORS.plum700, background: "none",
  fontFamily: "'DM Sans', sans-serif",
};

export const primaryBtn = {
  padding: "9px 22px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
  border: "none",
  background: `linear-gradient(135deg, ${COLORS.plum700}, ${COLORS.plum500})`,
  color: COLORS.white, fontFamily: "'DM Sans', sans-serif",
  boxShadow: "0 4px 14px rgba(107,47,160,0.3)",
};