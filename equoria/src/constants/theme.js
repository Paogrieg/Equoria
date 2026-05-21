export const T = {
  plum900: "#1a0a2e", plum800: "#2d1254", plum700: "#4a1e87", plum600: "#6b2fa0",
  plum500: "#8b3fbf", plum400: "#a855d4", plum300: "#c084e8", plum200: "#ddb5f5", plum100: "#f3e8ff",
  rose: "#e879a0", roseLight: "#fce4ef", gold: "#f0c060",
  surface: "#faf7ff", textPrimary: "#1a0a2e", textSecondary: "#6b5380", white: "#ffffff",
  green: "#10b981", red: "#ef4444",
  shadow: "0 4px 24px rgba(107,47,160,0.12)", shadowLg: "0 12px 40px rgba(107,47,160,0.18)",
};

export const COMPLAINT_COLORS = {
  pendiente: { bg: "rgba(240,192,96,0.12)", color: "#b45309", border: "rgba(240,192,96,0.4)", label: "Pendiente" },
  revision:  { bg: "rgba(168,85,212,0.12)", color: T.plum600,  border: "rgba(168,85,212,0.3)", label: "En Revisión" },
  resuelto:  { bg: "rgba(16,185,129,0.12)", color: T.green,    border: "rgba(16,185,129,0.3)", label: "Resuelto" },
};

export const TABS = [
  { label: "Perfil",   icon: "fa-id-card" },
  { label: "Denuncias", icon: "fa-file-lines" },
  { label: "Testimonios", icon: "fa-comment" },
  { label: "Contactos de Emergencia", icon: "fa-phone" },
];