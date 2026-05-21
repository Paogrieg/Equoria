import { useState, useEffect, useRef, useCallback } from "react";

/* ─── LOGO (base64 embedded) ─── */
const LOGO_URL = "https://raw.githubusercontent.com/nicofuentesr/equoria-assets/main/logo.png";

/* ─── DESIGN TOKENS ─── */
const C = {
  p900:"#1a0a2e", p800:"#2d1254", p700:"#4a1e87", p600:"#6b2fa0",
  p500:"#8b3fbf", p400:"#a855d4", p300:"#c084e8", p200:"#ddb5f5", p100:"#f3e8ff",
  rose:"#e879a0", roseL:"#fce4ef", gold:"#f0c060",
  surf:"#faf7ff", txt:"#1a0a2e", txt2:"#6b5380", white:"#ffffff",
  green:"#10b981", shadow:"0 4px 24px rgba(107,47,160,0.12)",
  shadowLg:"0 12px 40px rgba(107,47,160,0.18)",
};

/* ─── KEYFRAMES injected once ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'DM Sans',sans-serif;background:${C.surf};color:${C.txt};min-height:100vh;overflow-x:hidden}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:${C.p200};border-radius:3px}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.6;transform:scale(1.3)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
  table{width:100%;border-collapse:collapse}
  thead th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${C.txt2};font-weight:600;padding:0 0 12px;border-bottom:1px solid rgba(107,47,160,0.08)}
  tbody tr{transition:background .15s;cursor:pointer}
  tbody tr:hover td{background:${C.p100}}
  tbody td{padding:12px 12px 12px 0;font-size:13px;border-bottom:1px solid rgba(107,47,160,0.05)}
  tbody tr:last-child td{border-bottom:none}
  input:focus,button:focus{outline:none}
`;

/* ════════════════════════════════════════
   SHARED COMPONENTS
   ════════════════════════════════════════ */

