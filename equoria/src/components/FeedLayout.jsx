import { TABS, MENU, TRENDING, RESOURCES, CONTACTS } from "../constants/feedData";

export function FeedNavbar({ apiOk, error, loading, search, setSearch, activeTab, setActiveTab, setActivePage, stats }) {
  return (
    <nav className="eq-nav">
      <div className="eq-nav-logo">
        <div className="eq-nav-logo-icon"><i className="fa-solid fa-shield-heart" /></div>
        <h1>
          Equoria
          {apiOk  && <span className="eq-api-badge"><i className="fa-solid fa-circle-check" /> API</span>}
          {error  && <span className="eq-api-badge error"><i className="fa-solid fa-circle-xmark" /> Error</span>}
        </h1>
      </div>

      <div className="eq-nav-search">
        <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--text-secondary)", fontSize: 13 }} />
        <input placeholder="Buscar noticias, leyes, testimonios…" value={search} onChange={e => setSearch(e.target.value)} />
        {search && <i className="fa-solid fa-xmark" style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
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
            {t.id === "noticias"    && !loading && <span className="badge-news">{stats.news}</span>}
            {t.id === "testimonios" && !loading && <span className="badge-test">{stats.test}</span>}
            {t.id === "leyes"       && !loading && <span className="badge-law">{stats.laws}</span>}
          </button>
        ))}
      </div>

      <div className="eq-nav-right">
        <div className="eq-notif-btn"><i className="fa-solid fa-bell" /><div className="eq-notif-dot" /></div>
        <button className="eq-sos-btn"><i className="fa-solid fa-phone-volume" /> SOS</button>
        <div className="eq-user-av">MG</div>
      </div>
    </nav>
  );
}

export function LeftSidebar({ activePage, setActivePage, setActiveTab }) {
  return (
    <aside className="eq-left">
      <div className="eq-profile-card">
        <div className="eq-profile-cover" />
        <div className="eq-profile-av-wrap"><div className="eq-profile-av">MG</div></div>
        <div className="eq-profile-info">
          <div className="eq-profile-name">María González</div>
          <span className="eq-profile-role">Usuaria verificada</span>
        </div>
      </div>

      <div className="eq-menu-card">
        {MENU.map(m => (
          <button
            key={m.id}
            className={`eq-menu-item ${activePage === m.id ? "active" : ""}`}
            onClick={() => { setActivePage(m.id); setActiveTab(m.id === "inicio" ? "inicio" : m.id); }}
          >
            <i className={`fa-solid ${m.icon}`} /> {m.label}
          </button>
        ))}
      </div>

      <div className="eq-crisis-card">
        <div className="eq-crisis-title">¿Necesitas ayuda ahora?</div>
        <div className="eq-crisis-text">Si estás en peligro, llama de inmediato.</div>
        <button className="eq-crisis-btn"><i className="fa-solid fa-phone-volume" /> Línea de Crisis</button>
      </div>
    </aside>
  );
}

export function RightSidebar({ stats, loading, refetch }) {
  return (
    <aside className="eq-right">
      <div className="eq-widget">
        <div className="eq-widget-title"><i className="fa-solid fa-database" /> Datos en vivo</div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span>Noticias: {stats.news}</span>
            <span>Testimonios: {stats.test}</span>
            <span>Leyes: {stats.laws}</span>
        </div>
        <button className="eq-retry-btn" style={{ width: "100%" }} onClick={refetch}>
          <i className="fa-solid fa-rotate-right" /> Actualizar
        </button>
      </div>

      <div className="eq-widget">
        <div className="eq-widget-title"><i className="fa-solid fa-fire-flame-curved" /> Tendencias</div>
        {TRENDING.map((t, i) => (
          <div className="eq-trend-item" key={i}>
            <div className="eq-trend-cat">{t.cat}</div>
            <div className="eq-trend-tag">{t.tag}</div>
          </div>
        ))}
      </div>
    </aside>
  );
}