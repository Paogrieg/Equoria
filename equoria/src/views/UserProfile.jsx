import { useState, useEffect } from "react";
import { T, COMPLAINT_COLORS, TABS } from "../constants/theme";
import { fmtDate, fmtDateShort } from "../utils/formatters";
import { apiFetch } from "../api/client";
import { Avatar, Card, CardHeader, InfoRow, Spinner, ErrorMsg } from "../components/SharedUI";

export default function UserProfile({ userId, token, onBack }) {
  const [activeTab, setActiveTab] = useState(0);

  /* data state */
  const [user,        setUser]        = useState(null);
  const [complaints,  setComplaints]  = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [contacts,    setContacts]    = useState([]);

  /* loading / error per resource */
  const [loading, setLoading] = useState({ user: true, complaints: true, testimonies: true, contacts: true });
  const [errors,  setErrors]  = useState({});

  const setDone  = (key) => setLoading(p => ({ ...p, [key]: false }));
  const setError = (key, msg) => { setErrors(p => ({ ...p, [key]: msg })); setDone(key); };

  useEffect(() => {
    if (!userId || !token) return;
    apiFetch(`/users/${userId}`, token)
      .then(r => { setUser(r.data ?? r); setDone("user"); })
      .catch(e => setError("user", `No se pudo cargar el perfil: ${e.message}`));
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) return;
    apiFetch("/complaint", token)
      .then(r => {
        const all = r.data ?? r;
        setComplaints(all.filter(c => c.user_id === userId));
        setDone("complaints");
      })
      .catch(e => setError("complaints", `No se pudieron cargar las denuncias: ${e.message}`));
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) return;
    apiFetch("/testimonials", token)
      .then(r => {
        const all = r.data ?? r;
        setTestimonies(all.filter(t => t.user_id === userId));
        setDone("testimonies");
      })
      .catch(e => setError("testimonies", `No se pudieron cargar los testimonios: ${e.message}`));
  }, [userId, token]);

  useEffect(() => {
    if (!userId || !token) return;
    apiFetch("/emergencyContact", token)
      .then(r => {
        const all = r.data ?? r;
        setContacts(all.filter(c => c.user_id === userId));
        setDone("contacts");
      })
      .catch(e => setError("contacts", `No se pudieron cargar los contactos: ${e.message}`));
  }, [userId, token]);

  if (!userId || !token) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <ErrorMsg msg="Falta userId o token. Pasa ambos como props al componente." />
      </div>
    );
  }

  if (loading.user) return <Spinner />;
  if (errors.user)  return <ErrorMsg msg={errors.user} />;

  const resolvedCount = complaints.filter(c => c.status === "resuelto").length;
  const verifiedBadge = user.verificated
    ? { label: "Verificada", bg: "rgba(16,185,129,0.12)", color: T.green,   border: "rgba(16,185,129,0.3)" }
    : { label: "Pendiente",  bg: "rgba(232,121,160,0.12)", color: T.rose,  border: "rgba(232,121,160,0.3)" };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", color: T.textPrimary }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.textPrimary, display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
            <i className="fa-solid fa-user" style={{ color: T.plum600 }}></i>
            Perfil de Usuaria
          </h2>
          <p style={{ fontSize: 13, color: T.textSecondary, margin: "4px 0 0" }}>
            Información detallada de la cuenta
          </p>
        </div>
        {onBack && (
          <button onClick={onBack} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: T.white, border: `1px solid ${T.plum200}`,
            color: T.plum600, borderRadius: 10, padding: "9px 16px",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600, boxShadow: T.shadow,
          }}>
            <i className="fa-solid fa-arrow-left"></i> Volver
          </button>
        )}
      </div>

      <Card style={{ padding: 0, marginBottom: 24, overflow: "visible" }}>
        <div style={{
          height: 160, borderRadius: "16px 16px 0 0", position: "relative", overflow: "hidden",
          background: "linear-gradient(135deg, #4a1e87 0%, #8b3fbf 50%, #e879a0 100%)",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)",
          }} />
        </div>

        <div style={{ position: "relative", padding: "0 28px 20px" }}>
          <div style={{ position: "absolute", top: -44, left: 28 }}>
            <Avatar user={user} size={88} />
          </div>
          <div style={{ paddingTop: 52, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.textPrimary }}>
                {user.name} {user.lastname}
              </div>
              <div style={{ fontSize: 13, color: T.textSecondary, marginTop: 3 }}>
                {user.rol?.charAt(0).toUpperCase() + user.rol?.slice(1)} · Registro: {fmtDate(user.created_at)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{
                background: verifiedBadge.bg, color: verifiedBadge.color,
                border: `1px solid ${verifiedBadge.border}`,
                borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600,
              }}>
                <i className={`fa-solid ${user.verificated ? "fa-circle-check" : "fa-hourglass-half"}`} style={{ marginRight: 6 }}></i>
                {verifiedBadge.label}
              </span>
              <span style={{
                background: T.plum100, color: T.plum600, border: `1px solid ${T.plum200}`,
                borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600,
              }}>
                <i className="fa-solid fa-shield-halved" style={{ marginRight: 6 }}></i>
                {user.rol?.charAt(0).toUpperCase() + user.rol?.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${T.plum100}`, display: "flex" }}>
          {[
            { label: "Denuncias",       value: loading.complaints  ? "…" : complaints.length,   icon: "fa-file-lines",  color: T.rose },
            { label: "Casos resueltos", value: loading.complaints  ? "…" : resolvedCount,        icon: "fa-circle-check",color: T.green },
            { label: "Testimonios",     value: loading.testimonies ? "…" : testimonies.length,   icon: "fa-comment",     color: T.plum400 },
            { label: "Contactos",       value: loading.contacts    ? "…" : contacts.length,      icon: "fa-phone",       color: T.gold },
          ].map((s, i) => (
            <div key={i} style={{
              flex: 1, padding: "16px 0", textAlign: "center",
              borderRight: i < 3 ? `1px solid ${T.plum100}` : "none",
            }}>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Playfair Display', serif", color: s.color }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: T.textSecondary, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                <i className={`fa-solid ${s.icon}`} style={{ marginRight: 5 }}></i>{s.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${T.plum100}`, display: "flex", padding: "0 28px", overflowX: "auto" }}>
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "14px 18px", whiteSpace: "nowrap",
              fontFamily: "'DM Sans', sans-serif", fontSize: 14,
              fontWeight: activeTab === i ? 600 : 400,
              color: activeTab === i ? T.plum600 : T.textSecondary,
              borderBottom: activeTab === i ? `2px solid ${T.rose}` : "2px solid transparent",
              transition: "all 0.2s",
            }}>
              <i className={`fa-solid ${tab.icon}`} style={{ marginRight: 7, fontSize: 12 }}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {activeTab === 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card>
            <CardHeader title="Información Personal" />
            <InfoRow icon="fa-envelope"      label="Correo electrónico" value={user.email} />
            <InfoRow icon="fa-phone"         label="Teléfono"           value={user.phone_number} />
            <InfoRow icon="fa-cake-candles"  label="Fecha de nacimiento"value={fmtDate(user.dateBirth)} />
            <InfoRow icon="fa-calendar"      label="Registro"           value={fmtDate(user.created_at)} />
            <InfoRow icon="fa-id-badge"      label="Rol"                value={user.rol} />
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card>
              <CardHeader title="Estado de la Cuenta" />
              {[
                { label: "Verificación de identidad",     done: !!user.verificated },
                { label: "Correo registrado",             done: !!user.email },
                { label: "Teléfono registrado",           done: !!user.phone_number },
                { label: "Contacto de emergencia",        done: contacts.length > 0 },
                { label: "Al menos una denuncia",         done: complaints.length > 0 },
                { label: "Al menos un testimonio",        done: testimonies.length > 0 },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 5 ? `1px solid ${T.plum100}` : "none" }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: item.done ? "rgba(16,185,129,0.12)" : T.plum100,
                    border: `1.5px solid ${item.done ? T.green : T.plum300}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: item.done ? T.green : T.plum300,
                  }}>
                    <i className={`fa-solid ${item.done ? "fa-check" : "fa-minus"}`}></i>
                  </div>
                  <span style={{ fontSize: 13, color: item.done ? T.textPrimary : T.textSecondary }}>{item.label}</span>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <Card>
          <CardHeader
            title="Denuncias"
            subtitle={loading.complaints ? "Cargando…" : `${complaints.length} denuncia(s) registrada(s)`}
          />
          {loading.complaints ? <Spinner /> :
           errors.complaints   ? <ErrorMsg msg={errors.complaints} /> :
           complaints.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: T.textSecondary, fontSize: 14 }}>
              <i className="fa-solid fa-file-circle-xmark" style={{ fontSize: 28, marginBottom: 10, display: "block", color: T.plum300 }}></i>
              Sin denuncias registradas
            </div>
           ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Título", "Tipo", "Estado", "Fecha"].map(h => (
                    <th key={h} style={{ textAlign: "left", fontSize: 11, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 12px", borderBottom: `1px solid ${T.plum100}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {complaints.map((c, i) => {
                  const st = COMPLAINT_COLORS[c.status] ?? COMPLAINT_COLORS.pendiente;
                  return (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? "transparent" : T.surface }}>
                      <td style={{ padding: "12px 12px", fontSize: 14, fontWeight: 500, color: T.textPrimary }}>{c.title}</td>
                      <td style={{ padding: "12px 12px", fontSize: 13, color: T.textSecondary }}>{c.type}</td>
                      <td style={{ padding: "12px 12px" }}>
                        <span style={{ background: st.bg, color: st.color, border: `1px solid ${st.border}`, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "12px 12px", fontSize: 12, color: T.textSecondary }}>{fmtDateShort(c.date ?? c.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
           )}
        </Card>
      )}

      {activeTab === 2 && (
        <Card>
          <CardHeader
            title="Testimonios"
            subtitle={loading.testimonies ? "Cargando…" : `${testimonies.length} testimonio(s)`}
          />
          {loading.testimonies ? <Spinner /> :
           errors.testimonies   ? <ErrorMsg msg={errors.testimonies} /> :
           testimonies.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: T.textSecondary, fontSize: 14 }}>
              <i className="fa-solid fa-comment-slash" style={{ fontSize: 28, marginBottom: 10, display: "block", color: T.plum300 }}></i>
              Sin testimonios registrados
            </div>
           ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {testimonies.map((t) => (
                <div key={t.id} style={{
                  padding: "16px 20px", borderRadius: 12,
                  background: T.plum100, border: `1px solid ${T.plum200}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{
                      background: t.anonymous ? "rgba(107,47,160,0.12)" : "rgba(16,185,129,0.12)",
                      color: t.anonymous ? T.plum600 : T.green,
                      border: `1px solid ${t.anonymous ? T.plum300 : "rgba(16,185,129,0.3)"}`,
                      borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 600,
                    }}>
                      <i className={`fa-solid ${t.anonymous ? "fa-user-secret" : "fa-user-check"}`} style={{ marginRight: 5 }}></i>
                      {t.anonymous ? "Anónimo" : "Público"}
                    </span>
                    <span style={{ fontSize: 12, color: T.textSecondary }}>{fmtDateShort(t.created_at)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: T.textPrimary, lineHeight: 1.7, margin: 0 }}>{t.content}</p>
                </div>
              ))}
            </div>
           )}
        </Card>
      )}

      {activeTab === 3 && (
        <Card>
          <CardHeader
            title="Contactos de Emergencia"
            subtitle={loading.contacts ? "Cargando…" : `${contacts.length} contacto(s) registrado(s)`}
          />
          {loading.contacts ? <Spinner /> :
           errors.contacts    ? <ErrorMsg msg={errors.contacts} /> :
           contacts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: T.textSecondary, fontSize: 14 }}>
              <i className="fa-solid fa-phone-slash" style={{ fontSize: 28, marginBottom: 10, display: "block", color: T.plum300 }}></i>
              Sin contactos de emergencia registrados
            </div>
           ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {contacts.map((c) => (
                <div key={c.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "16px 20px", borderRadius: 12,
                  background: T.plum100, border: `1px solid ${T.plum200}`,
                  flexWrap: "wrap", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${T.rose}, ${T.plum400})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: T.white, fontSize: 16, fontWeight: 700,
                      fontFamily: "'Playfair Display', serif", flexShrink: 0,
                    }}>
                      {(c.name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary }}>
                        {c.name} {c.lastname}
                      </div>
                      <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>
                        <i className="fa-solid fa-heart" style={{ marginRight: 5, color: T.rose, fontSize: 10 }}></i>
                        {c.relation}
                      </div>
                    </div>
                  </div>
                  <a href={`tel:${c.phone_number}`} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: T.white, border: `1px solid ${T.plum200}`,
                    color: T.plum600, borderRadius: 10, padding: "8px 14px",
                    textDecoration: "none", fontSize: 13, fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif", boxShadow: T.shadow,
                  }}>
                    <i className="fa-solid fa-phone"></i> {c.phone_number}
                  </a>
                </div>
              ))}
            </div>
           )}
        </Card>
      )}
    </div>
  );
}