function LogoImg({ size = 40, radius = 10 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, overflow: "hidden",
      background: `linear-gradient(135deg,${C.rose},${C.p400})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 16px rgba(232,121,160,0.4)", flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.45, color: "white" }}>🛡</span>
    </div>
  );
}

function Badge({ cls, children }) {
  const styles = {
    pen:  { bg:"#fff8e6", color:"#92610a", dot:"#f0c060" },
    rev:  { bg:"#ede9ff", color:"#5b21b6", dot:C.p400 },
    res:  { bg:"#d1fae5", color:"#065f46", dot:C.green },
    anon: { bg:C.p100,   color:C.p600,    dot:C.p400 },
  };
  const s = styles[cls] || styles.anon;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:20,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:s.dot,display:"inline-block" }} />
      {children}
    </span>
  );
}

function Btn({ primary, outline, children, onClick, style: sx }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:8,
    borderRadius:10, fontSize:13, fontWeight:600,
    cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
    padding:"10px 20px", border:"none", transition:"all .2s",
  };
  const s = primary ? {
    ...base, ...sx,
    background:`linear-gradient(135deg,${C.p700},${C.p500})`,
    color:C.white,
    boxShadow: hov?"0 8px 24px rgba(107,47,160,0.45)":"0 4px 14px rgba(107,47,160,0.3)",
    transform: hov?"translateY(-2px)":"none",
  } : outline ? {
    ...base, ...sx,
    background: hov ? C.p100 : "none",
    border:`1.5px solid ${C.p300}`,
    color: C.p600,
  } : { ...base, ...sx, background: hov?C.p100:"none", border:`1.5px solid rgba(107,47,160,0.2)`, color:C.p700 };
  return (
    <button style={s} onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════
   SIDEBAR (dashboard/profile)
   ════════════════════════════════════════ */
const NAV = [
  { section:"Principal" },
  { id:"inicio",   icon:"fa-house",       label:"Inicio" },
  { id:"usuarias", icon:"fa-user",         label:"Usuarias" },
  { id:"denuncias",icon:"fa-file-lines",   label:"Denuncias", badge:12 },
  { id:"testimonios",icon:"fa-comment",   label:"Testimonios" },
  { id:"noticias", icon:"fa-newspaper",   label:"Noticias" },
  { section:"Recursos" },
  { id:"leyes",    icon:"fa-book",         label:"Leyes" },
  { id:"emergencia",icon:"fa-phone",      label:"Contactos Emergencia" },
  { id:"verificaciones",icon:"fa-circle-check",label:"Verificaciones",badge:5 },
  { id:"pagos",    icon:"fa-credit-card",  label:"Pagos" },
  { section:"Sistema" },
  { id:"configuracion",icon:"fa-gear",    label:"Configuración" },
  { id:"perfil",   icon:"fa-circle-user", label:"Mi Perfil" },
];

function Sidebar({ page, setPage, setView }) {
  return (
    <aside style={{
      position:"fixed", left:0, top:0, bottom:0, width:260,
      background:`linear-gradient(160deg,${C.p900} 0%,${C.p800} 60%,${C.p700} 100%)`,
      display:"flex", flexDirection:"column", zIndex:100,
      boxShadow:"4px 0 32px rgba(26,10,46,0.35)",
    }}>
      {/* Logo */}
      <div style={{ padding:"28px 24px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}
        onClick={()=>setView("landing")}>
        <LogoImg size={44} radius={12} />
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.white, letterSpacing:1 }}>Equoria</div>
          <div style={{ fontSize:10, color:C.p300, textTransform:"uppercase", letterSpacing:2, marginTop:1 }}>Plataforma de apoyo</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"16px 12px", display:"flex", flexDirection:"column", gap:2, overflowY:"auto" }}>
        {NAV.map((n, i) => n.section ? (
          <div key={i} style={{ fontSize:10, textTransform:"uppercase", letterSpacing:2, color:C.p400, padding:"12px 12px 4px", fontWeight:600 }}>{n.section}</div>
        ) : (
          <SideItem key={n.id} n={n} active={page===n.id} onClick={()=>setPage(n.id)} />
        ))}
      </nav>

      {/* Emergency */}
      <div style={{ margin:14, padding:14, background:"rgba(232,121,160,0.15)", border:"1px solid rgba(232,121,160,0.3)", borderRadius:14 }}>
        <div style={{ fontSize:11, color:C.p200, marginBottom:8, fontWeight:500 }}>
          <i className="fa-solid fa-circle-info" /> Línea de Crisis
        </div>
        <button style={{
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          background:C.rose, color:"white", border:"none", borderRadius:8,
          padding:10, width:"100%", fontSize:13, fontWeight:600,
          cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          boxShadow:"0 4px 12px rgba(232,121,160,0.4)",
        }}>
          <i className="fa-solid fa-phone-volume" /> 800-900-1000
        </button>
      </div>

      {/* Logout */}
      <div style={{ margin:"0 14px 16px" }}>
        <button onClick={()=>setView("landing")} style={{
          width:"100%", padding:"11px", background:"rgba(232,121,160,0.12)",
          color:C.rose, border:"1px solid rgba(232,121,160,0.3)",
          borderRadius:10, cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
          fontSize:13, fontWeight:600, display:"flex", alignItems:"center",
          justifyContent:"center", gap:8,
        }}>
          <i className="fa-solid fa-right-from-bracket" /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

function SideItem({ n, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"flex", alignItems:"center", gap:12, padding:"10px 13px",
        borderRadius:10, cursor:"pointer", border:"none",
        background: active ? "linear-gradient(90deg,rgba(232,121,160,0.25),rgba(168,85,212,0.15))" : hov ? "rgba(255,255,255,0.08)" : "none",
        color: active||hov ? C.white : "rgba(255,255,255,0.6)",
        fontSize:14, fontFamily:"'DM Sans',sans-serif", width:"100%",
        fontWeight: active ? 600 : 400, textAlign:"left",
        borderLeft: active ? `3px solid ${C.rose}` : "3px solid transparent",
        transition:"all .2s",
      }}>
      <i className={`fa-solid ${n.icon}`} style={{ width:18, textAlign:"center", fontSize:16 }} />
      <span style={{ flex:1 }}>{n.label}</span>
      {n.badge && <span style={{ background:C.rose, color:"white", fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:10 }}>{n.badge}</span>}
    </button>
  );
}

/* ─── Topbar ─── */
function Topbar({ title, setPage }) {
  return (
    <header style={{
      background:C.white, borderBottom:"1px solid rgba(107,47,160,0.1)",
      padding:"14px 28px", display:"flex", alignItems:"center", gap:14,
      position:"sticky", top:0, zIndex:50, boxShadow:"0 2px 12px rgba(107,47,160,0.06)",
    }}>
      <div style={{ flex:1, fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:600, color:C.p800 }}>{title}</div>
      <div style={{ display:"flex", alignItems:"center", background:C.p100, border:`1px solid rgba(107,47,160,0.15)`, borderRadius:10, padding:"8px 14px", gap:8, minWidth:220 }}>
        <i className="fa-solid fa-magnifying-glass" style={{ color:C.txt2, fontSize:13 }} />
        <input placeholder="Buscar…" style={{ border:"none", background:"transparent", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:C.txt, width:"100%" }} />
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <TopBtn><i className="fa-solid fa-bell" /><span style={{ position:"absolute", top:6, right:6, width:8, height:8, background:C.rose, borderRadius:"50%", border:"1px solid white" }} /></TopBtn>
        <TopBtn><i className="fa-regular fa-clipboard" /></TopBtn>
        <div onClick={()=>setPage("perfil")} style={{
          width:38, height:38, borderRadius:10, cursor:"pointer",
          background:`linear-gradient(135deg,${C.p500},${C.rose})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"white", fontSize:14, fontWeight:600,
        }}>AD</div>
      </div>
    </header>
  );
}
function TopBtn({ children }) {
  const [h,setH]=useState(false);
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ width:38,height:38,borderRadius:10,border:`1px solid rgba(107,47,160,0.15)`,background:h?C.p100:C.white,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,position:"relative",transition:"all .2s",color:C.p600 }}>{children}</div>;
}

/* ════════════════════════════════════════
   CAROUSEL (shared)
   ════════════════════════════════════════ */
