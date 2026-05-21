export const initials = (u) =>
  u ? `${(u.name || "?")[0]}${(u.lastname || "?")[0]}`.toUpperCase() : "??";

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" }) : "—";

export const fmtDateShort = (d) =>
  d ? new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" }) : "—";