export const RESOURCES = [
  { icon: "fa-house-chimney-medical", bg: "#f3e8ff", color: "var(--plum-500)", name: "Centros de Refugio",  desc: "Red nacional de refugios seguros" },
  { icon: "fa-gavel",                 bg: "#fff8e6", color: "#7c5a00",          name: "Asesoría Jurídica",  desc: "Orientación legal gratuita" },
  { icon: "fa-brain",                 bg: "#fce4ef", color: "#c2185b",          name: "Apoyo Psicológico",  desc: "Atención especializada 24/7" },
  { icon: "fa-clipboard-list",        bg: "#e8f9f5", color: "#065f46",          name: "Cómo Denunciar",     desc: "Guía paso a paso" },
];

export const CONTACTS = [
  { icon: "fa-phone-volume",  name: "Línea Nacional INMUJERES", phone: "800 900 1000" },
  { icon: "fa-shield-halved", name: "CNDH",                     phone: "800 202 3350" },
  { icon: "fa-hospital",      name: "Emergencias",              phone: "911" },
];

/* Variables que faltaban en tu código */
export const TABS = [
  { id: "inicio", label: "Inicio", icon: "fa-house" },
  { id: "noticias", label: "Noticias", icon: "fa-newspaper" },
  { id: "testimonios", label: "Testimonios", icon: "fa-comment-dots" },
  { id: "leyes", label: "Leyes", icon: "fa-scale-balanced" }
];

export const MENU = [
  { id: "inicio", label: "Inicio", icon: "fa-house" },
  { id: "guardados", label: "Guardados", icon: "fa-bookmark" },
  { id: "mensajes", label: "Mensajes", icon: "fa-envelope" }
];

export const TRENDING = [
  { cat: "Noticias", tag: "#LeyOlimpia", count: "1.2k posts" },
  { cat: "Testimonios", tag: "MiHistoria", count: "850 posts" }
];

/* Formateadores */
export function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d) / 1000;
  if (diff < 3600)  return `Hace ${Math.round(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.round(diff / 3600)} h`;
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

export function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}