const SLIDES = [
  { bg:"linear-gradient(120deg,#2d1254,#6b2fa0,#e879a0)", chip:"Nuevo recurso", chipColor:C.green, title:"Guía de derechos legales 2026", desc:"Conoce las leyes que te protegen y cómo activarlas.", cta:"Descargar guía" },
  { bg:"linear-gradient(120deg,#1a0a2e,#4a1e87,#8b3fbf)", chip:"Campaña activa", chipColor:C.gold, title:"Red de apoyo comunitario", desc:"Únete a nuestra red de voluntarias y multiplicadoras.", cta:"Unirme ahora" },
  { bg:"linear-gradient(120deg,#3d0c4e,#a855d4,#e879a0)", chip:"Taller gratuito", chipColor:C.p300, title:"Salud mental y resiliencia", desc:"Taller virtual — Sáb. 7 jun, 11:00 AM. Cupos limitados.", cta:"Reservar lugar" },
  { bg:"linear-gradient(120deg,#0d0420,#2d1254,#6b2fa0)", chip:"Noticia", chipColor:C.rose, title:"Nuevas reformas en ley de protección", desc:"El congreso aprobó cambios importantes en materia de violencia.", cta:"Leer más" },
];

function Carousel() {
  const [cur, setCur] = useState(0);
  const max = SLIDES.length - 1;
  const timer = useRef(null);
  const go = useCallback(i => setCur(Math.max(0, Math.min(i, max))), [max]);
  const start = useCallback(() => { timer.current = setInterval(() => setCur(p => p < max ? p+1 : 0), 4500); }, [max]);
  const stop = useCallback(() => clearInterval(timer.current), []);
  useEffect(() => { start(); return stop; }, [start, stop]);

  return (
    <div style={{ marginBottom:24 }}
      onMouseEnter={stop} onMouseLeave={start}>
      <div style={{ position:"relative", borderRadius:20, overflow:"hidden", height:240, boxShadow:C.shadowLg }}>
        <div style={{ display:"flex", height:"100%", transform:`translateX(-${cur*100}%)`, transition:"transform .55s cubic-bezier(.77,0,.18,1)" }}>
          {SLIDES.map((s,i) => (
            <div key={i} style={{
              minWidth:"100%", height:"100%", background:s.bg,
              display:"flex", alignItems:"center", padding:"32px 44px",
              position:"relative", overflow:"hidden",
            }}>
              <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
              <div style={{ position:"absolute", right:-40, top:-40, width:240, height:240, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
              <div style={{ position:"relative", zIndex:1, maxWidth:520 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:20, padding:"3px 12px", fontSize:10, textTransform:"uppercase", letterSpacing:2, color:"rgba(255,255,255,0.9)", fontWeight:600, marginBottom:10 }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:s.chipColor,display:"inline-block" }} />{s.chip}
                </div>
                <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:700, color:"white", lineHeight:1.25, marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.72)", lineHeight:1.6, marginBottom:14 }}>{s.desc}</div>
                <button style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.rose, color:"white", padding:"9px 20px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", border:"none", boxShadow:"0 4px 16px rgba(232,121,160,0.4)" }}>{s.cta} →</button>
              </div>
            </div>
          ))}
        </div>
        {/* Arrows */}
        {[["◀","left",14], ["▶","right",14]].map(([ch, side, val]) => (
          <div key={side} onClick={()=>go(cur+(side==="right"?1:-1))} style={{
            position:"absolute", top:"50%", transform:"translateY(-50%)", [side]:val,
            background:"rgba(255,255,255,0.15)", border:"1px solid rgba(255,255,255,0.25)",
            color:"white", width:34, height:34, borderRadius:"50%",
            display:"flex", alignItems:"center", justifyContent:"center",
            cursor:"pointer", fontSize:14, backdropFilter:"blur(8px)", zIndex:2,
          }}>{ch}</div>
        ))}
        {/* Dots */}
        <div style={{ position:"absolute", bottom:14, right:18, display:"flex", gap:6, zIndex:2 }}>
          {SLIDES.map((_,i) => (
            <div key={i} onClick={()=>go(i)} style={{ height:6, borderRadius:3, cursor:"pointer", width:i===cur?20:6, background:i===cur?C.rose:"rgba(255,255,255,0.35)", transition:"all .3s" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   LANDING PAGE
   ════════════════════════════════════════ */
function LandingPage({ setView }) {
  return (
    <div style={{ background:C.surf, minHeight:"100vh" }}>
      <LandingNav setView={setView} />
      <LandingHero setView={setView} />
      <LandingFeatures />
      <LandingCarouselSection />
      <LandingFooter setView={setView} />
    </div>
  );
}

function LandingNav({ setView }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:100, background:C.white,
      borderBottom:`1px solid rgba(107,47,160,${scrolled?.18:.06})`,
      boxShadow: scrolled?"0 4px 20px rgba(26,10,46,0.1)":"0 2px 12px rgba(26,10,46,0.04)",
      padding:"0 48px", height:68, display:"flex", alignItems:"center", gap:28,
      transition:"box-shadow .3s,border-color .3s",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginRight:"auto", cursor:"pointer" }}>
        <LogoImg size={38} />
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.p800, letterSpacing:.5 }}>Equoria</span>
      </div>
      {["Servicios","Recursos","Noticias","Leyes","Testimonios"].map(l => <LandingLink key={l}>{l}</LandingLink>)}
      <div style={{ display:"flex", gap:10, marginLeft:"auto" }}>
        <Btn onClick={()=>setView("dashboard")}>Iniciar sesión</Btn>
        <Btn primary onClick={()=>setView("dashboard")}>Registrarse</Btn>
      </div>
    </nav>
  );
}
function LandingLink({ children }) {
  const [h,setH]=useState(false);
  return <a href="#" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ fontSize:14,fontWeight:500,textDecoration:"none",whiteSpace:"nowrap",color:h?C.p600:C.txt2,transition:"color .2s" }}>{children}</a>;
}

