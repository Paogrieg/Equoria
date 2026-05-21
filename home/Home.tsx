import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════
   EQUORIA — Vista de Usuario (Red Social)
   Conectada a la API Laravel + JWT
   ══════════════════════════════════════════ */

// ── Cambia esta URL base a la de tu servidor Laravel ──
const API_BASE = "http://localhost:8000/api";

/* ─── API helpers ─── */
function getToken() {
  return localStorage.getItem("eq_token") || "";
}

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ─── CSS ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

  :root {
    --plum-900:#1a0a2e; --plum-800:#2d1254; --plum-700:#4a1e87; --plum-600:#6b2fa0;
    --plum-500:#8b3fbf; --plum-400:#a855d4; --plum-300:#c084e8; --plum-200:#ddb5f5; --plum-100:#f3e8ff;
    --rose-accent:#e879a0; --rose-light:#fce4ef; --gold:#f0c060;
    --surface:#faf7ff; --text-primary:#1a0a2e; --text-secondary:#6b5380; --white:#ffffff;
    --shadow:0 4px 24px rgba(107,47,160,0.10); --shadow-lg:0 12px 40px rgba(107,47,160,0.16);
    --green:#10b981;
  }

  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:'DM Sans',sans-serif;background:var(--surface);color:var(--text-primary);min-height:100vh;}

  /* ── TOPNAV ── */
  .eq-nav{
    position:sticky;top:0;z-index:200;background:var(--white);
    border-bottom:1px solid rgba(107,47,160,0.10);
    box-shadow:0 2px 16px rgba(107,47,160,0.07);
    padding:0 24px;height:62px;display:flex;align-items:center;gap:16px;
  }
  .eq-nav-logo{display:flex;align-items:center;gap:10px;flex-shrink:0;}
  .eq-nav-logo-icon{
    width:38px;height:38px;border-radius:10px;
    background:linear-gradient(135deg,var(--plum-600),var(--rose-accent));
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:17px;box-shadow:0 3px 12px rgba(232,121,160,0.35);
  }
  .eq-nav-logo h1{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--plum-800);letter-spacing:.5px;}
  .eq-nav-search{
    flex:1;max-width:380px;display:flex;align-items:center;
    background:var(--plum-100);border:1px solid rgba(107,47,160,0.12);
    border-radius:10px;padding:8px 14px;gap:8px;
  }
  .eq-nav-search input{
    border:none;background:transparent;font-family:'DM Sans',sans-serif;
    font-size:13px;color:var(--text-primary);outline:none;width:100%;
  }
  .eq-nav-search input::placeholder{color:var(--text-secondary);}
  .eq-nav-tabs{display:flex;align-items:center;gap:2px;flex:1;justify-content:center;}
  .eq-nav-tab{
    padding:8px 16px;border-radius:8px;border:none;background:none;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;
    color:var(--text-secondary);cursor:pointer;transition:all 0.2s;
    display:flex;align-items:center;gap:6px;white-space:nowrap;
  }
  .eq-nav-tab:hover{background:var(--plum-100);color:var(--plum-700);}
  .eq-nav-tab.active{background:var(--plum-100);color:var(--plum-700);font-weight:600;}
  .eq-nav-tab.active i{color:var(--rose-accent);}
  .eq-nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0;}
  .eq-notif-btn{
    width:36px;height:36px;border-radius:9px;
    border:1px solid rgba(107,47,160,0.15);background:var(--white);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;font-size:16px;color:var(--text-secondary);
    transition:all 0.2s;position:relative;
  }
  .eq-notif-btn:hover{background:var(--plum-100);}
  .eq-notif-dot{
    width:7px;height:7px;background:var(--rose-accent);border-radius:50%;
    position:absolute;top:5px;right:5px;border:1.5px solid white;
  }
  .eq-sos-btn{
    display:flex;align-items:center;gap:7px;
    background:linear-gradient(135deg,var(--rose-accent),#c2185b);
    color:white;border:none;border-radius:9px;
    padding:9px 16px;font-size:13px;font-weight:600;
    cursor:pointer;font-family:'DM Sans',sans-serif;
    box-shadow:0 4px 14px rgba(232,121,160,0.45);transition:all 0.2s;
  }
  .eq-sos-btn:hover{transform:translateY(-1px);}
  .eq-user-av{
    width:36px;height:36px;border-radius:9px;
    background:linear-gradient(135deg,var(--plum-500),var(--rose-accent));
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:13px;font-weight:600;cursor:pointer;flex-shrink:0;
  }

  /* ── LAYOUT ── */
  .eq-layout{
    display:grid;grid-template-columns:280px 1fr 300px;
    gap:24px;max-width:1200px;margin:0 auto;padding:28px 20px;
  }

  /* ── LEFT ── */
  .eq-left{display:flex;flex-direction:column;gap:16px;}
  .eq-profile-card{background:var(--white);border-radius:18px;border:1px solid rgba(107,47,160,0.08);box-shadow:var(--shadow);overflow:hidden;}
  .eq-profile-cover{
    height:64px;
    background:linear-gradient(120deg,var(--plum-700),var(--plum-500),var(--rose-accent));
    position:relative;
  }
  .eq-profile-cover::before{
    content:'';position:absolute;inset:0;opacity:0.06;
    background-image:radial-gradient(circle at 20% 50%,white 1px,transparent 1px);
    background-size:18px 18px;
  }
  .eq-profile-av-wrap{padding:0 20px;margin-top:-22px;position:relative;}
  .eq-profile-av{
    width:48px;height:48px;border-radius:13px;
    background:linear-gradient(135deg,var(--plum-500),var(--rose-accent));
    display:flex;align-items:center;justify-content:center;
    color:white;font-size:18px;font-weight:700;
    border:3px solid var(--white);box-shadow:0 4px 14px rgba(107,47,160,0.3);
  }
  .eq-profile-info{padding:10px 20px 20px;}
  .eq-profile-name{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--plum-800);margin-bottom:2px;}
  .eq-profile-role{font-size:11px;color:var(--plum-400);background:var(--plum-100);display:inline-block;padding:2px 10px;border-radius:20px;font-weight:600;}
  .eq-profile-stats{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid rgba(107,47,160,0.07);}
  .eq-pstat{text-align:center;}
  .eq-pstat-val{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--plum-700);}
  .eq-pstat-lbl{font-size:11px;color:var(--text-secondary);}

  .eq-menu-card{background:var(--white);border-radius:18px;border:1px solid rgba(107,47,160,0.08);box-shadow:var(--shadow);padding:16px;display:flex;flex-direction:column;gap:2px;}
  .eq-menu-item{
    display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;
    transition:all 0.2s;color:var(--text-secondary);font-size:13px;font-weight:500;
    border:none;background:none;font-family:'DM Sans',sans-serif;width:100%;text-align:left;
  }
  .eq-menu-item:hover{background:var(--plum-100);color:var(--plum-700);}
  .eq-menu-item.active{
    background:linear-gradient(90deg,rgba(232,121,160,0.12),rgba(168,85,212,0.08));
    color:var(--plum-700);font-weight:600;border-left:3px solid var(--rose-accent);
  }
  .eq-menu-item i{width:18px;text-align:center;font-size:15px;}

  .eq-crisis-card{background:linear-gradient(135deg,var(--plum-800),var(--plum-600));border-radius:18px;padding:20px;box-shadow:var(--shadow-lg);}
  .eq-crisis-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:white;margin-bottom:6px;}
  .eq-crisis-text{font-size:12px;color:rgba(255,255,255,0.65);margin-bottom:14px;line-height:1.5;}
  .eq-crisis-btn{
    display:flex;align-items:center;justify-content:center;gap:8px;
    background:var(--rose-accent);color:white;border:none;border-radius:10px;
    padding:11px;width:100%;font-size:13px;font-weight:700;cursor:pointer;
    font-family:'DM Sans',sans-serif;box-shadow:0 4px 14px rgba(232,121,160,0.5);transition:all 0.2s;
  }
  .eq-crisis-btn:hover{transform:translateY(-1px);}

  /* ── FEED ── */
  .eq-feed{display:flex;flex-direction:column;gap:20px;}

  .eq-story-row{display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none;}
  .eq-story-row::-webkit-scrollbar{display:none;}
  .eq-story{flex-shrink:0;width:80px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;}
  .eq-story-ring{width:62px;height:62px;border-radius:50%;padding:2px;background:linear-gradient(135deg,var(--rose-accent),var(--plum-400));}
  .eq-story-inner{width:100%;height:100%;border-radius:50%;border:2.5px solid var(--white);display:flex;align-items:center;justify-content:center;font-size:22px;}
  .eq-story-lbl{font-size:10px;color:var(--text-secondary);font-weight:500;text-align:center;}

  .eq-compose{background:var(--white);border-radius:18px;border:1px solid rgba(107,47,160,0.08);box-shadow:var(--shadow);padding:18px;}
  .eq-compose-row{display:flex;gap:12px;align-items:center;margin-bottom:14px;}
  .eq-compose-input{
    flex:1;background:var(--plum-100);border:1px solid rgba(107,47,160,0.12);
    border-radius:10px;padding:11px 16px;font-family:'DM Sans',sans-serif;
    font-size:13px;color:var(--text-primary);outline:none;
  }
  .eq-compose-input::placeholder{color:var(--text-secondary);}
  .eq-compose-actions{display:flex;gap:6px;border-top:1px solid rgba(107,47,160,0.07);padding-top:12px;}
  .eq-compose-act{
    flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
    padding:8px;border-radius:8px;border:none;background:none;
    font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
    color:var(--text-secondary);cursor:pointer;transition:all 0.2s;
  }
  .eq-compose-act:hover{background:var(--plum-100);color:var(--plum-700);}

  /* ── FILTER ── */
  .eq-filter-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;}
  .eq-filter-row::-webkit-scrollbar{display:none;}
  .eq-filter-pill{
    flex-shrink:0;padding:7px 16px;border-radius:20px;
    border:1.5px solid rgba(107,47,160,0.15);background:var(--white);
    font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
    color:var(--text-secondary);cursor:pointer;transition:all 0.2s;
  }
  .eq-filter-pill:hover{border-color:var(--plum-300);color:var(--plum-700);}
  .eq-filter-pill.active{
    background:linear-gradient(135deg,var(--plum-600),var(--plum-400));
    color:white;border-color:transparent;box-shadow:0 3px 10px rgba(107,47,160,0.3);
  }

  /* ── POST ── */
  .eq-post{
    background:var(--white);border-radius:18px;
    border:1px solid rgba(107,47,160,0.08);box-shadow:var(--shadow);
    overflow:hidden;animation:fadeInUp 0.4s ease both;
  }
  .eq-post-header{padding:18px 20px 12px;display:flex;align-items:center;gap:12px;}
  .eq-post-av{
    width:42px;height:42px;border-radius:12px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;font-size:17px;color:white;
  }
  .eq-post-meta{flex:1;}
  .eq-post-name{font-size:14px;font-weight:600;color:var(--plum-800);}
  .eq-post-sub{font-size:11px;color:var(--text-secondary);margin-top:1px;}
  .eq-post-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:3px 10px;border-radius:20px;}
  .tag-news{background:var(--plum-100);color:var(--plum-600);}
  .tag-test{background:var(--rose-light);color:#c2185b;}
  .tag-law{background:#fff8e6;color:#7c5a00;}

  .eq-post-body{padding:0 20px 16px;}
  .eq-post-title{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:var(--plum-800);line-height:1.35;margin-bottom:8px;}
  .eq-post-text{font-size:13.5px;line-height:1.7;color:var(--text-primary);}
  .eq-post-quote{
    margin:12px 0;padding:12px 16px;
    border-left:3px solid var(--rose-accent);
    background:var(--rose-light);border-radius:0 10px 10px 0;
    font-style:italic;font-size:13px;color:var(--plum-700);line-height:1.6;
  }
  .eq-post-law-box{
    margin:12px 20px;padding:16px;
    background:linear-gradient(135deg,#fff8e6,#fffdf5);
    border:1px solid rgba(240,192,96,0.4);border-radius:12px;
  }
  .eq-post-law-title{font-size:14px;font-weight:600;color:var(--plum-800);margin-bottom:4px;}
  .eq-post-law-meta{font-size:11px;color:var(--text-secondary);margin-bottom:8px;}
  .eq-post-law-desc{font-size:13px;color:var(--text-primary);line-height:1.6;}
  .eq-post-law-link{
    display:inline-flex;align-items:center;gap:5px;
    font-size:12px;font-weight:600;color:var(--plum-500);
    margin-top:8px;cursor:pointer;text-decoration:none;
  }
  .eq-post-footer{
    padding:12px 20px;border-top:1px solid rgba(107,47,160,0.06);
    display:flex;align-items:center;gap:4px;
  }
  .eq-post-action{
    display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:8px;
    border:none;background:none;font-family:'DM Sans',sans-serif;
    font-size:12px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all 0.2s;
  }
  .eq-post-action:hover{background:var(--plum-100);color:var(--plum-700);}
  .eq-post-action.liked{color:var(--rose-accent);}
  .eq-post-sep{flex:1;}
  .eq-post-share{
    display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;
    color:var(--plum-500);cursor:pointer;padding:7px 12px;border-radius:8px;
    transition:all 0.2s;background:none;border:none;font-family:'DM Sans',sans-serif;
  }
  .eq-post-share:hover{background:var(--plum-100);}
  .eq-anon-badge{
    display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:600;
    background:var(--plum-100);color:var(--plum-600);padding:2px 8px;border-radius:20px;margin-bottom:8px;
  }

  /* ── SKELETON ── */
  .eq-skeleton{background:var(--white);border-radius:18px;border:1px solid rgba(107,47,160,0.08);box-shadow:var(--shadow);padding:20px;}
  .eq-skel-line{background:linear-gradient(90deg,var(--plum-100) 25%,#ede8fa 50%,var(--plum-100) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:6px;height:12px;margin-bottom:10px;}
  @keyframes shimmer{0%{background-position:200% 0;}100%{background-position:-200% 0;}}

  /* ── ERROR/EMPTY ── */
  .eq-empty{text-align:center;padding:52px 20px;color:var(--text-secondary);}
  .eq-empty-icon{font-size:36px;color:var(--plum-200);margin-bottom:14px;}
  .eq-empty-title{font-family:'Playfair Display',serif;font-size:18px;color:var(--plum-700);margin-bottom:6px;}
  .eq-empty-sub{font-size:13px;line-height:1.5;}
  .eq-retry-btn{
    margin-top:14px;padding:9px 20px;border-radius:10px;
    background:var(--plum-100);color:var(--plum-600);border:none;
    font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;
    transition:all 0.2s;
  }
  .eq-retry-btn:hover{background:var(--plum-200);}

  /* ── RIGHT ── */
  .eq-right{display:flex;flex-direction:column;gap:16px;}
  .eq-widget{background:var(--white);border-radius:18px;border:1px solid rgba(107,47,160,0.08);box-shadow:var(--shadow);padding:20px;}
  .eq-widget-title{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--plum-800);margin-bottom:14px;display:flex;align-items:center;gap:8px;}
  .eq-widget-title i{color:var(--rose-accent);}

  .eq-trend-item{padding:10px 0;border-bottom:1px solid rgba(107,47,160,0.06);cursor:pointer;}
  .eq-trend-item:last-child{border-bottom:none;}
  .eq-trend-cat{font-size:10px;color:var(--text-secondary);font-weight:500;margin-bottom:2px;}
  .eq-trend-tag{font-size:13px;font-weight:600;color:var(--plum-700);}
  .eq-trend-count{font-size:11px;color:var(--text-secondary);margin-top:1px;}

  .eq-resource-item{
    display:flex;align-items:center;gap:12px;padding:10px 0;
    border-bottom:1px solid rgba(107,47,160,0.06);cursor:pointer;transition:all 0.2s;
  }
  .eq-resource-item:last-child{border-bottom:none;}
  .eq-resource-item:hover .eq-resource-name{color:var(--plum-600);}
  .eq-resource-icon{width:38px;height:38px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:17px;}
  .eq-resource-name{font-size:13px;font-weight:600;color:var(--plum-800);transition:color 0.2s;}
  .eq-resource-desc{font-size:11px;color:var(--text-secondary);margin-top:1px;}

  .eq-contact-item{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(107,47,160,0.06);}
  .eq-contact-item:last-child{border-bottom:none;}
  .eq-contact-icon{width:36px;height:36px;border-radius:10px;flex-shrink:0;background:var(--plum-100);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--plum-500);}
  .eq-contact-name{font-size:13px;font-weight:600;color:var(--plum-800);}
  .eq-contact-phone{font-size:12px;color:var(--rose-accent);font-weight:600;}

  /* ── API BADGE ── */
  .eq-api-badge{
    display:inline-flex;align-items:center;gap:5px;
    font-size:10px;padding:2px 8px;border-radius:20px;margin-left:8px;
    background:#d1fae5;color:#065f46;font-weight:600;
  }
  .eq-api-badge.error{background:#fee2e2;color:#991b1b;}

  @keyframes fadeInUp{from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);}}

  @media(max-width:1000px){.eq-layout{grid-template-columns:240px 1fr;gap:16px;}.eq-right{display:none;}}
  @media(max-width:700px){.eq-layout{grid-template-columns:1fr;padding:16px;}.eq-left{display:none;}.eq-nav-tabs{display:none;}}
`;

/* ─── Static data ─── */
const TABS = [
  { icon: "fa-house",          label: "Inicio",      id: "inicio" },
  { icon: "fa-newspaper",      label: "Noticias",    id: "noticias" },
  { icon: "fa-comment-dots",   label: "Testimonios", id: "testimonios" },
  { icon: "fa-scale-balanced", label: "Leyes",       id: "leyes" },
];

const TRENDING = [
  { cat: "Ley · Nacional",      tag: "#VidaLibreDeViolencia", count: "24.5K publicaciones" },
  { cat: "Campaña",             tag: "#NoEstásSola",          count: "18.2K publicaciones" },
  { cat: "Recurso · Chihuahua", tag: "#ProtocoloChihuahua",  count: "9.8K publicaciones" },
  { cat: "Derechos",            tag: "#AlertaDeGénero",       count: "7.1K publicaciones" },
];

const RESOURCES = [
  { icon: "fa-house-chimney-medical", bg: "#f3e8ff", color: "var(--plum-500)", name: "Centros de Refugio",  desc: "Red nacional de refugios seguros" },
  { icon: "fa-gavel",                 bg: "#fff8e6", color: "#7c5a00",          name: "Asesoría Jurídica",  desc: "Orientación legal gratuita" },
  { icon: "fa-brain",                 bg: "#fce4ef", color: "#c2185b",          name: "Apoyo Psicológico",  desc: "Atención especializada 24/7" },
  { icon: "fa-clipboard-list",        bg: "#e8f9f5", color: "#065f46",          name: "Cómo Denunciar",     desc: "Guía paso a paso" },
];

const CONTACTS = [
  { icon: "fa-phone-volume",  name: "Línea Nacional INMUJERES", phone: "800 900 1000" },
  { icon: "fa-shield-halved", name: "CNDH",                     phone: "800 202 3350" },
  { icon: "fa-hospital",      name: "Emergencias",              phone: "911" },
];

/* ─── Date formatter ─── */
function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diff = (Date.now() - d) / 1000;
  if (diff < 3600)  return `Hace ${Math.round(diff / 60)} min`;
  if (diff < 86400) return `Hace ${Math.round(diff / 3600)} h`;
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
}

function initials(name) {
  if (!name) return "?";
  return name.trim().split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

/* ─── Skeleton ─── */
function Skeleton() {
  return (
    <div className="eq-skeleton">
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div className="eq-skel-line" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="eq-skel-line" style={{ width: "50%", marginBottom: 6 }} />
          <div className="eq-skel-line" style={{ width: "30%" }} />
        </div>
      </div>
      <div className="eq-skel-line" style={{ width: "80%", height: 16, marginBottom: 10 }} />
      <div className="eq-skel-line" style={{ width: "100%", marginBottom: 6 }} />
      <div className="eq-skel-line" style={{ width: "90%", marginBottom: 6 }} />
      <div className="eq-skel-line" style={{ width: "60%" }} />
    </div>
  );
}

/* ─── Post card ─── */
function PostCard({ post, delay }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 300) + 10);

  const toggleLike = () => { setLiked(p => !p); setLikes(p => liked ? p - 1 : p + 1); };

  if (post.type === "news") {
    return (
      <div className="eq-post" style={{ animationDelay: `${delay}s` }}>
        <div className="eq-post-header">
          <div className="eq-post-av" style={{ background: "linear-gradient(135deg,#4a1e87,#a855d4)" }}>
            <i className="fa-solid fa-newspaper" />
          </div>
          <div className="eq-post-meta">
            <div className="eq-post-name">Equoria Noticias</div>
            <div className="eq-post-sub">{fmtDate(post.created_at)}</div>
          </div>
          <span className="eq-post-tag tag-news">Noticia</span>
        </div>
        <div className="eq-post-body">
          <div className="eq-post-title">{post.title}</div>
          <p className="eq-post-text">{post.content}</p>
        </div>
        <div className="eq-post-footer">
          <button className={`eq-post-action ${liked ? "liked" : ""}`} onClick={toggleLike}>
            <i className={`fa-${liked ? "solid" : "regular"} fa-heart`} /> {likes}
          </button>
          <button className="eq-post-action"><i className="fa-regular fa-comment" /> Comentar</button>
          <div className="eq-post-sep" />
          <button className={`eq-post-action ${saved ? "liked" : ""}`} onClick={() => setSaved(p => !p)}>
            <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark`} />
          </button>
          <button className="eq-post-share"><i className="fa-solid fa-share-nodes" /> Compartir</button>
        </div>
      </div>
    );
  }

  if (post.type === "testimony") {
    const gradients = [
      "linear-gradient(135deg,#e879a0,#c084e8)",
      "linear-gradient(135deg,#6b2fa0,#e879a0)",
      "linear-gradient(135deg,#a855d4,#6b2fa0)",
    ];
    const grad = gradients[post.id % gradients.length];
    const name = post.anonymous ? "Usuaria anónima" : (post.user?.name || `Usuaria #${post.user_id}`);
    const ini  = post.anonymous ? <i className="fa-solid fa-user-secret" /> : initials(post.user?.name || "U");

    return (
      <div className="eq-post" style={{ animationDelay: `${delay}s` }}>
        <div className="eq-post-header">
          <div className="eq-post-av" style={{ background: grad }}>
            {post.anonymous ? <i className="fa-solid fa-user-secret" /> : ini}
          </div>
          <div className="eq-post-meta">
            <div className="eq-post-name">{name}</div>
            <div className="eq-post-sub">Testimonio · {fmtDate(post.created_at)}</div>
          </div>
          <span className="eq-post-tag tag-test">Testimonio</span>
        </div>
        <div className="eq-post-body">
          {post.anonymous && (
            <div className="eq-anon-badge">
              <i className="fa-solid fa-user-secret" /> Testimonio anónimo
            </div>
          )}
          <div className="eq-post-quote">
            <i className="fa-solid fa-quote-left" style={{ opacity: 0.4, marginRight: 6 }} />
            {post.content}
          </div>
        </div>
        <div className="eq-post-footer">
          <button className={`eq-post-action ${liked ? "liked" : ""}`} onClick={toggleLike}>
            <i className={`fa-${liked ? "solid" : "regular"} fa-heart`} /> {likes}
          </button>
          <button className="eq-post-action"><i className="fa-regular fa-comment" /> Comentar</button>
          <div className="eq-post-sep" />
          <button className={`eq-post-action ${saved ? "liked" : ""}`} onClick={() => setSaved(p => !p)}>
            <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark`} />
          </button>
          <button className="eq-post-share"><i className="fa-solid fa-share-nodes" /> Compartir</button>
        </div>
      </div>
    );
  }

  if (post.type === "law") {
    return (
      <div className="eq-post" style={{ animationDelay: `${delay}s` }}>
        <div className="eq-post-header">
          <div className="eq-post-av" style={{ background: "linear-gradient(135deg,#7c5a00,#f0c060)" }}>
            <i className="fa-solid fa-scale-balanced" />
          </div>
          <div className="eq-post-meta">
            <div className="eq-post-name">Marco Legal</div>
            <div className="eq-post-sub">Ley · {post.state}</div>
          </div>
          <span className="eq-post-tag tag-law">Ley</span>
        </div>
        <div className="eq-post-body">
          <div className="eq-post-title">{post.title}</div>
        </div>
        <div className="eq-post-law-box">
          <div className="eq-post-law-title">
            <i className="fa-solid fa-scale-balanced" style={{ color: "#c09000", marginRight: 6 }} />
            {post.title}
          </div>
          <div className="eq-post-law-meta">
            <i className="fa-solid fa-map-pin" style={{ marginRight: 4 }} /> {post.state}
          </div>
          <div className="eq-post-law-desc">{post.description}</div>
          {post.url && (
            <a className="eq-post-law-link" href={post.url} target="_blank" rel="noreferrer">
              Ver ley completa <i className="fa-solid fa-arrow-right" />
            </a>
          )}
        </div>
        <div className="eq-post-footer">
          <button className={`eq-post-action ${liked ? "liked" : ""}`} onClick={toggleLike}>
            <i className={`fa-${liked ? "solid" : "regular"} fa-heart`} /> {likes}
          </button>
          <button className="eq-post-action"><i className="fa-regular fa-comment" /> Comentar</button>
          <div className="eq-post-sep" />
          <button className={`eq-post-action ${saved ? "liked" : ""}`} onClick={() => setSaved(p => !p)}>
            <i className={`fa-${saved ? "solid" : "regular"} fa-bookmark`} />
          </button>
          <button className="eq-post-share"><i className="fa-solid fa-share-nodes" /> Compartir</button>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── useFeed hook ─── */
function useFeed() {
  const [news,         setNews]         = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [laws,         setLaws]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [nRes, tRes, lRes] = await Promise.all([
        apiFetch("/new"),
        apiFetch("/testimonials"),
        apiFetch("/laws"),
      ]);
      setNews(        (nRes.data || []).map(n => ({ ...n, type: "news"      })));
      setTestimonials((tRes.data || []).map(t => ({ ...t, type: "testimony" })));
      setLaws(        (lRes.data || []).map(l => ({ ...l, type: "law"       })));
    } catch (e) {
      setError(e.message || "No se pudo conectar con la API");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Interleave: news → testimony → law → repeat
  const feed = [];
  const maxLen = Math.max(news.length, testimonials.length, laws.length);
  for (let i = 0; i < maxLen; i++) {
    if (news[i])         feed.push(news[i]);
    if (testimonials[i]) feed.push(testimonials[i]);
    if (laws[i])         feed.push(laws[i]);
  }

  return { feed, news, testimonials, laws, loading, error, refetch: fetchAll };
}

/* ─── Main App ─── */
export default function EquoriaFeed() {
  const [activeTab,  setActiveTab]  = useState("inicio");
  const [activePage, setActivePage] = useState("inicio");
  const [search,     setSearch]     = useState("");

  const { feed, news, testimonials, laws, loading, error, refetch } = useFeed();

  // Filter by active tab
  const tabFiltered = feed.filter(p => {
    if (activeTab === "inicio")      return true;
    if (activeTab === "noticias")    return p.type === "news";
    if (activeTab === "testimonios") return p.type === "testimony";
    if (activeTab === "leyes")       return p.type === "law";
    return true;
  });

  // Filter by search
  const filtered = search.trim()
    ? tabFiltered.filter(p =>
        (p.title       || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.content     || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase())
      )
    : tabFiltered;

  const apiOk = !loading && !error;

  return (
    <>
      <style>{css}</style>

      {/* TOPNAV */}
      <nav className="eq-nav">
        <div className="eq-nav-logo">
          <div className="eq-nav-logo-icon"><i className="fa-solid fa-shield-heart" /></div>
          <h1>
            Equoria
            {apiOk  && <span className="eq-api-badge"><i className="fa-solid fa-circle-check" /> API</span>}
            {error  && <span className="eq-api-badge error"><i className="fa-solid fa-circle-xmark" /> Sin conexión</span>}
          </h1>
        </div>

        <div className="eq-nav-search">
          <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--text-secondary)", fontSize: 13 }} />
          <input
            placeholder="Buscar noticias, leyes, testimonios…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <i
              className="fa-solid fa-xmark"
              style={{ color: "var(--text-secondary)", cursor: "pointer" }}
              onClick={() => setSearch("")}
            />
          )}
        </div>

        <div className="eq-nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`eq-nav-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => { setActiveTab(t.id); setActivePage(t.id); }}
            >
              <i className={`fa-solid ${t.icon}`} />
              {t.label}
              {t.id === "noticias"    && !loading && <span style={{ fontSize: 10, background: "var(--plum-200)", color: "var(--plum-700)", padding: "1px 6px", borderRadius: 10, marginLeft: 2 }}>{news.length}</span>}
              {t.id === "testimonios" && !loading && <span style={{ fontSize: 10, background: "var(--rose-light)", color: "#c2185b", padding: "1px 6px", borderRadius: 10, marginLeft: 2 }}>{testimonials.length}</span>}
              {t.id === "leyes"       && !loading && <span style={{ fontSize: 10, background: "#fff8e6", color: "#7c5a00", padding: "1px 6px", borderRadius: 10, marginLeft: 2 }}>{laws.length}</span>}
            </button>
          ))}
        </div>

        <div className="eq-nav-right">
          <div className="eq-notif-btn">
            <i className="fa-solid fa-bell" />
            <div className="eq-notif-dot" />
          </div>
          <button className="eq-sos-btn">
            <i className="fa-solid fa-phone-volume" /> SOS
          </button>
          <div className="eq-user-av">MG</div>
        </div>
      </nav>

      <div className="eq-layout">
        {/* LEFT */}
        <aside className="eq-left">
          <div className="eq-profile-card">
            <div className="eq-profile-cover" />
            <div className="eq-profile-av-wrap">
              <div className="eq-profile-av">MG</div>
            </div>
            <div className="eq-profile-info">
              <div className="eq-profile-name">María González</div>
              <span className="eq-profile-role">Usuaria verificada</span>
              <div className="eq-profile-stats">
              </div>
            </div>
          </div>

          <div className="eq-menu-card">
            {MENU.map(m => (
              <button
                key={m.id}
                className={`eq-menu-item ${activePage === m.id ? "active" : ""}`}
                onClick={() => { setActivePage(m.id); setActiveTab(m.id === "inicio" ? "inicio" : m.id); }}
              >
                <i className={`fa-solid ${m.icon}`} />
                {m.label}
              </button>
            ))}
          </div>

          <div className="eq-crisis-card">
            <div className="eq-crisis-title">¿Necesitas ayuda ahora?</div>
            <div className="eq-crisis-text">Si estás en peligro, llama de inmediato. No estás sola.</div>
            <button className="eq-crisis-btn">
              <i className="fa-solid fa-phone-volume" /> Línea de Crisis
            </button>
          </div>
        </aside>

        {/* FEED */}
        <main className="eq-feed">

          {/* Compose */}
          <div className="eq-compose">
            <div className="eq-compose-row">
              <div className="eq-user-av" style={{ width: 42, height: 42, borderRadius: 12, fontSize: 15, flexShrink: 0 }}>MG</div>
              <input className="eq-compose-input" placeholder="Comparte tu experiencia o testimonio de forma anónima…" />
            </div>
            <div className="eq-compose-actions">
              <button className="eq-compose-act">
                <i className="fa-solid fa-user-secret" style={{ color: "var(--plum-400)" }} /> Anónimo
              </button>
              <button className="eq-compose-act">
                <i className="fa-solid fa-link" style={{ color: "var(--rose-accent)" }} /> Recurso
              </button>
              <button className="eq-compose-act">
                <i className="fa-solid fa-paper-plane" style={{ color: "var(--green)" }} /> Publicar
              </button>
            </div>
          </div>

          {/* Loading skeletons */}
          {loading && [1, 2, 3].map(i => <Skeleton key={i} />)}

          {/* Error state */}
          {error && !loading && (
            <div className="eq-empty">
              <div className="eq-empty-icon"><i className="fa-solid fa-tower-broadcast" /></div>
              <div className="eq-empty-title">Sin conexión con la API</div>
              <div className="eq-empty-sub">
                Verifica que el servidor Laravel esté corriendo en <code>{API_BASE}</code> y que el token JWT sea válido.
                <br />Error: {error}
              </div>
              <button className="eq-retry-btn" onClick={refetch}>
                <i className="fa-solid fa-rotate-right" /> Reintentar
              </button>
            </div>
          )}

          {/* Empty search */}
          {!loading && !error && filtered.length === 0 && (
            <div className="eq-empty">
              <div className="eq-empty-icon"><i className="fa-solid fa-magnifying-glass" /></div>
              <div className="eq-empty-title">Sin resultados</div>
              <div className="eq-empty-sub">Prueba con otras palabras clave o cambia el filtro.</div>
            </div>
          )}

          {/* Posts */}
          {!loading && !error && filtered.map((p, i) => (
            <PostCard key={`${p.type}-${p.id}`} post={p} delay={i * 0.06} />
          ))}
        </main>

        {/* RIGHT */}
        <aside className="eq-right">
          <div className="eq-widget">
            <div className="eq-widget-title">
              <i className="fa-solid fa-database" /> Datos en vivo
            </div>
            {[
              { label: "Noticias", count: news.length, icon: "fa-newspaper", color: "var(--plum-500)" },
              { label: "Testimonios", count: testimonials.length, icon: "fa-comment-dots", color: "var(--rose-accent)" },
              { label: "Leyes", count: laws.length, icon: "fa-scale-balanced", color: "#7c5a00" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 2 ? "1px solid rgba(107,47,160,0.06)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--plum-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className={`fa-solid ${s.icon}`} style={{ color: s.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--plum-800)" }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>registros en BD</div>
                </div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: s.color }}>
                  {loading ? "…" : s.count}
                </div>
              </div>
            ))}
            <button className="eq-retry-btn" style={{ width: "100%", marginTop: 10 }} onClick={refetch}>
              <i className="fa-solid fa-rotate-right" /> Actualizar
            </button>
          </div>

          <div className="eq-widget">
            <div className="eq-widget-title"><i className="fa-solid fa-fire-flame-curved" /> Tendencias</div>
            {TRENDING.map((t, i) => (
              <div className="eq-trend-item" key={i}>
                <div className="eq-trend-cat">{t.cat}</div>
                <div className="eq-trend-tag">{t.tag}</div>
                <div className="eq-trend-count">{t.count}</div>
              </div>
            ))}
          </div>

          <div className="eq-widget">
            <div className="eq-widget-title"><i className="fa-solid fa-hand-holding-heart" /> Recursos de Ayuda</div>
            {RESOURCES.map((r, i) => (
              <div className="eq-resource-item" key={i}>
                <div className="eq-resource-icon" style={{ background: r.bg, color: r.color }}>
                  <i className={`fa-solid ${r.icon}`} />
                </div>
                <div>
                  <div className="eq-resource-name">{r.name}</div>
                  <div className="eq-resource-desc">{r.desc}</div>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ color: "var(--plum-300)", fontSize: 11, marginLeft: "auto" }} />
              </div>
            ))}
          </div>

          <div className="eq-widget">
            <div className="eq-widget-title"><i className="fa-solid fa-phone-volume" /> Contactos de Emergencia</div>
            {CONTACTS.map((c, i) => (
              <div className="eq-contact-item" key={i}>
                <div className="eq-contact-icon"><i className={`fa-solid ${c.icon}`} /></div>
                <div>
                  <div className="eq-contact-name">{c.name}</div>
                  <div className="eq-contact-phone">{c.phone}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.6, padding: "0 4px" }}>
            Equoria es una plataforma confidencial de prevención y apoyo. Toda la información está protegida.
          </div>
        </aside>
      </div>
    </>
  );
}