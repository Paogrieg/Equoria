import { useState } from "react";
import { useFeed } from "../hooks/useFeed";
import { API_BASE } from "../api/client";
import { PostCard, Skeleton } from "../components/PostCard";
import { FeedNavbar, LeftSidebar, RightSidebar } from "../components/FeedLayout";
import "../styles/equoria.css"; 

export default function EquoriaFeed() {
  const [activeTab,  setActiveTab]  = useState("inicio");
  const [activePage, setActivePage] = useState("inicio");
  const [search,     setSearch]     = useState("");

  const { feed, news, testimonials, laws, loading, error, refetch } = useFeed();

  // Filtros
  const tabFiltered = feed.filter(p => {
    if (activeTab === "inicio")      return true;
    if (activeTab === "noticias")    return p.type === "news";
    if (activeTab === "testimonios") return p.type === "testimony";
    if (activeTab === "leyes")       return p.type === "law";
    return true;
  });

  const filtered = search.trim()
    ? tabFiltered.filter(p =>
        (p.title       || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.content     || "").toLowerCase().includes(search.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(search.toLowerCase())
      )
    : tabFiltered;

  const apiOk = !loading && !error;
  const stats = { news: news.length, test: testimonials.length, laws: laws.length };

  return (
    <>
      <FeedNavbar 
        apiOk={apiOk} error={error} loading={loading} stats={stats}
        search={search} setSearch={setSearch} 
        activeTab={activeTab} setActiveTab={setActiveTab} setActivePage={setActivePage} 
      />

      <div className="eq-layout">
        <LeftSidebar activePage={activePage} setActivePage={setActivePage} setActiveTab={setActiveTab} />

        <main className="eq-feed">
          {/* Caja de Redacción */}
          <div className="eq-compose">
            <div className="eq-compose-row">
              <div className="eq-user-av" style={{ width: 42, height: 42, borderRadius: 12 }}>MG</div>
              <input className="eq-compose-input" placeholder="Comparte tu experiencia o testimonio..." />
            </div>
            <div className="eq-compose-actions">
              <button className="eq-compose-act"><i className="fa-solid fa-user-secret" /> Anónimo</button>
              <button className="eq-compose-act"><i className="fa-solid fa-paper-plane" /> Publicar</button>
            </div>
          </div>

          {/* Estados de Carga y Error */}
          {loading && [1, 2, 3].map(i => <Skeleton key={i} />)}

          {error && !loading && (
            <div className="eq-empty">
              <div className="eq-empty-icon"><i className="fa-solid fa-tower-broadcast" /></div>
              <div className="eq-empty-title">Sin conexión con la API</div>
              <div className="eq-empty-sub">
                Verifica tu servidor en <code>{API_BASE}</code>. Error: {error}
              </div>
              <button className="eq-retry-btn" onClick={refetch}><i className="fa-solid fa-rotate-right" /> Reintentar</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="eq-empty">
              <div className="eq-empty-icon"><i className="fa-solid fa-magnifying-glass" /></div>
              <div className="eq-empty-title">Sin resultados</div>
            </div>
          )}

          {/* Lista de Publicaciones */}
          {!loading && !error && filtered.map((p, i) => (
            <PostCard key={`${p.type}-${p.id}`} post={p} delay={i * 0.06} />
          ))}
        </main>

        <RightSidebar stats={stats} loading={loading} refetch={refetch} />
      </div>
    </>
  );
}