function LandingHero({ setView }) {
  return (
    <section style={{ padding:"60px 48px 0", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center", maxWidth:1200, margin:"0 auto" }}>
      {/* Left */}
      <div style={{ animation:"fadeUp .7s ease both" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.roseL, color:C.rose, fontSize:11, fontWeight:600, letterSpacing:2, textTransform:"uppercase", padding:"6px 14px", borderRadius:20, marginBottom:20 }}>
          💜 Plataforma de prevención y apoyo
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:52, lineHeight:1.12, fontWeight:700, color:C.p900, marginBottom:8 }}>
          Tu red de<br />apoyo{" "}
          <em style={{ fontStyle:"italic", background:`linear-gradient(135deg,${C.rose},${C.p400})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>siempre</em>
          <br />contigo
        </h1>
        <p style={{ fontSize:16, color:C.txt2, lineHeight:1.65, maxWidth:420, marginBottom:32, fontWeight:400 }}>
          Accede a recursos, asesoría legal y acompañamiento especializado para proteger tus derechos y tu bienestar.
        </p>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <Btn primary onClick={()=>setView("dashboard")} style={{ padding:"14px 32px", fontSize:15 }}>→ Comenzar ahora</Btn>
          <Btn style={{ padding:"14px 32px", fontSize:15 }}>▶ Ver cómo funciona</Btn>
        </div>
        <div style={{ display:"flex", gap:28, marginTop:36, paddingTop:28, borderTop:`1px solid rgba(107,47,160,0.1)` }}>
          {[["4,800+","Casos atendidos"],["120","Asesoras activas"],["24/7","Línea de crisis"]].map(([n,l])=>(
            <div key={l}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:C.p700 }}>{n}</div>
              <div style={{ fontSize:12, color:C.txt2, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right */}
      <div style={{ position:"relative", height:400, borderRadius:20, overflow:"hidden", background:`linear-gradient(160deg,${C.p900},${C.p700})`, boxShadow:"0 20px 60px rgba(26,10,46,0.25)", animation:"fadeUp .7s .15s ease both" }}>
        <div style={{ position:"absolute", bottom:-40, right:-40, width:240, height:240, borderRadius:"50%", background:"rgba(232,121,160,0.2)", filter:"blur(40px)" }} />
        <div style={{ position:"absolute", top:-20, left:40, width:150, height:150, borderRadius:"50%", background:"rgba(240,192,96,0.15)", filter:"blur(30px)" }} />
        <div style={{ position:"absolute", top:20, left:20, zIndex:2, background:"rgba(255,255,255,0.12)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:10, padding:"10px 16px", color:C.white, fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block",animation:"pulse 2s infinite" }} />
          Línea de emergencia activa
        </div>
        <div style={{ position:"absolute", bottom:100, right:20, zIndex:2, background:"rgba(255,255,255,0.1)", backdropFilter:"blur(12px)", border:"1px solid rgba(255,255,255,0.2)", borderRadius:12, padding:"12px 16px", animation:"float 4s ease-in-out infinite" }}>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:1, textTransform:"uppercase" }}>Casos este mes</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.white, fontWeight:600 }}>312</div>
          <div style={{ fontSize:11, color:C.green, display:"flex", alignItems:"center", gap:4, marginTop:2 }}>↑ +18% vs mes anterior</div>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top,rgba(26,10,46,0.95),transparent)", padding:28 }}>
          <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:2, color:C.rose, fontWeight:600, marginBottom:8 }}>Protección integral</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, color:C.white, fontWeight:600, lineHeight:1.3 }}>Acompañamos cada paso<br />de tu proceso</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", marginTop:6 }}>Legal · Psicológico · Social · Emergencia</div>
        </div>
      </div>
    </section>
  );
}

function LandingFeatures() {
  const feats = [
    { icon:"🛡️", title:"Protección 24/7", desc:"Línea de emergencia activa todo el año, sin costo." },
    { icon:"👔", title:"Asesoría legal", desc:"Asesoras certificadas que conocen la ley a fondo." },
    { icon:"🔒", title:"Confidencialidad total", desc:"Tu información está protegida y nunca se compartirá." },
    { icon:"📖", title:"Recursos gratuitos", desc:"Guías, leyes y talleres sin costo para todas." },
  ];
  return (
    <div style={{ background:C.white, borderTop:`1px solid rgba(107,47,160,0.08)`, borderBottom:`1px solid rgba(107,47,160,0.08)`, padding:"36px 48px", marginTop:48 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
        {feats.map(f=>(
          <div key={f.title} style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
            <div style={{ width:40,height:40,borderRadius:10,background:C.p100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>{f.icon}</div>
            <div>
              <div style={{ fontSize:14,fontWeight:600,color:C.p800,marginBottom:3 }}>{f.title}</div>
              <div style={{ fontSize:12,color:C.txt2,lineHeight:1.5 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LandingCarouselSection() {
  return (
    <section style={{ padding:"56px 48px", maxWidth:1200, margin:"0 auto" }}>
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, textTransform:"uppercase", letterSpacing:2, color:C.rose, fontWeight:600, marginBottom:8 }}>Anuncios y campañas</div>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:C.p900 }}>Recursos y novedades</div>
      </div>
      <Carousel />
    </section>
  );
}

function LandingFooter({ setView }) {
  return (
    <footer style={{ background:C.p900, padding:"32px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <LogoImg size={34} radius={8} />
        <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:C.white, fontWeight:600 }}>Equoria</span>
      </div>
      <div style={{ display:"flex", gap:22 }}>
        {["Privacidad","Términos","Contacto","Emergencia"].map(l=>(
          <FootLink key={l}>{l}</FootLink>
        ))}
      </div>
      <div style={{ fontSize:12, color:C.p400 }}>© 2026 Equoria · Todos los derechos reservados</div>
    </footer>
  );
}
function FootLink({ children }) {
  const [h,setH]=useState(false);
  return <a href="#" onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ fontSize:13, textDecoration:"none", color:h?C.rose:C.p300, transition:"color .2s" }}>{children}</a>;
}

/* ════════════════════════════════════════
   DASHBOARD (INICIO)
   ════════════════════════════════════════ */
function DashboardApp({ setView }) {
  const [page, setPage] = useState("inicio");

  const titles = { inicio:"Inicio", usuarias:"Usuarias", denuncias:"Denuncias", testimonios:"Testimonios", noticias:"Noticias", leyes:"Leyes", emergencia:"Contactos de Emergencia", verificaciones:"Verificaciones", pagos:"Pagos", configuracion:"Configuración", perfil:"Mi Perfil" };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <Sidebar page={page} setPage={setPage} setView={setView} />
      <div style={{ marginLeft:260, flex:1, display:"flex", flexDirection:"column" }}>
        <Topbar title={titles[page]||"Equoria"} setPage={setPage} />
        <main style={{ padding:"24px 28px", flex:1 }}>
          {page==="inicio"        && <DashHome />}
          {page==="perfil"        && <ProfilePage />}
          {page==="usuarias"      && <SimplePage icon="👥" title="Usuarias" desc="Gestión de usuarias registradas" />}
          {page==="denuncias"     && <SimplePage icon="📋" title="Denuncias" desc="Gestión de denuncias activas" />}
          {page==="testimonios"   && <SimplePage icon="💬" title="Testimonios" desc="Testimonios de la comunidad" />}
          {page==="noticias"      && <SimplePage icon="📰" title="Noticias" desc="Noticias y actualizaciones" />}
          {page==="leyes"         && <SimplePage icon="⚖️" title="Marco Legal" desc="Leyes y normativas vigentes" />}
          {page==="emergencia"    && <SimplePage icon="📞" title="Contactos de Emergencia" desc="Directorio de contactos de emergencia" />}
          {page==="verificaciones"&& <SimplePage icon="✅" title="Verificaciones" desc="Solicitudes pendientes de verificación" />}
          {page==="pagos"         && <SimplePage icon="💳" title="Pagos" desc="Historial y métodos de pago" />}
          {page==="configuracion" && <SimplePage icon="⚙️" title="Configuración" desc="Ajustes del sistema" />}
        </main>
      </div>
    </div>
  );
}

function DashHome() {
  const stats = [
    { icon:"fa-users",       ic:"si-v", value:"1,284", label:"Usuarias registradas", sub:"+47 este mes",   trend:"↑ 12%", up:true },
    { icon:"fa-file-lines",  ic:"si-r", value:"342",   label:"Denuncias activas",    sub:"12 sin revisar", trend:"↑ 8%",  up:true },
    { icon:"fa-newspaper",   ic:"si-g", value:"89",    label:"Noticias publicadas",  sub:"5 en revisión",  trend:"= Estable", nu:true },
    { icon:"fa-circle-check",ic:"si-t", value:"218",   label:"Casos resueltos",      sub:"Este mes: 38",   trend:"↑ 23%", up:true },
  ];
  const siStyle = { "si-v":C.p100, "si-r":C.roseL, "si-g":"#fff8e6", "si-t":"#e8f9f5" };

  return (
    <div style={{ animation:"fadeUp .4s ease both" }}>
      <Carousel />

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
        {stats.map((s,i)=>(
          <StatCard key={i} s={s} bg={siStyle[s.ic]} delay={i*.05} />
        ))}
      </div>

      {/* Two col */}
      <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr", gap:20, marginBottom:20 }}>
        <DCard title="Denuncias Recientes" sub="Últimas 24 horas" action="Ver todas →">
          <table>
            <thead><tr><th>Usuaria</th><th>Tipo</th><th>Estado</th><th>Fecha</th></tr></thead>
            <tbody>
              {[
                { av:"MG", color:`${C.p500},${C.rose}`,     name:"María G.",     tipo:"Física",      badge:"pen", fecha:"Hoy, 09:14" },
                { av:"AR", color:"#a855d4,#6b2fa0",          name:"Ana R.",       tipo:"Psicológica", badge:"rev", fecha:"Hoy, 08:52" },
                { av:"LM", color:"#059669,#10b981",          name:"Laura M.",     tipo:"Sexual",      badge:"res", fecha:"Ayer, 21:30" },
                { av:"SL", color:"#f0c060,#e87d1e",          name:"Sofía L.",     tipo:"Económica",   badge:"pen", fecha:"Ayer, 18:05" },
                { av:"VH", color:`${C.rose},${C.p300}`,      name:"Valentina H.", tipo:"Digital",     badge:"rev", fecha:"Ayer, 14:22" },
              ].map((r,i)=>(
                <tr key={i}>
                  <td><div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${r.color})`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:12,fontWeight:600 }}>{r.av}</div>
                    {r.name}
                  </div></td>
                  <td>{r.tipo}</td>
                  <td><Badge cls={r.badge}>{r.badge==="pen"?"Pendiente":r.badge==="rev"?"En Revisión":"Resuelto"}</Badge></td>
                  <td style={{ color:C.txt2 }}>{r.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DCard>

        <DCard title="Tipos de Violencia" sub="Distribución este mes">
          {[
            { icon:"fa-hand-fist",  label:"Física",            count:"98 casos",  w:"72%",  grad:`${C.p600},${C.p400}` },
            { icon:"fa-brain",      label:"Psicológica",       count:"134 casos", w:"100%", grad:`${C.rose},${C.p300}` },
            { icon:"fa-triangle-exclamation",label:"Sexual",   count:"67 casos",  w:"50%",  grad:`${C.p700},${C.p500}` },
            { icon:"fa-money-bill", label:"Económica",         count:"43 casos",  w:"32%",  grad:`${C.gold},#e8a020` },
            { icon:"fa-mobile-screen",label:"Digital",         count:"29 casos",  w:"22%",  grad:`${C.p800},${C.p600}` },
          ].map((v,i)=>(
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                <span style={{ fontSize:13,fontWeight:500 }}><i className={`fa-solid ${v.icon}`} style={{ marginRight:6 }} />{v.label}</span>
                <span style={{ fontSize:13,fontWeight:600,color:C.p600 }}>{v.count}</span>
              </div>
              <div style={{ height:8,borderRadius:4,background:C.p100,overflow:"hidden" }}>
                <div style={{ height:"100%",borderRadius:4,width:v.w,background:`linear-gradient(90deg,${v.grad})`,transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
        </DCard>
      </div>

      {/* Three col */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
        <DCard title="Actividad Reciente" sub="Últimas acciones">
          {[
            { color:C.rose,  txt:"Nueva denuncia por", bold:"violencia física",     time:"Hace 3 min" },
            { color:C.p400,  txt:"Testimonio anónimo", bold:"aprobado",             time:"Hace 18 min" },
            { color:C.green, txt:"Noticia verificada:", bold:"Nueva ley Chihuahua", time:"Hace 45 min" },
            { color:C.gold,  txt:"Contacto de emergencia", bold:"registrado",       time:"Hace 1 hora" },
            { color:C.p600,  txt:"Usuaria", bold:"verificó su cuenta",              time:"Hace 2 horas" },
          ].map((a,i,arr)=>(
            <div key={i} style={{ display:"flex",gap:12,padding:"10px 0",borderBottom:i<arr.length-1?`1px solid rgba(107,47,160,0.06)`:"none" }}>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:4 }}>
                <div style={{ width:10,height:10,borderRadius:"50%",background:a.color,flexShrink:0 }} />
                {i<arr.length-1&&<div style={{ width:1,flex:1,background:"rgba(107,47,160,0.1)",marginTop:4 }} />}
              </div>
              <div>
                <div style={{ fontSize:12.5,lineHeight:1.5 }}>{a.txt} <strong>{a.bold}</strong></div>
                <div style={{ fontSize:11,color:C.txt2,marginTop:2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </DCard>

        <DCard title="Últimas Noticias" action="Ver más">
          {[
            { icon:"fa-newspaper", bg:C.p100, title:"Chihuahua refuerza protocolo de atención", meta:"✓ Verificada · Hace 2h" },
            { icon:"fa-landmark",  bg:C.roseL,title:"Nuevos refugios en el norte del país",     meta:"⌛ En revisión · Hace 5h" },
            { icon:"fa-bullhorn",  bg:"#fff8e6",title:"Campaña #NoEstásSola alcanza 2M",       meta:"✓ Verificada · Hace 8h" },
            { icon:"fa-scale-balanced",bg:"#e8f9f5",title:"Reforma al Art. 325 del Código Penal",meta:"✓ Verificada · Hace 1d" },
          ].map((n,i)=>(
            <div key={i} style={{ display:"flex",gap:12,padding:"10px 0",borderBottom:i<3?`1px solid rgba(107,47,160,0.06)`:"none",alignItems:"flex-start" }}>
              <div style={{ width:44,height:44,borderRadius:10,background:n.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0 }}>
                <i className={`fa-solid ${n.icon}`} />
              </div>
              <div>
                <div style={{ fontSize:13,fontWeight:500,marginBottom:3,lineHeight:1.4 }}>{n.title}</div>
                <div style={{ fontSize:11,color:C.txt2 }}>{n.meta}</div>
              </div>
            </div>
          ))}
        </DCard>

        <DCard title="Marco Legal" sub="Leyes vigentes" action="Ver más">
          {[
            { title:"Ley General de Acceso a una Vida Libre de Violencia", region:"🇲🇽 Federal" },
            { title:"Ley de Acceso de las Mujeres — Chihuahua",           region:"Chihuahua" },
            { title:"NOM-046 Violencia Familiar, Sexual y Género",         region:"🇲🇽 Federal" },
            { title:"Protocolo de Actuación para Feminicidio",             region:"🇲🇽 Federal" },
          ].map((l,i)=>(
            <div key={i} style={{ padding:"10px 0",borderBottom:i<3?`1px solid rgba(107,47,160,0.06)`:"none" }}>
              <div style={{ fontSize:13,fontWeight:500,marginBottom:5 }}>{l.title}</div>
              <span style={{ fontSize:11,color:C.p500,background:C.p100,display:"inline-block",padding:"2px 8px",borderRadius:4,fontWeight:600 }}>{l.region}</span>
            </div>
          ))}
        </DCard>
      </div>
    </div>
  );
}

function StatCard({ s, bg, delay }) {
  return (
    <div style={{ background:C.white,borderRadius:16,padding:20,border:`1px solid rgba(107,47,160,0.08)`,boxShadow:C.shadow,animation:`fadeUp .5s ${delay}s ease both` }}>
      <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14 }}>
        <div style={{ width:42,height:42,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,color:C.p600 }}>
          <i className={`fa-solid ${s.icon}`} />
        </div>
        <span style={{ fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:6, ...(s.nu?{color:C.txt2,background:C.p100}:s.up?{color:"#059669",background:"#d1fae5"}:{color:"#dc2626",background:"#fee2e2"}) }}>{s.trend}</span>
      </div>
      <div style={{ fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:C.p800,lineHeight:1,marginBottom:4 }}>{s.value}</div>
      <div style={{ fontSize:12.5,color:C.txt2 }}>{s.label}</div>
      <div style={{ fontSize:11,color:C.p400,marginTop:8 }}>{s.sub}</div>
    </div>
  );
}

function DCard({ title, sub, action, children }) {
  return (
    <div style={{ background:C.white,borderRadius:18,padding:24,border:`1px solid rgba(107,47,160,0.08)`,boxShadow:C.shadow }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
        <div>
          <div style={{ fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,color:C.p800 }}>{title}</div>
          {sub&&<div style={{ fontSize:12,color:C.txt2,marginTop:2 }}>{sub}</div>}
        </div>
        {action&&<button style={{ fontSize:12,color:C.p500,fontWeight:600,cursor:"pointer",padding:"6px 12px",border:`1px solid ${C.p200}`,borderRadius:8,background:"none",fontFamily:"'DM Sans',sans-serif" }}>{action}</button>}
      </div>
      {children}
    </div>
  );
}

function SimplePage({ icon, title, desc }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"60vh",textAlign:"center" }}>
      <div style={{ fontSize:64,marginBottom:20,opacity:.7 }}>{icon}</div>
      <h2 style={{ fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:C.p800,marginBottom:8 }}>{title}</h2>
      <p style={{ fontSize:14,color:C.txt2,maxWidth:360,lineHeight:1.6 }}>{desc}</p>
      <div style={{ marginTop:24 }}>
        <Btn primary>Próximamente disponible</Btn>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PROFILE PAGE
   ════════════════════════════════════════ */
function ProfilePage() {
  const [toggles, setToggles] = useState({ notif:true, email:false, sms:true, privado:true, dos:false });
  const toggle = k => setToggles(p=>({...p,[k]:!p[k]}));
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre:"Ana Rodríguez", email:"ana.rodriguez@equoria.mx", telefono:"+52 614 555 0178", estado:"Chihuahua", ciudad:"Chihuahua", bio:"Coordinadora regional del programa de apoyo a víctimas de violencia de género." });

  return (
    <div style={{ animation:"fadeUp .4s ease both", maxWidth:960, margin:"0 auto" }}>

      {/* Hero banner */}
      <div style={{ background:`linear-gradient(135deg,${C.p900} 0%,${C.p700} 45%,${C.p500} 100%)`, borderRadius:20, padding:28, marginBottom:24, position:"relative", overflow:"hidden", boxShadow:C.shadowLg }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 20% 50%,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize:"28px 28px" }} />
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(232,121,160,0.15)", filter:"blur(30px)" }} />
        <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:24 }}>
          <div style={{ width:80,height:80,borderRadius:18,background:`linear-gradient(135deg,${C.p400},${C.rose})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:700,color:"white",boxShadow:"0 6px 20px rgba(232,121,160,0.4)",flexShrink:0 }}>AR</div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"white",marginBottom:4 }}>{form.nombre}</h3>
            <p style={{ fontSize:13,color:"rgba(255,255,255,0.65)" }}>Administradora · {form.ciudad}, {form.estado}</p>
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",borderRadius:20,padding:"4px 14px",fontSize:11,color:"white",fontWeight:600,marginTop:8 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:C.green,display:"inline-block" }} /> Cuenta verificada
            </div>
          </div>
          <button onClick={()=>setEditMode(!editMode)} style={{ background:editMode?"rgba(232,121,160,0.3)":"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"white",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:8 }}>
            <i className={`fa-solid ${editMode?"fa-check":"fa-pen"}`} /> {editMode?"Guardar cambios":"Editar perfil"}
          </button>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 }}>
        {/* Personal info */}
        <DCard title="Información personal" sub="Datos de tu cuenta">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[["Nombre completo","nombre"],["Correo electrónico","email"],["Teléfono","telefono"],["Estado","estado"],["Ciudad","ciudad"]].map(([label,key])=>(
              <div key={key} style={{ gridColumn:key==="bio"?"span 2":"auto" }}>
                <label style={{ fontSize:11,fontWeight:600,color:C.txt2,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6 }}>{label}</label>
                {editMode ? (
                  <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} style={{ width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.p200}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.txt,background:C.p100 }} />
                ) : (
                  <div style={{ fontSize:14,color:C.txt,fontWeight:500 }}>{form[key]}</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop:14 }}>
            <label style={{ fontSize:11,fontWeight:600,color:C.txt2,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6 }}>Biografía</label>
            {editMode ? (
              <textarea value={form.bio} onChange={e=>setForm(p=>({...p,bio:e.target.value}))} rows={3} style={{ width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${C.p200}`,fontFamily:"'DM Sans',sans-serif",fontSize:13,color:C.txt,background:C.p100,resize:"vertical" }} />
            ) : (
              <div style={{ fontSize:13,color:C.txt2,lineHeight:1.6 }}>{form.bio}</div>
            )}
          </div>
        </DCard>

        {/* Stats + contacts */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <DCard title="Estadísticas">
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
              {[["312","Casos gestionados"],["47","Usuarias atendidas"],["128","Días activa"],["98%","Tasa de resolución"]].map(([n,l])=>(
                <div key={l} style={{ background:C.p100,borderRadius:12,padding:"14px 16px" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.p700 }}>{n}</div>
                  <div style={{ fontSize:12,color:C.txt2,marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
          </DCard>

          <DCard title="Contactos de emergencia">
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
              {[["🧡","Mamá","Familiar","614-555-0001"],["💙","Carlos R.","Pareja","614-555-0002"],["💚","Dra. López","Médica","614-555-0003"]].map(([ic,name,rel,tel])=>(
                <div key={name} style={{ background:C.white,borderRadius:14,padding:16,border:`1px solid rgba(107,47,160,0.08)`,boxShadow:C.shadow,cursor:"pointer",transition:"transform .2s" }}>
                  <div style={{ width:40,height:40,borderRadius:10,background:C.p100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,marginBottom:10 }}>{ic}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:C.p800,marginBottom:2 }}>{name}</div>
                  <div style={{ fontSize:11,color:C.txt2,marginBottom:6 }}>{rel}</div>
                  <div style={{ fontSize:12,fontWeight:600,color:C.p600 }}>{tel}</div>
                </div>
              ))}
            </div>
          </DCard>
        </div>
      </div>

      {/* Settings */}
      <DCard title="Configuración de la cuenta">
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:0 }}>
          {[
            ["notif","Notificaciones push","Recibe alertas en tiempo real"],
            ["email","Correo electrónico","Envío de reportes semanales"],
            ["sms","Mensajes SMS","Alertas de emergencia por SMS"],
            ["privado","Perfil privado","Solo admins pueden ver tu perfil"],
            ["dos","Verificación en dos pasos","Seguridad adicional al iniciar sesión"],
          ].map(([k,label,desc])=>(
            <div key={k} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid rgba(107,47,160,0.05)` }}>
              <div>
                <div style={{ fontSize:13,fontWeight:500 }}>{label}</div>
                <div style={{ fontSize:11,color:C.txt2,marginTop:2 }}>{desc}</div>
              </div>
              <div onClick={()=>toggle(k)} style={{ width:44,height:24,background:toggles[k]?C.p500:C.p200,borderRadius:12,cursor:"pointer",position:"relative",transition:"background .25s",border:"none",flexShrink:0,marginLeft:16 }}>
                <div style={{ position:"absolute",top:3,left:toggles[k]?23:3,width:18,height:18,background:"white",borderRadius:"50%",transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
              </div>
            </div>
          ))}
        </div>
      </DCard>
    </div>
  );
}

/* ════════════════════════════════════════
   ROOT APP
   ════════════════════════════════════════ */
export default function App() {
  const [view, setView] = useState("landing"); // "landing" | "dashboard"

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {view === "landing"   && <LandingPage setView={setView} />}
      {view === "dashboard" && <DashboardApp setView={setView} />}
    </>
  );
}